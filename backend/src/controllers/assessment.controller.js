import { asyncHandler } from "../utils/asyncHandler.js";
import { Session } from "../models/session.model.js";
import { Question } from "../models/question.model.js";
import { Attempt } from "../models/attempt.model.js";
import { AssessmentData } from "../models/assessmentData.model.js"; // 🔥 Added AssessmentData Import
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import path from "path";
import axios from "axios";

const startAssessment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    let { assessmentId } = req.body || {};

    // 🔥 If frontend doesn't send an ID, default to the active one we just seeded
    if (!assessmentId) {
        const defaultAssessment = await AssessmentData.findOne({ isActive: true });
        if (!defaultAssessment) throw new ApiError(404, "No active assessments found");
        assessmentId = defaultAssessment._id;
    }

    const session = await Session.create({
        user: userId,
        assessment: assessmentId // 🔥 Now tracking WHICH test they are taking
    });

    // 🔥 Fetch first question FOR THIS SPECIFIC ASSESSMENT
    const firstQuestion = await Question.findOne({ assessment: assessmentId }).sort({ order: 1 });

    if (!firstQuestion) {
        throw new ApiError(404, "No questions found");
    }
    
    // 🔥 Count questions scoped to this assessment
    const totalQuestions = await Question.countDocuments({ assessment: assessmentId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    sessionId: session._id,
                    question: firstQuestion,
                    totalQuestions
                },
                "Assessment Started"
            )
        );
});

const submitAnswer = asyncHandler(async (req, res) => {
    const { sessionId, submittedEarly } = req.body;

    const session = await Session.findById(sessionId);

    if (!session || session.status !== "active") {
        throw new ApiError(400, "Invalid or completed session");
    }

    // 🔥 Get current question FOR THIS SPECIFIC ASSESSMENT
    const currentQuestion = await Question.findOne({
        assessment: session.assessment,
        order: session.currentQuestionIndex + 1
    });

    if (!currentQuestion) {
        throw new ApiError(404, "Question not found");
    }

    if (!req.file) {
        throw new ApiError(400, "Audio file is required");
    }

    // 🟡 Step 1: Save empty attempt immediately
    const attempt = await Attempt.create({
        session: session._id,
        question: currentQuestion._id,
        transcript: "",
        score: 0,
        weight: currentQuestion.weight,
        submittedEarly: submittedEarly || false,
        breakdown: {},
        metrics: {}
    });

    // 🟡 Step 2: Run Python in background (NO AWAIT)
    axios.post(
        "http://127.0.0.1:8000/analyze",
        {
            file_path: path.resolve(req.file.path),
            ideal_answer: currentQuestion.ideal_answer, // 🔥 SENDING IDEAL ANSWER!
            keywords: currentQuestion.keywords || []    // 🔥 SENDING KEYWORDS!
        }
    )
    .then(async (pythonResponse) => {
        const { transcript, confidence_score, score_breakdown, metrics } = pythonResponse.data;

        // 🔥 Update attempt later
        await Attempt.findByIdAndUpdate(attempt._id, {
            transcript,
            score: confidence_score,
            breakdown: score_breakdown,
            metrics
        });

        console.log("✅ Background processing done");
    })
    .catch(err => {
        console.error("❌ Python processing failed", err.message);
    });

    // Move to next question
    session.currentQuestionIndex += 1;
    await session.save();

    // 🔥 Scope total questions check to this assessment
    const totalQuestions = await Question.countDocuments({ assessment: session.assessment });

    if (session.currentQuestionIndex >= totalQuestions) {

        // 🔥 GET ATTEMPTS FIRST
        const attempts = await Attempt.find({ session: session._id });

        let totalFillers = 0;
        let avgWPS = 0;
        let avgRelevance = 0;
        let totalPause = 0;

        attempts.forEach(a => {
            totalFillers += a.metrics?.filler_count || 0;
            avgWPS += a.metrics?.words_per_second || 0;
            avgRelevance += a.metrics?.relevance_similarity || 0;
            totalPause += a.metrics?.long_pause_count || 0;
        });

        const count = attempts.length || 1;

        const analytics = {
            filler_count: totalFillers,
            words_per_second: (avgWPS / count).toFixed(2),
            relevance: (avgRelevance / count).toFixed(2),
            pause_count: totalPause
        };

        let totalWeightedScore = 0;
        let totalWeight = 0;

        attempts.forEach(a => {
            totalWeightedScore += a.score * a.weight;
            totalWeight += a.weight;
        });

        const finalScore =
            totalWeight === 0
                ? 0
                : Math.round(totalWeightedScore / totalWeight);

        session.status = "completed";
        session.totalScore = finalScore;
        await session.save();

        const durationMs = session.updatedAt - session.createdAt;
        const durationSeconds = Math.floor(durationMs / 1000);

        return res.status(200).json({
            completed: true,
            finalScore,
            duration: durationSeconds,
            analytics,
            attempts
        });
    }

    // ✅ Otherwise send next question for this assessment
    const nextQuestion = await Question.findOne({
        assessment: session.assessment,
        order: session.currentQuestionIndex + 1
    });

    return res.status(200).json({
        completed: false,
        nextQuestion
    });
});

const finishAssessment = asyncHandler(async (req, res) => {
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId);

    if (!session || session.status !== "active") {
        throw new ApiError(400, "Invalid or already completed session");
    }

    const attempts = await Attempt.find({ session: session._id });

    if (attempts.length === 0) {
        throw new ApiError(400, "No attempts found");
    }

    let totalWeightedScore = 0;
    let totalWeight = 0;

    attempts.forEach(a => {
        totalWeightedScore += a.score * a.weight;
        totalWeight += a.weight;
    });

    const finalScore =
        totalWeight === 0
            ? 0
            : Math.round(totalWeightedScore / totalWeight);

    session.status = "completed";
    session.totalScore = finalScore;
    await session.save();

    const durationMs = session.updatedAt - session.createdAt;
    const durationSeconds = Math.floor(durationMs / 1000);

    let totalFillers = 0;
    let avgWPS = 0;
    let avgRelevance = 0;
    let totalPause = 0;

    attempts.forEach(a => {
        totalFillers += a.metrics?.filler_count || 0;
        avgWPS += a.metrics?.words_per_second || 0;
        avgRelevance += a.metrics?.relevance_similarity || 0;
        totalPause += a.metrics?.long_pause_count || 0;
    });

    const count = attempts.length || 1;

    const analytics = {
        filler_count: totalFillers,
        words_per_second: (avgWPS / count).toFixed(2),
        relevance: (avgRelevance / count).toFixed(2),
        pause_count: totalPause
    };

    return res.status(200).json({
        completed: true,
        finalScore,
        duration: durationSeconds,
        analytics,
        attempts
    });
});

const getHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Fetch history, optionally you can populate 'assessment' here later if you want titles in history
    const sessions = await Session.find({ user: userId, status: "completed" })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, sessions, "History fetched")
    );
});

const getSessionDetails = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);

    if (!session) {
        throw new ApiError(404, "Session not found");
    }

    const attempts = await Attempt.find({ session: sessionId });

    const durationMs = session.updatedAt - session.createdAt;
    const durationSeconds = Math.floor(durationMs / 1000);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                finalScore: session.totalScore,
                duration: durationSeconds,
                attempts
            },
            "Session details fetched"
        )
    );
});

const getActiveAssessments = asyncHandler(async (req, res) => {
    const assessments = await AssessmentData.find({ isActive: true });
    return res.status(200).json(
        new ApiResponse(200, assessments, "Assessments fetched successfully")
    );
});

export { startAssessment, submitAnswer, finishAssessment, getHistory, getSessionDetails, getActiveAssessments };
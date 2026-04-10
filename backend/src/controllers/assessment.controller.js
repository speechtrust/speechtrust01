import { asyncHandler } from "../utils/asyncHandler.js";
import { Session } from "../models/session.model.js";
import { Question } from "../models/question.model.js";
import { Attempt } from "../models/attempt.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import path from "path";
import axios from "axios";

const startAssessment = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const session = await Session.create({
        user: userId
    });

    // Fetch first question
    const firstQuestion = await Question.findOne().sort({ order: 1 });

    if (!firstQuestion) {
        throw new ApiError(404, "No questions found");
    }
    const totalQuestions = await Question.countDocuments();



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

    // Get current question
    const currentQuestion = await Question.findOne({
        order: session.currentQuestionIndex + 1
    });

    if (!currentQuestion) {
        throw new ApiError(404, "Question not found");
    }

    if (!req.file) {
        throw new ApiError(400, "Audio file is required");
    }

    // Send audio to Python
    const pythonResponse = await axios.post(
        "http://127.0.0.1:8000/analyze",
        {
            file_path: path.resolve(req.file.path),
            question_text: currentQuestion.text
        }
    );

    const { transcript, confidence_score, score_breakdown, metrics } = pythonResponse.data;

    // Save attempt
    await Attempt.create({
        session: session._id,
        question: currentQuestion._id,
        transcript,
        score: confidence_score,
        weight: currentQuestion.weight,
        submittedEarly: submittedEarly || false,
        breakdown: pythonResponse.data.score_breakdown,
        metrics: pythonResponse.data.metrics
    });

    // Move to next question
    session.currentQuestionIndex += 1;
    await session.save();

    // 🔥 NEW LOGIC (IMPORTANT)
    const totalQuestions = await Question.countDocuments();

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

    // ✅ Otherwise send next question
    const nextQuestion = await Question.findOne({
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

    return res.status(200).json({
        completed: true,
        finalScore,
        duration: durationSeconds
    });
});

const getHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

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

export { startAssessment, submitAnswer, finishAssessment, getHistory, getSessionDetails };
import { asyncHandler } from "../utils/asyncHandler.js";
import { Session } from "../models/session.model.js";
import { Question } from "../models/Question.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    sessionId: session._id,
                    question: firstQuestion
                },
                "Assessment Started"
            )
        );
});

const Submitanswer = asyncHandler((req, res) => {

});

const finishAssessment = asyncHandler((req, res) => {

});

export { startAssessment, Submitanswer, finishAssessment };
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssessmentData',
        required: true
    },
    currentQuestionIndex: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    totalScore: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const Session = mongoose.model('Session', sessionSchema);
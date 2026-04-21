import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssessmentData',
        required: true // Links this question to a specific test
    },
    text: { 
        type: String, 
        required: true 
    },
    ideal_answer: { 
        type: String, 
        required: true 
    },
    keywords: [{ 
        type: String // Array of essential technical terms
    }],
    readTime: { 
        type: Number, 
        default: 10 
    },
    answerTime: { 
        type: Number, 
        default: 60 
    },
    weight: { 
        type: Number, 
        default: 1 
    },
    order: { 
        type: Number, 
        required: true 
    }
}, { timestamps: true });

export const Question = mongoose.model('Question', questionSchema);
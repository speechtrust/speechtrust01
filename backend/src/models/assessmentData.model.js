import mongoose from "mongoose";

const assessmentDataSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    estimatedMinutes: { 
        type: Number, 
        default: 10 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

export const AssessmentData = mongoose.model('AssessmentData', assessmentDataSchema);
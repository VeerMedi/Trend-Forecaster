import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysis extends Document {
    user_id: mongoose.Types.ObjectId;
    topic: string;
    selected_sources: string[];
    analysis_data: object;
    ai_model_used: string;
    confidence_score: number;
    created_at: Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
            index: true,
        },
        topic: {
            type: String,
            required: true,
            index: true,
        },
        selected_sources: {
            type: [String],
            required: true,
        },
        analysis_data: {
            type: Schema.Types.Mixed,
            required: true,
        },
        ai_model_used: {
            type: String,
            required: true,
        },
        confidence_score: {
            type: Number,
            min: 0,
            max: 1,
            default: 0.8,
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: false },
    }
);

export const Analysis = mongoose.model<IAnalysis>('Analysis', AnalysisSchema);

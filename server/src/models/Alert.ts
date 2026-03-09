import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
    user_id: mongoose.Types.ObjectId;
    keyword: string;
    trigger_social_spike: boolean;
    trigger_competitor: boolean;
    trigger_sentiment_shift: boolean;
    notification_email: boolean;
    notification_sms: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

const AlertSchema = new Schema<IAlert>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        keyword: {
            type: String,
            required: true,
            index: true,
        },
        trigger_social_spike: {
            type: Boolean,
            default: false,
        },
        trigger_competitor: {
            type: Boolean,
            default: false,
        },
        trigger_sentiment_shift: {
            type: Boolean,
            default: false,
        },
        notification_email: {
            type: Boolean,
            default: true,
        },
        notification_sms: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

export const Alert = mongoose.model<IAlert>('Alert', AlertSchema);

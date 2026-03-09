import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password_hash: string;
    full_name: string;
    oauth_provider?: string;
    oauth_id?: string;
    email_verified: boolean;
    mfa_enabled: boolean;
    created_at: Date;
    updated_at: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password_hash: {
            type: String,
            required: false, // Optional for OAuth users
        },
        full_name: {
            type: String,
            required: true,
        },
        oauth_provider: {
            type: String,
            enum: ['google', 'microsoft', 'linkedin'],
            required: false,
        },
        oauth_id: {
            type: String,
            required: false,
        },
        email_verified: {
            type: Boolean,
            default: false,
        },
        mfa_enabled: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

export const User = mongoose.model<IUser>('User', UserSchema);

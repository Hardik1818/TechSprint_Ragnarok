import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    title: string;
    message: string;
    recipient: string;
    read: boolean;
    timestamp: string;
}

const NotificationSchema: Schema = new Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    recipient: { type: String, required: true },
    read: { type: Boolean, default: false },
    timestamp: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', NotificationSchema);

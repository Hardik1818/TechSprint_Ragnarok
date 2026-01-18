import mongoose, { Schema, Document } from 'mongoose';

export interface IUnlockRequest extends Document {
    employeeId: string;
    employeeName: string;
    amount: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    date: string;
}

const UnlockRequestSchema: Schema = new Schema({
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    date: { type: String, required: true } // format YYYY-MM-DD
}, { timestamps: true });

export default mongoose.model<IUnlockRequest>('UnlockRequest', UnlockRequestSchema);

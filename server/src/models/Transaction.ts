import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    userId: string;
    amount: number;
    type: 'withdraw' | 'deposit' | 'daily_credit'; // 'unlock' was in commented code, adding 'daily_credit' from AppContext
    status: 'completed' | 'pending' | 'failed';
    date: Date;
    description: string;
}

const TransactionSchema: Schema = new Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['withdraw', 'deposit', 'daily_credit', 'unlock'], required: true },
    status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
    date: { type: Date, default: Date.now },
    description: { type: String }
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);

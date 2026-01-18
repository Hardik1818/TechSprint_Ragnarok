import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    action: string;
    targetId: string;
    targetType: 'Employee' | 'Organization' | 'System';
    changedBy: string;
    timestamp: string;
    details: string;
}

const AuditLogSchema: Schema = new Schema({
    action: { type: String, required: true },
    targetId: { type: String, required: true },
    targetType: { type: String, enum: ['Employee', 'Organization', 'System'], required: true },
    changedBy: { type: String, required: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    details: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

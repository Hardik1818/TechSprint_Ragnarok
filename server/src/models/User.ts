import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string; // Optional for mock users or if using auth provider
    role: 'employee' | 'admin' | 'org_admin';
    organizationId?: string;

    // For Employees
    salary?: number;
    joined?: Date;
    profileImage?: string;
    status: 'Active' | 'On Leave' | 'Inactive'; // From AppContext Employee type
    streaming?: boolean;
    salaryType?: 'Monthly' | 'Weekly' | 'Daily';
    paymentType?: string;

    // Payroll Info
    payroll?: {
        employeeSSF: number;
        employerSSF: number;
        monthlyTax: number;
        netSalary: number;
        dailyPayout: number;
        weeklyPayout: number;
    };

    // Wallet info (derived or stored, let's store for now to match User type)
    walletBalance: number;
    lockedBalance?: number;
    lockPercentage?: number;
    isLocked?: boolean;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // In real app, this should be hashed
    role: { type: String, enum: ['employee', 'admin', 'org_admin'], required: true },
    organizationId: { type: String },

    // Employee specific fields
    salary: { type: Number, default: 0 },
    joined: { type: String }, // Storing as string to match "2023-01-15" format or use Date
    profileImage: { type: String },
    status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
    streaming: { type: Boolean, default: false },
    salaryType: { type: String, enum: ['Monthly', 'Weekly', 'Daily'] },
    paymentType: { type: String },

    // Payroll Fields
    payroll: {
        employeeSSF: { type: Number, default: 0 },
        employerSSF: { type: Number, default: 0 },
        monthlyTax: { type: Number, default: 0 },
        netSalary: { type: Number, default: 0 },
        dailyPayout: { type: Number, default: 0 },
        weeklyPayout: { type: Number, default: 0 }
    },

    // Wallet fields
    walletBalance: { type: Number, default: 0 },
    lockedBalance: { type: Number, default: 0 },
    lockPercentage: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);

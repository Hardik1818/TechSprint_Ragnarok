export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'admin' | 'org_admin';
  organizationId?: string;
  salary: number;
  dailyRate: number;
  walletBalance: number;
  lockedBalance?: number;
  lockPercentage?: number;
  isLocked?: boolean;
  profileImage?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'withdraw' | 'deposit' | 'daily_credit';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

export interface Organization {
  id: string;
  name: string;
  totalEmployees: number;
  cycleStartDate: number; // day of month
  balance: number;
}

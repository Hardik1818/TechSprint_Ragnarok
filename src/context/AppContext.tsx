import { createContext, useContext, useState, useEffect } from 'react';
import type { User, Transaction } from '../types';

export interface Employee {
    id: number | string;
    name: string;
    role: string;
    status: string;
    salary: number;
    streaming: boolean;
    joined: string;
    avatar: string;
    email?: string;
    phone?: string;
    salaryType?: 'Monthly' | 'Weekly' | 'Daily';
    paymentType?: string;
}

export interface AuditLog {
    id: string;
    action: string;
    targetId: string;
    targetType: 'Employee' | 'Organization' | 'System';
    changedBy: string;
    timestamp: string;
    details: string; // "Before: X, After: Y" or "Reason: Z"
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    recipient: string; // "All", "Org:X", "User:Y"
    timestamp: string;
    read: boolean;
}

export interface UnlockRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    amount: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    date: string;
}

interface AppContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    transactions: Transaction[];
    setTransactions: (txs: Transaction[]) => void;
    employees: Employee[];
    addEmployee: (employee: Employee) => void;
    addEmployees: (employees: Employee[]) => void;
    updateEmployee: (id: string | number, updates: Partial<Employee>, reason: string, adminName: string) => void;
    unlockRequests: UnlockRequest[];
    requestUnlock: (req: Omit<UnlockRequest, 'id' | 'status' | 'date' | 'employeeName'>) => void;
    handleUnlockRequest: (id: string, status: 'Approved' | 'Rejected') => void;
    auditLogs: AuditLog[];
    addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
    notifications: Notification[];
    sendNotification: (title: string, message: string, recipient: string) => void;
    loading: boolean;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [unlockRequests, setUnlockRequests] = useState<UnlockRequest[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const addEmployee = (employee: Employee) => {
        setEmployees(prev => [...prev, employee]);
    };

    const addEmployees = (newEmployees: Employee[]) => {
        setEmployees(prev => [...prev, ...newEmployees]);
    };

    const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
        const newLog: AuditLog = {
            id: 'log-' + Date.now(),
            timestamp: new Date().toISOString(),
            ...log
        };
        setAuditLogs(prev => [newLog, ...prev]);
    };

    const updateEmployee = (id: string | number, updates: Partial<Employee>, reason: string, adminName: string) => {
        setEmployees(prev => prev.map(emp => {
            if (emp.id === id) {
                // Determine changes for log
                const changes = Object.keys(updates).map(k => `${k}: ${emp[k as keyof Employee]} -> ${updates[k as keyof Employee]}`).join(', ');
                addAuditLog({
                    action: 'Update Employee',
                    targetId: id.toString(),
                    targetType: 'Employee',
                    changedBy: adminName,
                    details: `Reason: ${reason}. Changes: ${changes}`
                });
                return { ...emp, ...updates };
            }
            return emp;
        }));
    };

    const requestUnlock = (req: Omit<UnlockRequest, 'id' | 'status' | 'date' | 'employeeName'>) => {
        // Find current user's name if not provided (though in this context we might need it)
        const name = user?.name || 'Unknown Employee';
        const newRequest: UnlockRequest = {
            id: Date.now().toString(),
            employeeId: req.employeeId,
            employeeName: name,
            amount: req.amount,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        };
        setUnlockRequests(prev => [newRequest, ...prev]);
    };

    const handleUnlockRequest = (id: string, status: 'Approved' | 'Rejected') => {
        setUnlockRequests(prev => prev.map(req => {
            if (req.id === id) {
                // Side effect: If approved, ensure streaming is active for that employee
                if (status === 'Approved') {
                    setEmployees(emps => emps.map(e =>
                        e.id.toString() === req.employeeId ? { ...e, streaming: true } : e
                    ));
                    addAuditLog({
                        action: 'Unlock Salary',
                        targetId: req.employeeId,
                        targetType: 'Employee',
                        changedBy: 'Admin', // In real app, get from session
                        details: `Approved unlock request for NPR ${req.amount}`
                    });

                    // Optional: Create a transaction record
                    /* 
                    const newTx: Transaction = {
                        id: 'tx-' + Date.now(),
                        userId: req.employeeId,
                        amount: req.amount,
                        type: 'unlock',
                        status: 'completed',
                        date: new Date().toISOString(),
                        description: 'Salary Unlocked by Admin'
                    };
                    setTransactions(txs => [newTx, ...txs]);
                    */
                }
                return { ...req, status };
            }
            return req;
        }));
    };

    const sendNotification = (title: string, message: string, recipient: string) => {
        const newNotif: Notification = {
            id: 'notif-' + Date.now(),
            title,
            message,
            recipient,
            timestamp: new Date().toISOString(),
            read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
        addAuditLog({
            action: 'Send Notification',
            targetId: recipient,
            targetType: 'System',
            changedBy: 'Admin',
            details: `Title: ${title}`
        });
    };

    useEffect(() => {
        // Check local storage for existing session
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Failed to parse user from local storage:', error);
                localStorage.removeItem('user');
            }
        }

        // Default transactions
        const mockTransactions: Transaction[] = [
            {
                id: 'tx1',
                userId: '1',
                amount: 2000,
                type: 'daily_credit',
                status: 'completed',
                date: new Date().toISOString(),
                description: 'Daily Salary Earned'
            },
            {
                id: 'tx2',
                userId: '1',
                amount: 2000,
                type: 'daily_credit',
                status: 'completed',
                date: new Date(Date.now() - 86400000).toISOString(),
                description: 'Daily Salary Earned'
            },
            {
                id: 'tx3',
                userId: '1',
                amount: 500,
                type: 'withdraw',
                status: 'completed',
                date: new Date(Date.now() - 172800000).toISOString(),
                description: 'Transfer to Bank Account'
            }
        ];

        setTransactions(mockTransactions);

        // Default employees
        const mockEmployees: Employee[] = [
            { id: 1, name: 'Abhi Poudel', role: 'Product Manager', status: 'Active', salary: 60000, streaming: true, joined: '2023-01-15', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abhi' },
            { id: 2, name: 'Sita Sharma', role: 'Senior Developer', status: 'Active', salary: 120000, streaming: true, joined: '2022-11-01', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sita' },
            { id: 3, name: 'Ram Prasad', role: 'Accountant', status: 'On Leave', salary: 45000, streaming: false, joined: '2023-03-10', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ram' },
            { id: 4, name: 'Binita Thapa', role: 'Marketing Head', status: 'Active', salary: 85000, streaming: true, joined: '2023-06-22', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Binita' },
            { id: 5, name: 'Hari Bahadur', role: 'Support Lead', status: 'Inactive', salary: 35000, streaming: false, joined: '2023-08-05', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hari' },
        ];

        setEmployees(mockEmployees);

        // Default unlock requests for testing
        const mockUnlockRequests: UnlockRequest[] = [
            { id: 'ur1', employeeId: '3', employeeName: 'Ram Prasad', amount: 5000, status: 'Pending', date: new Date().toISOString().split('T')[0] },
            { id: 'ur2', employeeId: '4', employeeName: 'Binita Thapa', amount: 12000, status: 'Approved', date: '2025-01-10' }
        ];
        setUnlockRequests(mockUnlockRequests);

        setLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    return (
        <AppContext.Provider value={{
            user, setUser,
            transactions, setTransactions,
            employees, addEmployee, addEmployees,
            updateEmployee,
            unlockRequests, requestUnlock, handleUnlockRequest,
            auditLogs, addAuditLog,
            notifications, sendNotification,
            loading, logout
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

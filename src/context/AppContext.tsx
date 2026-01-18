import { createContext, useContext, useState, useEffect } from 'react';
import type { User, Transaction } from '../types';
import api from '../api';

export interface Employee {
    id: number | string;
    _id?: string; // MongoDB ID
    name: string;
    role: string;
    status: string; // 'Active' etc.
    salary: number;
    streaming: boolean;
    joined: string;
    avatar?: string;
    profileImage?: string;
    email?: string;
    phone?: string;
    salaryType?: 'Monthly' | 'Weekly' | 'Daily';
    paymentType?: string;
    payroll?: {
        employeeSSF: number;
        employerSSF: number;
        monthlyTax: number;
        netSalary: number;
        dailyPayout: number;
        weeklyPayout: number;
    };
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
    _id?: string;
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
    addEmployee: (employee: Employee) => Promise<void>;
    addEmployees: (employees: Employee[]) => Promise<void>;
    updateEmployee: (id: string | number, updates: Partial<Employee>, reason: string, adminName: string) => Promise<void>;

    unlockRequests: UnlockRequest[];
    requestUnlock: (req: Omit<UnlockRequest, 'id' | 'status' | 'date' | 'employeeName'>) => Promise<void>;
    handleUnlockRequest: (id: string, status: 'Approved' | 'Rejected') => Promise<void>;

    auditLogs: AuditLog[];
    addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => Promise<void>;

    notifications: Notification[];
    sendNotification: (title: string, message: string, recipient: string) => Promise<void>;

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
        setTransactions([]);
        setEmployees([]);
        setUnlockRequests([]);
    };

    // Load initial data based on user being logged in
    useEffect(() => {
        const loadInitialData = async () => {
            const savedUserStr = localStorage.getItem('user');
            if (savedUserStr) {
                try {
                    const savedUser = JSON.parse(savedUserStr);
                    // Fetch fresh user data
                    // If ID is mock (like '1'), fetch that ID. If mongoID, fetch that.
                    // For now, we trust the ID in localStorage to query the api

                    if (savedUser._id) {
                        const userRes = await api.get(`/users/${savedUser._id}`);
                        setUser({ ...userRes.data, id: userRes.data._id }); // ensuring id matches for frontend compatibility
                    } else if (savedUser.id && savedUser.id.length > 5) {
                        try {
                            const userRes = await api.get(`/users/${savedUser.id}`);
                            setUser({ ...userRes.data, id: userRes.data._id });
                        } catch {
                            setUser(savedUser); // fallback if not found
                        }
                    } else {
                        setUser(savedUser);
                    }

                } catch (error) {
                    console.error('Failed to parse user from local storage or fetch:', error);
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        loadInitialData();
    }, []);

    // Effect to load role-specific data when user changes
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                if (user.role === 'employee') {
                    // Load Wallet Transactions
                    const txRes = await api.get(`/transactions/${user.id || user._id}`);
                    setTransactions(txRes.data.map((tx: any) => ({ ...tx, id: tx._id })));
                } else if (user.role === 'org_admin' || user.role === 'admin') {
                    // Load Employees list
                    const empRes = await api.get('/users');
                    setEmployees(empRes.data.map((e: any) => ({ ...e, id: e._id || e.id })));

                    // Load Requests
                    const reqRes = await api.get('/requests');
                    setUnlockRequests(reqRes.data.map((r: any) => ({ ...r, id: r._id, employeeId: r.employeeId })));

                    // Load Audit Logs and Notifications
                    const auditRes = await api.get('/audit');
                    setAuditLogs(auditRes.data.map((l: any) => ({ ...l, id: l._id })));

                    // Load Notifications
                    try {
                        const notifRes = await api.get('/notifications/All');
                        setNotifications(notifRes.data.map((n: any) => ({ ...n, id: n._id })));
                    } catch (e) { console.error('Error fetching notifications', e); }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
        localStorage.setItem('user', JSON.stringify(user));

    }, [user]);


    const addEmployee = async (employee: Employee) => {
        try {
            const res = await api.post('/users', { ...employee, role: 'employee', password: 'password123' }); // default password
            const newEmp = { ...res.data, id: res.data._id };
            setEmployees(prev => [...prev, newEmp]);
            await addAuditLog({
                action: 'Add Employee',
                targetId: newEmp.id,
                targetType: 'Employee',
                changedBy: user?.name || 'Admin',
                details: `Added new employee ${newEmp.name}`
            });
        } catch (error) {
            console.error(error);
            alert('Failed to add employee');
        }
    };

    const addEmployees = async (newEmployees: Employee[]) => {
        // Bulk add not implemented on API deeply yet, so loop for now or add bulk route
        // Assuming user wants simple loop
        for (const emp of newEmployees) {
            await addEmployee(emp);
        }
    };

    const addAuditLog = async (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
        try {
            const res = await api.post('/audit', log);
            setAuditLogs(prev => [{ ...res.data, id: res.data._id }, ...prev]);
        } catch (e) { console.error(e) }
    };

    const updateEmployee = async (id: string | number, updates: Partial<Employee>, reason: string, adminName: string) => {
        try {
            const res = await api.put(`/users/${id}`, updates);
            // Log update
            const changes = Object.keys(updates).map(k => `${k}`).join(', ');
            await addAuditLog({
                action: 'Update Employee',
                targetId: id.toString(),
                targetType: 'Employee',
                changedBy: adminName,
                details: `Reason: ${reason}. Updated: ${changes}`
            });

            setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...res.data, id: res.data._id } : emp));
        } catch (error) {
            console.error(error);
        }
    };

    const requestUnlock = async (req: Omit<UnlockRequest, 'id' | 'status' | 'date' | 'employeeName'>) => {
        const name = user?.name || 'Unknown Employee';
        const payload = {
            ...req,
            employeeId: req.employeeId,
            employeeName: name,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        };
        try {
            const res = await api.post('/requests', payload);
            setUnlockRequests(prev => [{ ...res.data, id: res.data._id }, ...prev]);
        } catch (error) { console.error(error); }
    };

    const handleUnlockRequest = async (id: string, status: 'Approved' | 'Rejected') => {
        try {
            await api.put(`/requests/${id}`, { status });
            // If approved, local state update happens via response
            setUnlockRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));

            if (status === 'Approved') {
                // Refresh employees to see streaming status change
                const userId = unlockRequests.find(r => r.id === id)?.employeeId;
                if (userId) {
                    setEmployees(emps => emps.map(e => e.id.toString() === userId ? { ...e, streaming: true } : e));
                    await addAuditLog({
                        action: 'Unlock Salary',
                        targetId: userId,
                        targetType: 'Employee',
                        changedBy: user?.name || 'Admin',
                        details: `Approved unlock request`
                    });
                }
            }
        } catch (error) { console.error(error); }
    };

    const sendNotification = async (title: string, message: string, recipient: string) => {
        try {
            const res = await api.post('/notifications', { title, message, recipient });
            setNotifications(prev => [{ ...res.data, id: res.data._id }, ...prev]);
        } catch (e) { console.error(e) }
    };

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

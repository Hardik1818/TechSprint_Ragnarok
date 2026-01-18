import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Transaction from './models/Transaction';
import UnlockRequest from './models/UnlockRequest';
import { PayrollCalculator } from './utils/PayrollCalculator';

dotenv.config();

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/dailypay-nepal';

const mockEmployees = [
    { name: 'Abhi Poudel', email: 'abhi@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 60000, streaming: true, joined: '2023-01-15', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abhi', walletBalance: 40000 },
    { name: 'Sita Sharma', email: 'sita@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 120000, streaming: true, joined: '2022-11-01', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sita', walletBalance: 5000 },
    { name: 'Ram Prasad', email: 'ram@example.com', password: 'password123', role: 'employee', status: 'On Leave', salary: 45000, streaming: false, joined: '2023-03-10', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ram', walletBalance: 1200 },
    { name: 'Binita Thapa', email: 'binita@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 85000, streaming: true, joined: '2023-06-22', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Binita', walletBalance: 3400 },
    { name: 'Hari Bahadur', email: 'hari@example.com', password: 'password123', role: 'employee', status: 'Inactive', salary: 35000, streaming: false, joined: '2023-08-05', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hari', walletBalance: 100 },
    { name: 'Gita Magar', email: 'gita@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 55000, streaming: true, joined: '2023-09-01', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gita', walletBalance: 1500 },
    { name: 'Nabin Karki', email: 'nabin@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 72000, streaming: true, joined: '2023-07-15', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nabin', walletBalance: 2800 },
    { name: 'Suresh Lama', email: 'suresh@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 48000, streaming: false, joined: '2023-10-10', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh', walletBalance: 800 },
    { name: 'Anita Gurung', email: 'anita@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 95000, streaming: true, joined: '2023-02-20', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita', walletBalance: 4200 },
    { name: 'Ramesh Shrestha', email: 'ramesh@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 62000, streaming: true, joined: '2023-05-05', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh', walletBalance: 1900 },
    // Adding 15 more employees to reach 25
    { name: 'Pooja Mishra', email: 'pooja@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 50000, streaming: true, joined: '2023-11-01', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja', walletBalance: 1000 },
    { name: 'Dinesh KC', email: 'dinesh@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 70000, streaming: true, joined: '2023-04-12', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dinesh', walletBalance: 2500 },
    { name: 'Suman Rai', email: 'suman@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 58000, streaming: true, joined: '2023-06-18', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suman', walletBalance: 1800 },
    { name: 'Mina Tamang', email: 'mina@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 45000, streaming: true, joined: '2023-08-22', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mina', walletBalance: 900 },
    { name: 'Kiran Basnet', email: 'kiran.b@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 88000, streaming: true, joined: '2023-01-30', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KiranB', walletBalance: 3500 },
    { name: 'Reeta Shah', email: 'reeta@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 65000, streaming: true, joined: '2023-03-05', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Reeta', walletBalance: 2100 },
    { name: 'Rajendra Mahato', email: 'rajendra@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 52000, streaming: true, joined: '2023-09-15', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajendra', walletBalance: 1200 },
    { name: 'Sunita Chaudhary', email: 'sunita@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 47000, streaming: true, joined: '2023-07-20', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita', walletBalance: 1100 },
    { name: 'Bikash Thapa', email: 'bikash@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 75000, streaming: true, joined: '2023-02-10', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bikash', walletBalance: 3000 },
    { name: 'Priya Sharma', email: 'priya@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 60000, streaming: true, joined: '2023-05-25', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', walletBalance: 2000 },
    { name: 'Arjun Paudel', email: 'arjun@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 92000, streaming: true, joined: '2023-01-05', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun', walletBalance: 3800 },
    { name: 'Manju Ghale', email: 'manju@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 56000, streaming: true, joined: '2023-08-10', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manju', walletBalance: 1600 },
    { name: 'Deepak Oli', email: 'deepak@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 68000, streaming: true, joined: '2023-04-01', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepak', walletBalance: 2300 },
    { name: 'Sarita Yadav', email: 'sarita@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 51000, streaming: true, joined: '2023-10-05', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarita', walletBalance: 1300 },
    { name: 'Bijay Khadka', email: 'bijay@example.com', password: 'password123', role: 'employee', status: 'Active', salary: 80000, streaming: true, joined: '2023-03-25', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bijay', walletBalance: 3200 }
];

const mockOrgAdmin = {
    name: 'Nabil Bank HR',
    email: 'hr@nabil.com',
    password: 'securePass123', // Changed as requested
    role: 'org_admin',
    status: 'Active',
    walletBalance: 5000000,
    profileImage: 'https://api.dicebear.com/7.x/initials/svg?seed=NB'
};

const mockAdmin = {
    name: 'System Admin',
    email: 'admin@dailypay.np',
    password: 'admin123',
    role: 'admin',
    status: 'Active',
    walletBalance: 0
};

const mockTransactions = [
    {
        userId: '1', // Needs real ID
        amount: 2000,
        type: 'daily_credit',
        status: 'completed',
        date: new Date(),
        description: 'Daily Salary Earned'
    },
    {
        userId: '1', // Needs real ID
        amount: 2000,
        type: 'daily_credit',
        status: 'completed',
        date: new Date(Date.now() - 86400000),
        description: 'Daily Salary Earned'
    },
    {
        userId: '1', // Needs real ID
        amount: 500,
        type: 'withdraw',
        status: 'completed',
        date: new Date(Date.now() - 172800000),
        description: 'Transfer to Bank Account'
    }
];

const mockUnlockRequests = [
    { employeeName: 'Ram Prasad', amount: 5000, status: 'Pending', date: new Date().toISOString().split('T')[0] },
    { employeeName: 'Binita Thapa', amount: 12000, status: 'Approved', date: '2025-01-10' }
];

const seedData = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Transaction.deleteMany({});
        await UnlockRequest.deleteMany({});

        console.log('Cleared existing data');

        // Calculate payroll for mockEmployees
        const employeesWithPayroll = mockEmployees.map(emp => {
            const payroll = PayrollCalculator.calculate(emp.salary);
            return {
                ...emp,
                payroll: {
                    employeeSSF: payroll.employeeSSF,
                    employerSSF: payroll.employerSSF,
                    monthlyTax: payroll.monthlyTax,
                    netSalary: payroll.netMonthlySalary,
                    dailyPayout: payroll.dailyPayout,
                    weeklyPayout: payroll.weeklyPayout
                }
            };
        });

        // Insert Users
        const createdUsers = await User.insertMany([...employeesWithPayroll, mockOrgAdmin, mockAdmin]);
        console.log(`Inserted ${createdUsers.length} users`);

        // Map inserted users to transactions and requests
        // We need to find the specific users for the transactions/requests.
        // In mock data: transactions are for User 1 (Abhi), Requests are for Ram and Binita.

        // Find Abhi
        const abhi = createdUsers.find(u => u.name === 'Abhi Poudel');
        if (abhi) {
            const txs = mockTransactions.map(tx => ({ ...tx, userId: abhi._id }));
            await Transaction.insertMany(txs);
            console.log('Inserted transactions for Abhi');
        }

        // Find Ram and Binita for unlock requests
        const ram = createdUsers.find(u => u.name === 'Ram Prasad');
        const binita = createdUsers.find(u => u.name === 'Binita Thapa');

        const requests = [];
        if (ram) {
            requests.push({ ...mockUnlockRequests[0], employeeId: ram._id, employeeName: ram.name });
        }
        if (binita) {
            requests.push({ ...mockUnlockRequests[1], employeeId: binita._id, employeeName: binita.name });
        }

        if (requests.length > 0) {
            await UnlockRequest.insertMany(requests);
            console.log(`Inserted ${requests.length} unlock requests`);
        }

        console.log('Data seeding completed successfully');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();

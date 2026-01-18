import express from 'express';
import User from '../models/User';
import { PayrollCalculator } from '../utils/PayrollCalculator';

const router = express.Router();

// Get all employees (for Org Dashboard)
router.get('/', async (req, res) => {
    try {
        const users = await User.find({ role: 'employee' });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new user (Add Employee)
router.post('/', async (req, res) => {
    try {
        const userData = req.body;

        // Auto-calculate payroll for employees
        if (userData.role === 'employee' && userData.salary) {
            const payroll = PayrollCalculator.calculate(Number(userData.salary));
            userData.payroll = {
                employeeSSF: payroll.employeeSSF,
                employerSSF: payroll.employerSSF,
                monthlyTax: payroll.monthlyTax,
                netSalary: payroll.netMonthlySalary,
                dailyPayout: payroll.dailyPayout,
                weeklyPayout: payroll.weeklyPayout
            };
            // Also set wallet balance to initial 0 or net salary if pre-funded (assuming 0 for new)
            // But per specs: "Lock the calculated net monthly salary at the beginning"
            // If we assume month start, we can lock full amount. For now, let's keep wallet logical.
        }

        const newUser = new User(userData);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

// Update user details (e.g. Org updates employee salary/status)
router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;

        // Recalculate if salary changes
        if (updates.salary) {
            const payroll = PayrollCalculator.calculate(Number(updates.salary));
            updates.payroll = {
                employeeSSF: payroll.employeeSSF,
                employerSSF: payroll.employerSSF,
                monthlyTax: payroll.monthlyTax,
                netSalary: payroll.netMonthlySalary,
                dailyPayout: payroll.dailyPayout,
                weeklyPayout: payroll.weeklyPayout
            };
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

export default router;

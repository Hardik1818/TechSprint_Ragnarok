import express from 'express';
import Transaction from '../models/Transaction';
import User from '../models/User';

const router = express.Router();

// Get transactions for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new transaction (Withdraw, etc.)
router.post('/', async (req, res) => {
    const { userId, amount, type, description } = req.body;

    // Start a session for atomicity (if using a Replica Set, otherwise simple)
    // For simple setup:
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (type === 'withdraw') {
            if (user.walletBalance < amount) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }
            user.walletBalance -= amount;
            await user.save();
        }

        const newTx = new Transaction({
            userId,
            amount,
            type,
            status: 'completed',
            description
        });

        const savedTx = await newTx.save();
        res.status(201).json(savedTx);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;

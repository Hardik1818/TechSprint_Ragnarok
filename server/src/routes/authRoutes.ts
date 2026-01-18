import express from 'express';
import User from '../models/User';

const router = express.Router();

// Mock Login - In a real app, verify password hash
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // For this mock/MVP, we'll blindly trust the email if it exists
        // In production: await User.findOne({ email, password: hash(password) })
        const user = await User.findOne({ email });

        if (!user) {
            // Special case for default admin if not in DB (fallback)
            if (email === 'admin@dailypay.np' && password === 'admin123') {
                return res.json({
                    user: {
                        id: 'admin-001',
                        name: 'System Admin',
                        email: 'admin@dailypay.np',
                        role: 'admin',
                        walletBalance: 0
                    }
                });
            }
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password if it exists on the user record
        if (user.password && user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Return the user data
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;

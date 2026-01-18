import express from 'express';
import AuditLog from '../models/AuditLog';

const router = express.Router();

// Get all audit logs
router.get('/', async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new log
router.post('/', async (req, res) => {
    try {
        const newLog = new AuditLog(req.body);
        const savedLog = await newLog.save();
        res.status(201).json(savedLog);
    } catch (error) {
        res.status(400).json({ message: 'Error creating log' });
    }
});

export default router;

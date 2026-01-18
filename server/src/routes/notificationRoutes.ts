import express from 'express';
import Notification from '../models/Notification';

const router = express.Router();

router.get('/:recipient', async (req, res) => {
    try {
        // Get notifications for this user OR 'All'
        const notifs = await Notification.find({
            recipient: { $in: [req.params.recipient, 'All'] }
        }).sort({ timestamp: -1 });
        res.json(notifs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newNotif = new Notification(req.body);
        const savedNotif = await newNotif.save();
        res.status(201).json(savedNotif);
    } catch (error) {
        res.status(400).json({ message: 'Error sending notification' });
    }
});

export default router;

import express from 'express';
import UnlockRequest from '../models/UnlockRequest';
import User from '../models/User';

const router = express.Router();

// Get all unlock requests (for Org)
router.get('/', async (req, res) => {
    try {
        const requests = await UnlockRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new unlock request
router.post('/', async (req, res) => {
    try {
        const newRequest = new UnlockRequest(req.body);
        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(400).json({ message: 'Error creating request', error });
    }
});

// Update request status (Approve/Reject)
router.put('/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const request = await UnlockRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = status;
        await request.save();

        // If approved, update user's streaming status or wallet if needed logic applies
        // For now, based on AppContext logic for 'Approved', it set streaming to true.
        if (status === 'Approved') {
            await User.findByIdAndUpdate(request.employeeId, { streaming: true });
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;

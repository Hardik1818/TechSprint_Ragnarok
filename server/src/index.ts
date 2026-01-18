import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';
import requestRoutes from './routes/requestRoutes';
import auditRoutes from './routes/auditRoutes';
import notificationRoutes from './routes/notificationRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/notifications', notificationRoutes);

// Basic Route for health check
app.get('/', (req, res) => {
    res.send('DailyPay Nepal Backend is Running!');
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dailypay-nepal';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

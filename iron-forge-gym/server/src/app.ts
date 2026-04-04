import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import membershipRoutes from './routes/membership';
import bmiRoutes from './routes/bmi';
import plansRoutes from './routes/plans';
import dietRoutes from './routes/diet';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/bmi', bmiRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/diet', dietRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
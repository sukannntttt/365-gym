import express from 'express';
import dietRoutes from './routes/diet';
import workoutsRoutes from './routes/workouts';

const app = express();

app.use('/api/diet', dietRoutes);
app.use('/api/workouts', workoutsRoutes);

export default app;
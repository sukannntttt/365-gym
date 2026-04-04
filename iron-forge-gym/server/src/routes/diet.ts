import { Router } from 'express';
import { generateDietPlan } from '../controllers/planController';

const router = Router();

// Route to generate a diet plan based on user input
router.post('/generate', generateDietPlan);

export default router;
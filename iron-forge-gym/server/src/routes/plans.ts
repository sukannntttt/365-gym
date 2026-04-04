import { Router } from 'express';
import { getTrainingPlans, createTrainingPlan } from '../controllers/planController';

const router = Router();

// Route to get all training plans
router.get('/', getTrainingPlans);

// Route to create a new training plan
router.post('/', createTrainingPlan);

export default router;
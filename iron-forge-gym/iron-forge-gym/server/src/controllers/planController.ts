import { Request, Response } from 'express';
import { PlanService } from '../services/planService';

class PlanController {
    private planService: PlanService;

    constructor() {
        this.planService = new PlanService();
    }

    public async getTrainingPlans(req: Request, res: Response): Promise<void> {
        try {
            const plans = await this.planService.getTrainingPlans();
            res.status(200).json(plans);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving training plans', error });
        }
    }

    public async getDietPlans(req: Request, res: Response): Promise<void> {
        try {
            const dietPlans = await this.planService.getDietPlans();
            res.status(200).json(dietPlans);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving diet plans', error });
        }
    }

    public async createTrainingPlan(req: Request, res: Response): Promise<void> {
        try {
            const newPlan = await this.planService.createTrainingPlan(req.body);
            res.status(201).json(newPlan);
        } catch (error) {
            res.status(400).json({ message: 'Error creating training plan', error });
        }
    }

    public async createDietPlan(req: Request, res: Response): Promise<void> {
        try {
            const newDietPlan = await this.planService.createDietPlan(req.body);
            res.status(201).json(newDietPlan);
        } catch (error) {
            res.status(400).json({ message: 'Error creating diet plan', error });
        }
    }
}

export const planController = new PlanController();
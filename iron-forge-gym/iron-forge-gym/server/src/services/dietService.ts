import { DietPlan } from '../models/diet.model';

export class DietService {
    private dietPlans: DietPlan[] = [];

    constructor() {
        this.initializeDietPlans();
    }

    private initializeDietPlans() {
        // Sample diet plans
        this.dietPlans = [
            {
                id: 1,
                name: 'Weight Loss',
                meals: [
                    { meal: 'Breakfast', description: 'Oatmeal with fruits' },
                    { meal: 'Lunch', description: 'Grilled chicken salad' },
                    { meal: 'Dinner', description: 'Steamed vegetables and fish' },
                ],
            },
            {
                id: 2,
                name: 'Muscle Gain',
                meals: [
                    { meal: 'Breakfast', description: 'Protein shake and eggs' },
                    { meal: 'Lunch', description: 'Quinoa with chicken and veggies' },
                    { meal: 'Dinner', description: 'Steak with sweet potatoes' },
                ],
            },
            {
                id: 3,
                name: 'Maintenance',
                meals: [
                    { meal: 'Breakfast', description: 'Greek yogurt with honey' },
                    { meal: 'Lunch', description: 'Turkey sandwich with whole grain bread' },
                    { meal: 'Dinner', description: 'Pasta with marinara sauce and salad' },
                ],
            },
        ];
    }

    public getDietPlanByGoal(goal: string): DietPlan | null {
        return this.dietPlans.find(plan => plan.name.toLowerCase() === goal.toLowerCase()) || null;
    }
}
// This file contains TypeScript types and interfaces used throughout the application.

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    height: number; // in cm
    weight: number; // in kg
    goals: string[];
}

export interface Membership {
    id: string;
    name: string;
    price: number;
    duration: string; // e.g., "1 month", "6 months", "1 year"
    benefits: string[];
}

export interface TrainingPlan {
    id: string;
    name: string;
    description: string;
    exercises: Exercise[];
}

export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
}

export interface DietPlan {
    id: string;
    name: string;
    meals: Meal[];
}

export interface Meal {
    id: string;
    name: string;
    calories: number;
    ingredients: string[];
}

export interface BMIResult {
    bmi: number;
    category: string; // e.g., "Underweight", "Normal weight", "Overweight", "Obesity"
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Goal {
    id: string;
    name: string;
    description: string;
}
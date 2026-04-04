import { isEmail } from 'validator';

export const validateEmail = (email: string): boolean => {
    return isEmail(email);
};

export const validatePassword = (password: string): boolean => {
    const minLength = 6;
    return password.length >= minLength;
};

export const validateHeight = (height: number): boolean => {
    return height > 0 && height < 300; // height in cm
};

export const validateWeight = (weight: number): boolean => {
    return weight > 0 && weight < 500; // weight in kg
};

export const validateGoal = (goal: string): boolean => {
    const validGoals = ['weight_loss', 'muscle_gain', 'maintenance'];
    return validGoals.includes(goal);
};
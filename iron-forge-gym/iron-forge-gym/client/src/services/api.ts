import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update with your server URL

// Function to register a new user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to login a user
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to get membership options
export const getMembershipOptions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/membership`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to calculate BMI
export const calculateBMI = async (bmiData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/bmi`, bmiData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to get training plans
export const getTrainingPlans = async (goal) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/plans/${goal}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to generate diet plan
export const generateDietPlan = async (dietData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/diet`, dietData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to get user dashboard data
export const getUserDashboard = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}/dashboard`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
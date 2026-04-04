import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
            <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                <h2 className="text-xl font-semibold">Welcome, {user?.name}!</h2>
                <p className="mt-2">Here you can track your goals, workouts, and progress.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/training-plans" className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600">
                    View Training Plans
                </Link>
                <Link to="/diet-generator" className="bg-green-500 text-white p-4 rounded-lg shadow-md hover:bg-green-600">
                    Generate Diet Plan
                </Link>
                <Link to="/bmi-calculator" className="bg-yellow-500 text-white p-4 rounded-lg shadow-md hover:bg-yellow-600">
                    Calculate BMI
                </Link>
                <Link to="/membership" className="bg-purple-500 text-white p-4 rounded-lg shadow-md hover:bg-purple-600">
                    Membership Options
                </Link>
            </div>
            <button onClick={logout} className="mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
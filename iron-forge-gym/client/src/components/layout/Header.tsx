import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    <Link to="/">Iron Forge Gym</Link>
                </h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/" className="hover:text-gray-400">Home</Link>
                        </li>
                        <li>
                            <Link to="/membership" className="hover:text-gray-400">Membership</Link>
                        </li>
                        <li>
                            <Link to="/bmi-calculator" className="hover:text-gray-400">BMI Calculator</Link>
                        </li>
                        <li>
                            <Link to="/training-plans" className="hover:text-gray-400">Training Plans</Link>
                        </li>
                        <li>
                            <Link to="/diet-generator" className="hover:text-gray-400">Diet Generator</Link>
                        </li>
                        <li>
                            <Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/admin" className="hover:text-gray-400">Admin</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
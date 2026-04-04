import React, { useState } from 'react';

const BMICalculator: React.FC = () => {
    const [height, setHeight] = useState<number>(0);
    const [weight, setWeight] = useState<number>(0);
    const [bmi, setBmi] = useState<number | null>(null);
    const [category, setCategory] = useState<string>('');

    const calculateBMI = () => {
        if (height > 0 && weight > 0) {
            const calculatedBMI = weight / ((height / 100) ** 2);
            setBmi(calculatedBMI);
            determineCategory(calculatedBMI);
        }
    };

    const determineCategory = (bmi: number) => {
        if (bmi < 18.5) {
            setCategory('Underweight');
        } else if (bmi >= 18.5 && bmi < 24.9) {
            setCategory('Normal weight');
        } else if (bmi >= 25 && bmi < 29.9) {
            setCategory('Overweight');
        } else {
            setCategory('Obesity');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">BMI Calculator</h1>
            <div className="mb-4">
                <label className="block mb-2">Height (cm):</label>
                <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="border p-2"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Weight (kg):</label>
                <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="border p-2"
                />
            </div>
            <button onClick={calculateBMI} className="bg-blue-500 text-white p-2 rounded">
                Calculate BMI
            </button>
            {bmi && (
                <div className="mt-4">
                    <h2 className="text-xl">Your BMI: {bmi.toFixed(2)}</h2>
                    <h3 className="text-lg">Category: {category}</h3>
                </div>
            )}
        </div>
    );
};

export default BMICalculator;
import React, { useState } from 'react';

const DietGenerator: React.FC = () => {
    const [goal, setGoal] = useState('');
    const [dietPlan, setDietPlan] = useState<string | null>(null);

    const handleGoalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setGoal(event.target.value);
    };

    const generateDietPlan = () => {
        // Placeholder for diet plan generation logic
        const plans = {
            weightLoss: 'Low-carb diet with high protein intake.',
            muscleGain: 'High-calorie diet with balanced macros.',
            maintenance: 'Balanced diet with moderate calories.',
        };
        setDietPlan(plans[goal as keyof typeof plans]);
    };

    return (
        <div className="diet-generator">
            <h1 className="text-2xl font-bold">Diet Plan Generator</h1>
            <div className="mt-4">
                <label htmlFor="goal" className="block text-lg">Select Your Goal:</label>
                <select id="goal" value={goal} onChange={handleGoalChange} className="border p-2">
                    <option value="">--Select--</option>
                    <option value="weightLoss">Weight Loss</option>
                    <option value="muscleGain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                </select>
            </div>
            <button onClick={generateDietPlan} className="mt-4 bg-blue-500 text-white p-2 rounded">
                Generate Diet Plan
            </button>
            {dietPlan && (
                <div className="mt-4 p-4 border">
                    <h2 className="text-xl font-semibold">Your Diet Plan:</h2>
                    <p>{dietPlan}</p>
                </div>
            )}
        </div>
    );
};

export default DietGenerator;
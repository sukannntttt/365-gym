import React from 'react';

const TrainingPlans: React.FC = () => {
    const plans = [
        {
            id: 1,
            title: 'Weight Loss',
            description: 'A plan focused on reducing body fat through cardio and strength training.',
            duration: '12 weeks',
            goals: ['Fat Loss', 'Increased Endurance']
        },
        {
            id: 2,
            title: 'Muscle Gain',
            description: 'A plan designed to build muscle mass with a focus on strength training.',
            duration: '12 weeks',
            goals: ['Muscle Growth', 'Strength Increase']
        },
        {
            id: 3,
            title: 'General Fitness',
            description: 'A balanced plan for overall fitness, combining cardio and strength exercises.',
            duration: '8 weeks',
            goals: ['Improved Fitness', 'Weight Maintenance']
        }
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Training Plans</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-white shadow-md rounded-lg p-4">
                        <h2 className="text-xl font-semibold">{plan.title}</h2>
                        <p className="mt-2">{plan.description}</p>
                        <p className="mt-2 font-bold">Duration: {plan.duration}</p>
                        <h3 className="mt-2 font-semibold">Goals:</h3>
                        <ul className="list-disc list-inside">
                            {plan.goals.map((goal, index) => (
                                <li key={index}>{goal}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainingPlans;
import React from 'react';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const membershipOptions = [
    { id: 1, name: 'Basic', price: 29.99, features: ['Access to gym equipment', 'Group classes'] },
    { id: 2, name: 'Standard', price: 49.99, features: ['Access to gym equipment', 'Group classes', 'Personal trainer sessions'] },
    { id: 3, name: 'Premium', price: 69.99, features: ['Access to gym equipment', 'Group classes', 'Personal trainer sessions', 'Nutrition consultation'] },
];

const Membership: React.FC = () => {
    const [selectedMembership, setSelectedMembership] = useState<number | null>(null);

    const handleSelectMembership = (id: number) => {
        setSelectedMembership(id);
    };

    return (
        <div className="membership-page">
            <h1 className="text-3xl font-bold mb-6">Choose Your Membership</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {membershipOptions.map(option => (
                    <Card key={option.id} className={`border ${selectedMembership === option.id ? 'border-blue-500' : 'border-gray-300'} p-4`}>
                        <h2 className="text-xl font-semibold">{option.name}</h2>
                        <p className="text-lg font-bold">${option.price.toFixed(2)} / month</p>
                        <ul className="list-disc pl-5">
                            {option.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                        <Button onClick={() => handleSelectMembership(option.id)} className="mt-4">
                            {selectedMembership === option.id ? 'Selected' : 'Select'}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Membership;
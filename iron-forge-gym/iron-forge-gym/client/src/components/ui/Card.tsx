import React from 'react';

interface CardProps {
    title: string;
    content: string;
    imageUrl?: string;
    footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, content, imageUrl, footer }) => {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {imageUrl && <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />}
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-gray-700">{content}</p>
            </div>
            {footer && <div className="p-4 border-t">{footer}</div>}
        </div>
    );
};

export default Card;
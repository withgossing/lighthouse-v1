import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`px-6 py-4 border-b border-gray-100 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardTitle: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
            {children}
        </h3>
    );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`p-6 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardFooter: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl ${className}`} {...props}>
            {children}
        </div>
    );
};

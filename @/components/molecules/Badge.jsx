import React from 'react';

const Badge = ({ text, className, dotColor }) => {
    return (
        <span className={`px-2 py-1 rounded-full font-medium ${className}`}>
            {dotColor && (
                <span 
                    className="inline-block w-2 h-2 rounded-full mr-1 align-middle"
                    style={{ backgroundColor: dotColor }}
                ></span>
            )}
            {text}
        </span>
    );
};

export default Badge;
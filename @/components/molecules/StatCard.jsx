import React from 'react';

const StatCard = ({ value, label, colorClass }) => {
    return (
        <div className={`${colorClass} p-3 rounded-lg`}>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs">{label}</div>
        </div>
    );
};

export default StatCard;
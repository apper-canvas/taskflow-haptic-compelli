import React from 'react';

const Select = ({ value, onChange, children, className }) => {
    return (
        <select
            value={value}
            onChange={onChange}
            className={`w-full p-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
        >
            {children}
        </select>
    );
};

export default Select;
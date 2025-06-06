import React from 'react';

const Input = ({ type = 'text', placeholder, value, onChange, className, required = false }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full p-3 border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
            required={required}
        />
    );
};

export default Input;
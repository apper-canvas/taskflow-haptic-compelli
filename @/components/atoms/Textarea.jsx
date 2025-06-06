import React from 'react';

const Textarea = ({ placeholder, value, onChange, className, rows = 3 }) => {
    return (
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full p-3 border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${className}`}
            rows={rows}
        />
    );
};

export default Textarea;
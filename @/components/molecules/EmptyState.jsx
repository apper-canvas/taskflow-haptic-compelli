import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const EmptyState = ({ iconName = 'Plus', title, message, className }) => {
    return (
        <div className={`text-center py-8 text-surface-400 dark:text-surface-600 ${className}`}>
            <ApperIcon name={iconName} size={24} className="mx-auto mb-2 opacity-50" />
            {title && <p className="text-sm">{title}</p>}
            {message && <p className="text-sm">{message}</p>}
        </div>
    );
};

export default EmptyState;
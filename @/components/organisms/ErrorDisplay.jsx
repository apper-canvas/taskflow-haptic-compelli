import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorDisplay = ({ onRetry }) => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
                <p className="text-lg text-surface-600 dark:text-surface-400">Something went wrong</p>
                <Button 
                    onClick={onRetry}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                    Try Again
                </Button>
            </div>
        </div>
    );
};

export default ErrorDisplay;
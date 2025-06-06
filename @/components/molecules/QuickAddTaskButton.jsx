import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuickAddTaskButton = ({ onClick }) => {
    return (
        <Button
            onClick={onClick}
            className="w-full text-left p-4 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl hover:border-primary transition-colors group"
        >
            <div className="flex items-center space-x-3">
                <div className="bg-primary/10 group-hover:bg-primary/20 p-2 rounded-lg transition-colors">
                    <ApperIcon name="Plus" size={20} className="text-primary" />
                </div>
                <span className="text-surface-600 dark:text-surface-400 group-hover:text-surface-900 dark:group-hover:text-white transition-colors">
                    Add a new task...
                </span>
            </div>
        </Button>
    );
};

export default QuickAddTaskButton;
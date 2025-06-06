import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ViewToggleButton = ({ viewMode, onViewModeChange }) => {
    const getButtonClass = (mode) => `
        px-3 py-1 rounded-md text-sm font-medium transition-colors 
        ${viewMode === mode 
            ? 'bg-white dark:bg-surface-600 text-surface-900 dark:text-white shadow-sm' 
            : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
        }
    `;

    return (
        <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
            <Button
                onClick={() => onViewModeChange('board')}
                className={getButtonClass('board')}
            >
                <ApperIcon name="Columns" size={16} className="inline mr-1" />
                Board
            </Button>
            <Button
                onClick={() => onViewModeChange('today')}
                className={getButtonClass('today')}
            >
                <ApperIcon name="Calendar" size={16} className="inline mr-1" />
                Today
            </Button>
        </div>
    );
};

export default ViewToggleButton;
import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const CategoryItem = ({ category, isActive, onClick, taskCount }) => {
  const baseClasses = "w-full text-left px-3 py-2 rounded-lg transition-colors";
  const activeClasses = "bg-primary text-white";
  const inactiveClasses = "hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400";

  return (
    <Button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {category.name === 'All Tasks' ? (
        <ApperIcon name="List" size={16} className="inline mr-2" />
      ) : (
        <div
          className="inline-block w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: category.color }}
        ></div>
      )}
      {category.name}
      <span className="float-right text-sm">{taskCount}</span>
    </Button>
  );
};

export default CategoryItem;
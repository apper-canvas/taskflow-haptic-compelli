import React from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/molecules/Badge';

const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

const TaskCard = ({ task, onEdit, onDelete, onDragStart, draggedTaskId }) => {
    const isOverdue = (dueDate) => {
        return isPast(new Date(dueDate)) && !isToday(new Date(dueDate));
    };

    const categoryColor = task.category 
        ? task.category.color 
            ? task.category.color 
            : null // If category object has no color, or if category is just a string
        : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ y: -2 }}
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            className={`task-card bg-white dark:bg-surface-800 rounded-xl p-4 border border-surface-200 dark:border-surface-700 shadow-card hover:shadow-soft cursor-move ${
                draggedTaskId === task.id ? 'dragging' : ''
            }`}
        >
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <h4 className="font-medium text-surface-900 dark:text-white line-clamp-2">
                        {task.title}
                    </h4>
                    <div className="flex items-center space-x-1 ml-2">
                        <Button
                            onClick={() => onEdit(task)}
                            className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded transition-colors"
                        >
                            <ApperIcon name="Edit2" size={14} className="text-surface-400" />
                        </Button>
                        <Button
                            onClick={() => onDelete(task.id)}
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                            <ApperIcon name="Trash2" size={14} className="text-red-400" />
                        </Button>
                    </div>
                </div>

                {/* Description */}
                {task.description && (
                    <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">
                        {task.description}
                    </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                        {/* Priority */}
                        <Badge
                            text={task.priority}
                            className={priorityColors[task.priority] || priorityColors.medium}
                        />

                        {/* Category */}
                        {task.category && (
                            <Badge
                                text={typeof task.category === 'object' ? task.category.name : task.category}
                                className="bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400"
                                dotColor={typeof task.category === 'object' ? task.category.color : null}
                            />
                        )}
                    </div>

                    {/* Due Date */}
                    {task.dueDate && (
                        <div className={`flex items-center space-x-1 ${
                            isOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-500' : 
                            isToday(new Date(task.dueDate)) ? 'text-amber-500' : 
                            'text-surface-500 dark:text-surface-400'
                        }`}>
                            <ApperIcon name="Calendar" size={12} />
                            <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;
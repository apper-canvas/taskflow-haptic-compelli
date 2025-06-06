import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/molecules/EmptyState';

const KanbanColumn = ({
    column,
    tasks,
    onEditTask,
    onDeleteTask,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    dragOverColumn,
    draggedTaskId
}) => {
    return (
        <div
            onDragOver={(e) => onDragOver(e, column.id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, column.id)}
            className={`${column.color} rounded-2xl border border-surface-200 dark:border-surface-700 transition-all duration-300 ${
                dragOverColumn === column.id ? 'ring-2 ring-primary/50 scale-105' : ''
            }`}
        >
            {/* Column Header */}
            <div className="p-4 border-b border-surface-200 dark:border-surface-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ApperIcon name={column.icon} size={18} className="text-surface-600 dark:text-surface-400" />
                        <h3 className="font-semibold text-surface-900 dark:text-white">
                            {column.title}
                        </h3>
                    </div>
                    <span className="bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 px-2 py-1 rounded-full text-sm font-medium">
                        {tasks.length}
                    </span>
                </div>
            </div>

            {/* Column Content */}
            <div className="p-4 space-y-3 min-h-[400px]">
                <AnimatePresence>
                    {tasks.length === 0 ? (
                        <EmptyState title={`No ${column.title.toLowerCase()} tasks`} />
                    ) : (
                        tasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={onEditTask}
                                onDelete={onDeleteTask}
                                onDragStart={onDragStart}
                                draggedTaskId={draggedTaskId}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default KanbanColumn;
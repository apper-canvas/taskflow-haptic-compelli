import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { isToday, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import QuickAddTaskButton from '@/components/molecules/QuickAddTaskButton';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/molecules/EmptyState';
import TaskFormModal from '@/components/organisms/TaskFormModal';

const TodayTasksSection = ({ tasks, categories, onCreateTask, onUpdateTask, onDeleteTask }) => {
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowTaskForm(true);
    };

    const handleFormSubmit = async (taskId, taskData) => {
        if (taskId) {
            await onUpdateTask(taskId, taskData);
        } else {
            await onCreateTask(taskData);
        }
    };

    const isTaskOverdue = (dueDate, status) => {
        return isPast(new Date(dueDate)) && status !== 'completed';
    };

    const todayTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        return isToday(new Date(task.dueDate)) || isTaskOverdue(task.dueDate, task.status);
    });

    return (
        <div className="p-4 lg:p-6 space-y-6">
            {/* Quick Add */}
            <div className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-md rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                <QuickAddTaskButton onClick={() => setShowTaskForm(true)} />
            </div>

            {/* Today's Tasks */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                    Today's Tasks
                </h2>
                
                {todayTasks.length === 0 ? (
                    <div className="bg-white/50 dark:bg-surface-800/50 backdrop-blur-md rounded-2xl p-12 text-center border border-surface-200 dark:border-surface-700">
                        <EmptyState 
                            iconName="CheckCircle2" 
                            title="All caught up!" 
                            message="No tasks due today. You're doing great!" 
                            className="text-green-500" 
                        />
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence>
                            {todayTasks.map(task => (
                                <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    onEdit={handleEdit} 
                                    onDelete={onDeleteTask} 
                                    onDragStart={() => {}} // Drag not directly supported in this view, provide empty func
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <TaskFormModal
                isOpen={showTaskForm}
                onClose={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                }}
                onSubmit={handleFormSubmit}
                editingTask={editingTask}
                categories={categories}
            />
        </div>
    );
};

export default TodayTasksSection;
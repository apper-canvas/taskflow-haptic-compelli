import React, { useState } from 'react';
import QuickAddTaskButton from '@/components/molecules/QuickAddTaskButton';
import KanbanColumn from '@/components/organisms/KanbanColumn';
import TaskFormModal from '@/components/organisms/TaskFormModal';

const statusColumns = [
    { id: 'todo', title: 'To Do', icon: 'Circle', color: 'bg-surface-100 dark:bg-surface-800' },
    { id: 'in-progress', title: 'In Progress', icon: 'Clock', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { id: 'completed', title: 'Completed', icon: 'CheckCircle', color: 'bg-green-50 dark:bg-green-900/20' }
];

const TaskBoard = ({ tasks, categories, onCreateTask, onUpdateTask, onDeleteTask }) => {
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [draggedTask, setDraggedTask] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);

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

    const handleStatusChange = async (taskId, newStatus) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const updates = {
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : null
        };

        await onUpdateTask(taskId, updates);
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, columnId) => {
        e.preventDefault();
        setDragOverColumn(columnId);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = async (e, columnId) => {
        e.preventDefault();
        if (draggedTask && draggedTask.status !== columnId) {
            await handleStatusChange(draggedTask.id, columnId);
        }
        setDraggedTask(null);
        setDragOverColumn(null);
    };

    const getTasksForColumn = (columnId) => {
        return tasks.filter(task => task.status === columnId);
    };

    return (
        <div className="p-4 lg:p-6 space-y-6">
            {/* Quick Add */}
            <div className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-md rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                <QuickAddTaskButton onClick={() => setShowTaskForm(true)} />
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {statusColumns.map(column => (
                    <KanbanColumn
                        key={column.id}
                        column={column}
                        tasks={getTasksForColumn(column.id)}
                        onEditTask={handleEdit}
                        onDeleteTask={onDeleteTask}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        dragOverColumn={dragOverColumn}
                        draggedTaskId={draggedTask?.id}
                    />
                ))}
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

export default TaskBoard;
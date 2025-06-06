import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const TaskFormModal = ({ isOpen, onClose, onSubmit, editingTask, categories }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        category: ''
    });

    useEffect(() => {
        if (editingTask) {
            setFormData({
                title: editingTask.title || '',
                description: editingTask.description || '',
                priority: editingTask.priority || 'medium',
                dueDate: editingTask.dueDate ? format(new Date(editingTask.dueDate), 'yyyy-MM-dd') : '',
                category: editingTask.category || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: '',
                category: ''
            });
        }
    }, [editingTask, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        const taskData = {
            ...formData,
            status: editingTask ? editingTask.status : 'todo',
            createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
            completedAt: null
        };

        await onSubmit(editingTask ? editingTask.id : null, taskData);
        onClose(); // Close modal after submission
    };

    const handleCancel = () => {
        setFormData({
            title: '',
            description: '',
            priority: 'medium',
            dueDate: '',
            category: ''
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleCancel} // Close on backdrop click
                >
                    <motion.form
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md space-y-4 border border-surface-200 dark:border-surface-700"
                    >
                        <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                            {editingTask ? 'Edit Task' : 'Create New Task'}
                        </h3>

                        <FormField>
                            <Input
                                type="text"
                                placeholder="Task title..."
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </FormField>

                        <FormField>
                            <Textarea
                                placeholder="Description (optional)..."
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Priority">
                                <Select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </Select>
                            </FormField>

                            <FormField label="Due Date">
                                <Input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                />
                            </FormField>
                        </div>

                        <FormField label="Category">
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Select category...</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                        <div className="flex space-x-3 pt-4">
                            <Button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 px-4 py-2 border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300"
                            >
                                {editingTask ? 'Update' : 'Create'} Task
                            </Button>
                        </div>
                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TaskFormModal;
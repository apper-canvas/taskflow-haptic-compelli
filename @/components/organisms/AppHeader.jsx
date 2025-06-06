import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ViewToggleButton from '@/components/molecules/ViewToggleButton';

const AppHeader = ({ 
    stats, 
    searchTerm, 
    onSearchChange, 
    viewMode, 
    onViewModeChange, 
    darkMode, 
    onDarkModeToggle, 
    onSidebarToggle 
}) => {
    return (
        <header className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-md border-b border-surface-200 dark:border-surface-700 sticky top-0 z-40">
            <div className="px-4 lg:px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={onSidebarToggle}
                            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                        >
                            <ApperIcon name="Menu" size={20} />
                        </Button>
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
                                <ApperIcon name="CheckSquare" size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-surface-900 dark:text-white">TaskFlow</h1>
                                <p className="text-sm text-surface-600 dark:text-surface-400">
                                    {stats.completed} of {stats.total} tasks completed
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="relative hidden sm:block">
                            <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                            <Input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
                            />
                        </div>

                        {/* View Toggle */}
                        <ViewToggleButton viewMode={viewMode} onViewModeChange={onViewModeChange} />

                        {/* Dark Mode Toggle */}
                        <Button
                            onClick={onDarkModeToggle}
                            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                        >
                            <ApperIcon name={darkMode ? "Sun" : "Moon"} size={20} />
                        </Button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="mt-4 sm:hidden">
                    <div className="relative">
                        <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                        <Input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import CategoryItem from '@/components/molecules/CategoryItem';

const AppSidebar = ({ sidebarOpen, setSidebarOpen, stats, categories, selectedCategory, onSelectCategory, tasks }) => {
  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: sidebarOpen ? 280 : 0,
        opacity: sidebarOpen ? 1 : 0
      }}
      transition={{ duration: 0.3 }}
      className={`bg-white/50 dark:bg-surface-800/50 backdrop-blur-md border-r border-surface-200 dark:border-surface-700 overflow-hidden ${
        sidebarOpen ? 'lg:block' : 'hidden lg:block'
      } fixed lg:relative h-[calc(100vh-73px)] z-30`}
    >
      <div className="p-4 space-y-6">
        {/* Stats */}
        <div className="space-y-3">
          <h3 className="font-semibold text-surface-900 dark:text-white">Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatCard 
              value={stats.total} 
              label="Total Tasks" 
              colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
            />
            <StatCard 
              value={stats.completed} 
              label="Completed" 
              colorClass="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" 
            />
            <StatCard 
              value={stats.inProgress} 
              label="In Progress" 
              colorClass="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400" 
            />
            <StatCard 
              value={stats.overdue} 
              label="Overdue" 
              colorClass="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" 
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h3 className="font-semibold text-surface-900 dark:text-white">Categories</h3>
          <div className="space-y-2">
            <CategoryItem
              category={{ id: 'all', name: 'All Tasks' }}
              isActive={selectedCategory === 'all'}
              onClick={() => onSelectCategory('all')}
              taskCount={tasks.length}
            />
            {categories.map(category => {
              const categoryTasks = tasks.filter(task => task.category === category.name);
              return (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isActive={selectedCategory === category.name}
                  onClick={() => onSelectCategory(category.name)}
                  taskCount={categoryTasks.length}
                />
              );
            })}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
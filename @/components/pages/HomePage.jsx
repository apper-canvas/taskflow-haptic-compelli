import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskService } from '@/services/api/taskService';
import { categoryService } from '@/services/api/categoryService';
import AppHeader from '@/components/organisms/AppHeader';
import AppSidebar from '@/components/organisms/AppSidebar';
import TaskBoard from '@/components/organisms/TaskBoard';
import TodayTasksSection from '@/components/organisms/TodayTasksSection';
import LoadingSpinner from '@/components/organisms/LoadingSpinner';
import ErrorDisplay from '@/components/organisms/ErrorDisplay';

const HomePage = ({ darkMode, setDarkMode }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('board'); // board or today
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksResult, categoriesResult] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksResult || []);
      setCategories(categoriesResult || []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      // Ensure category object is included for filtering if it's just a string
      const categoryObj = categories.find(cat => cat.name === newTask.category);
      setTasks(prev => [...prev, { ...newTask, category: categoryObj || newTask.category }]);
      toast.success('Task created successfully!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.update(id, updates);
      // Ensure category object is included for filtering if it's just a string
      const categoryObj = categories.find(cat => cat.name === updatedTask.category);
      setTasks(prev => prev.map(task => task.id === id ? { ...updatedTask, category: categoryObj || updatedTask.category } : task));
      toast.success('Task updated successfully!');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const taskCategoryName = typeof task.category === 'object' ? task.category.name : task.category;
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || taskCategoryName === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const overdue = tasks.filter(task => 
      new Date(task.dueDate) < new Date() && task.status !== 'completed'
    ).length;
    
    return { total, completed, inProgress, overdue };
  };

  const stats = getTaskStats();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay onRetry={loadData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <AppHeader
        stats={stats}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <AppSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          stats={stats}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          tasks={tasks} // Pass all tasks for category counts
        />

        <main className="flex-1 lg:ml-0">
          {viewMode === 'board' ? (
            <TaskBoard
              tasks={filteredTasks}
              categories={categories}
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <TodayTasksSection
              tasks={filteredTasks}
              categories={categories}
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
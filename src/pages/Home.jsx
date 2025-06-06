import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { taskService } from '../services/api/taskService'
import { categoryService } from '../services/api/categoryService'

const Home = ({ darkMode, setDarkMode }) => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('board') // board or today
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [tasksResult, categoriesResult] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      setTasks(tasksResult || [])
      setCategories(categoriesResult || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [...prev, newTask])
      toast.success('Task created successfully!')
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

  const handleUpdateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.update(id, updates)
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task))
      toast.success('Task updated successfully!')
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await taskService.delete(id)
      setTasks(prev => prev.filter(task => task.id !== id))
      toast.success('Task deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory
    
    if (viewMode === 'today') {
      const today = new Date().toDateString()
      const taskDate = new Date(task.dueDate).toDateString()
      const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed'
      return matchesSearch && matchesCategory && (taskDate === today || isOverdue)
    }
    
    return matchesSearch && matchesCategory
  })

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(task => task.status === 'completed').length
    const inProgress = tasks.filter(task => task.status === 'in-progress').length
    const overdue = tasks.filter(task => 
      new Date(task.dueDate) < new Date() && task.status !== 'completed'
    ).length
    
    return { total, completed, inProgress, overdue }
  }

  const stats = getTaskStats()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-lg text-surface-600 dark:text-surface-400">Something went wrong</p>
          <button 
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      {/* Header */}
      <header className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-md border-b border-surface-200 dark:border-surface-700 sticky top-0 z-40">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <ApperIcon name="Menu" size={20} />
              </button>
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
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
                />
              </div>

              {/* View Toggle */}
              <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('board')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'board' 
                      ? 'bg-white dark:bg-surface-600 text-surface-900 dark:text-white shadow-sm' 
                      : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
                  }`}
                >
                  <ApperIcon name="Columns" size={16} className="inline mr-1" />
                  Board
                </button>
                <button
                  onClick={() => setViewMode('today')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'today' 
                      ? 'bg-white dark:bg-surface-600 text-surface-900 dark:text-white shadow-sm' 
                      : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
                  }`}
                >
                  <ApperIcon name="Calendar" size={16} className="inline mr-1" />
                  Today
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <ApperIcon name={darkMode ? "Sun" : "Moon"} size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 sm:hidden">
            <div className="relative">
              <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
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
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                  <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Total Tasks</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
                  <div className="text-xs text-green-600/70 dark:text-green-400/70">Completed</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</div>
                  <div className="text-xs text-yellow-600/70 dark:text-yellow-400/70">In Progress</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</div>
                  <div className="text-xs text-red-600/70 dark:text-red-400/70">Overdue</div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="font-semibold text-surface-900 dark:text-white">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-white'
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400'
                  }`}
                >
                  <ApperIcon name="List" size={16} className="inline mr-2" />
                  All Tasks
                  <span className="float-right text-sm">{tasks.length}</span>
                </button>
                {categories.map(category => {
                  const categoryTasks = tasks.filter(task => task.category === category.name)
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-primary text-white'
                          : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400'
                      }`}
                    >
                      <div 
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      {category.name}
                      <span className="float-right text-sm">{categoryTasks.length}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <MainFeature
            tasks={filteredTasks}
            categories={categories}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            viewMode={viewMode}
          />
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
  )
}

export default Home
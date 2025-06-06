import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({ 
  tasks, 
  categories, 
  onCreateTask, 
  onUpdateTask, 
  onDeleteTask, 
  viewMode 
}) => {
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [draggedTask, setDraggedTask] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: ''
  })

  const statusColumns = [
    { id: 'todo', title: 'To Do', icon: 'Circle', color: 'bg-surface-100 dark:bg-surface-800' },
    { id: 'in-progress', title: 'In Progress', icon: 'Clock', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { id: 'completed', title: 'Completed', icon: 'CheckCircle', color: 'bg-green-50 dark:bg-green-900/20' }
  ]

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    const taskData = {
      ...formData,
      status: editingTask ? editingTask.status : 'todo',
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      completedAt: null
    }

    if (editingTask) {
      await onUpdateTask(editingTask.id, taskData)
      setEditingTask(null)
    } else {
      await onCreateTask(taskData)
    }

    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: ''
    })
    setShowTaskForm(false)
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
      category: task.category || ''
    })
    setShowTaskForm(true)
  }

  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const updates = {
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : null
    }

    await onUpdateTask(taskId, updates)
  }

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, columnId) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = async (e, columnId) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== columnId) {
      await handleStatusChange(draggedTask.id, columnId)
    }
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const getTasksForColumn = (columnId) => {
    return tasks.filter(task => task.status === columnId)
  }

  const isOverdue = (dueDate) => {
    return isPast(new Date(dueDate)) && !isToday(new Date(dueDate))
  }

  const TaskCard = ({ task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      className={`task-card bg-white dark:bg-surface-800 rounded-xl p-4 border border-surface-200 dark:border-surface-700 shadow-card hover:shadow-soft cursor-move ${
        draggedTask?.id === task.id ? 'dragging' : ''
      }`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-surface-900 dark:text-white line-clamp-2">
            {task.title}
          </h4>
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={() => handleEdit(task)}
              className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded transition-colors"
            >
              <ApperIcon name="Edit2" size={14} className="text-surface-400" />
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            >
              <ApperIcon name="Trash2" size={14} className="text-red-400" />
            </button>
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
            <span className={`px-2 py-1 rounded-full font-medium ${priorityColors[task.priority] || priorityColors.medium}`}>
              {task.priority}
            </span>

            {/* Category */}
            {task.category && (
              <span className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 rounded-full">
                {task.category}
              </span>
            )}
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center space-x-1 ${
              isOverdue(task.dueDate) ? 'text-red-500' : 
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
  )

  const EmptyState = ({ columnTitle }) => (
    <div className="text-center py-8 text-surface-400 dark:text-surface-600">
      <ApperIcon name="Plus" size={24} className="mx-auto mb-2 opacity-50" />
      <p className="text-sm">No {columnTitle.toLowerCase()} tasks</p>
    </div>
  )

  if (viewMode === 'today') {
    const todayTasks = tasks.filter(task => {
      if (!task.dueDate) return false
      return isToday(new Date(task.dueDate)) || isOverdue(task.dueDate)
    })

    return (
      <div className="p-4 lg:p-6 space-y-6">
        {/* Quick Add */}
        <div className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-md rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
          <button
            onClick={() => setShowTaskForm(true)}
            className="w-full text-left p-4 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl hover:border-primary transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 group-hover:bg-primary/20 p-2 rounded-lg transition-colors">
                <ApperIcon name="Plus" size={20} className="text-primary" />
              </div>
              <span className="text-surface-600 dark:text-surface-400 group-hover:text-surface-900 dark:group-hover:text-white transition-colors">
                Add a new task...
              </span>
            </div>
          </button>
        </div>

        {/* Today's Tasks */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
            Today's Tasks
          </h2>
          
          {todayTasks.length === 0 ? (
            <div className="bg-white/50 dark:bg-surface-800/50 backdrop-blur-md rounded-2xl p-12 text-center border border-surface-200 dark:border-surface-700">
              <ApperIcon name="CheckCircle2" size={48} className="mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                All caught up!
              </h3>
              <p className="text-surface-600 dark:text-surface-400">
                No tasks due today. You're doing great!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {todayTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Task Form Modal */}
        <AnimatePresence>
          {showTaskForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                setShowTaskForm(false)
                setEditingTask(null)
                setFormData({
                  title: '',
                  description: '',
                  priority: 'medium',
                  dueDate: '',
                  category: ''
                })
              }}
            >
              <motion.form
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
                className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md space-y-4 border border-surface-200 dark:border-surface-700"
              >
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>

                <div>
                  <input
                    type="text"
                    placeholder="Task title..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>

                <div>
                  <textarea
                    placeholder="Description (optional)..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full p-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full p-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select category...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskForm(false)
                      setEditingTask(null)
                      setFormData({
                        title: '',
                        description: '',
                        priority: 'medium',
                        dueDate: '',
                        category: ''
                      })
                    }}
                    className="flex-1 px-4 py-2 border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    {editingTask ? 'Update' : 'Create'} Task
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Quick Add */}
      <div className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-md rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
        <button
          onClick={() => setShowTaskForm(true)}
          className="w-full text-left p-4 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl hover:border-primary transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 group-hover:bg-primary/20 p-2 rounded-lg transition-colors">
              <ApperIcon name="Plus" size={20} className="text-primary" />
            </div>
            <span className="text-surface-600 dark:text-surface-400 group-hover:text-surface-900 dark:group-hover:text-white transition-colors">
              Add a new task...
            </span>
          </div>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {statusColumns.map(column => {
          const columnTasks = getTasksForColumn(column.id)
          
          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
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
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="p-4 space-y-3 min-h-[400px]">
                <AnimatePresence>
                  {columnTasks.length === 0 ? (
                    <EmptyState columnTitle={column.title} />
                  ) : (
                    columnTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowTaskForm(false)
              setEditingTask(null)
              setFormData({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: '',
                category: ''
              })
            }}
          >
            <motion.form
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md space-y-4 border border-surface-200 dark:border-surface-700"
            >
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>

              <div>
                <input
                  type="text"
                  placeholder="Task title..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <textarea
                  placeholder="Description (optional)..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full p-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full p-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select category...</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskForm(false)
                    setEditingTask(null)
                    setFormData({
                      title: '',
                      description: '',
                      priority: 'medium',
                      dueDate: '',
                      category: ''
                    })
                  }}
                  className="flex-1 px-4 py-2 border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  {editingTask ? 'Update' : 'Create'} Task
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature
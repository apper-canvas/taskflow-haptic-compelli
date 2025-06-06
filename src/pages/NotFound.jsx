import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 px-4"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="mx-auto w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center"
        >
          <ApperIcon name="AlertTriangle" size={40} className="text-white" />
        </motion.div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-surface-900 dark:text-white">404</h1>
          <h2 className="text-2xl font-semibold text-surface-700 dark:text-surface-300">Page Not Found</h2>
          <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back to organizing your tasks.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            <span>Back to TaskFlow</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound
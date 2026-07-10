import { motion } from 'framer-motion';

/**
 * Reusable Card component for content containers.
 *
 * @param {string} title - Optional card title
 * @param {boolean} noPadding - Removes inner padding
 * @param {boolean} hoverable - Adds hover lift effect
 * @param {React.ReactNode} children
 */
const Card = ({ title, noPadding = false, hoverable = false, className = '', children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverable ? { y: -2, shadow: 'lg' } : {}}
      className={`bg-white rounded-xl border border-secondary-200 shadow-sm ${
        hoverable ? 'hover:shadow-md transition-shadow duration-200' : ''
      } ${noPadding ? '' : 'p-6'} ${className}`}
      {...props}
    >
      {title && (
        <div className="mb-4 pb-3 border-b border-secondary-100">
          <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;

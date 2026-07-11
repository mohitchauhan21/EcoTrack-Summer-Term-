import { motion } from 'framer-motion';

/**
 * Reusable Card component for content containers with premium glassmorphism.
 */
const Card = ({ title, noPadding = false, hoverable = false, className = '', children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={hoverable ? { y: -4, shadow: 'xl' } : {}}
      className={`glass-card rounded-2xl ${
        hoverable ? 'hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300' : ''
      } ${noPadding ? '' : 'p-6 lg:p-7'} ${className}`}
      {...props}
    >
      {title && (
        <div className="mb-5 pb-4 border-b border-secondary-200/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-secondary-900 tracking-tight">{title}</h3>
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;

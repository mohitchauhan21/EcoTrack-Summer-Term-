import { motion } from 'framer-motion';

/**
 * Reusable Loader component.
 *
 * @param {'sm'|'md'|'lg'} size - Spinner size
 * @param {boolean} fullScreen - Centers the loader in the viewport
 * @param {string} text - Optional loading text
 */
const Loader = ({ size = 'md', fullScreen = false, text, className = '' }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizes[size]} rounded-full border-primary-200 border-t-primary-600`}
      />
      {text && (
        <p className="text-sm text-secondary-500 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component with premium variants, sizes, and loading state.
 */
const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled = false,
      icon,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] focus:ring-primary-500 border border-primary-400/20',
      secondary:
        'bg-white text-secondary-800 hover:bg-secondary-50 active:bg-secondary-100 focus:ring-secondary-400 border border-secondary-200 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.08)]',
      outline:
        'bg-white/50 backdrop-blur-sm border-2 border-primary-500/30 text-primary-600 hover:bg-primary-50 hover:border-primary-500 hover:shadow-[0_4px_15px_-3px_rgba(16,185,129,0.2)] active:bg-primary-100 focus:ring-primary-500',
      danger:
        'bg-gradient-to-r from-danger-500 to-rose-500 text-white hover:shadow-[0_8px_25px_-5px_rgba(239,68,68,0.4)] hover:scale-[1.02] active:scale-[0.98] focus:ring-danger-400 border border-danger-400/20',
      ghost:
        'text-secondary-600 hover:bg-secondary-100/50 hover:text-secondary-900 active:bg-secondary-200 focus:ring-secondary-400',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3.5 text-base gap-2.5',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={variant !== 'primary' && variant !== 'danger' ? { scale: 0.97 } : {}}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : icon ? (
          <motion.span 
            className="shrink-0"
            whileHover={{ rotate: [-5, 5, -5, 0], scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.span>
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

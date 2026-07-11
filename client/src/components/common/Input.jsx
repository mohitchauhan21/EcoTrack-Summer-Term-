import { forwardRef } from 'react';

/**
 * Reusable Input component compatible with React Hook Form.
 *
 * @param {string} label - Input label text
 * @param {string} error - Error message to display
 * @param {React.ReactNode} icon - Optional leading icon
 * @param {string} helperText - Optional helper text below input
 * @param {'text'|'email'|'password'|'number'|'tel'|'url'} type
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      icon,
      helperText,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-secondary-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-secondary-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`w-full rounded-xl border bg-white/50 backdrop-blur-sm px-4 py-3 text-[15px] text-secondary-900 placeholder:text-secondary-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:bg-white ${
              icon ? 'pl-11' : ''
            } ${
              error
                ? 'border-danger-400 focus:ring-danger-400 focus:border-danger-400 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]'
                : 'border-secondary-200 focus:ring-primary-500 focus:border-primary-500 hover:border-secondary-300 shadow-sm focus:shadow-[0_4px_15px_-3px_rgba(16,185,129,0.15)]'
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-danger-500 font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-secondary-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

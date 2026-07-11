/**
 * Common form validation rules for react-hook-form.
 */

export const emailValidation = {
  required: 'Email is required',
  pattern: {
    value: /^\\S+@\\S+\\.\\S+$/,
    message: 'Please enter a valid email address',
  },
};

export const passwordValidation = {
  required: 'Password is required',
  minLength: {
    value: 6,
    message: 'Password must be at least 6 characters',
  },
};

export const nameValidation = {
  required: 'Name is required',
  maxLength: {
    value: 50,
    message: 'Name cannot exceed 50 characters',
  },
};

export const confirmPasswordValidation = (password) => ({
  required: 'Please confirm your password',
  validate: (value) => value === password || 'Passwords do not match',
});

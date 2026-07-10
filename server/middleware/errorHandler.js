import ApiError from '../utils/ApiError.js';

/**
 * Centralized error-handling middleware.
 * Catches all errors passed via next(err) or thrown in async handlers.
 *
 * - Handles custom ApiError instances
 * - Handles Mongoose validation errors
 * - Handles Mongoose duplicate key errors
 * - Handles Mongoose cast errors (invalid ObjectId)
 * - Falls back to generic 500 for unknown errors
 */
const errorHandler = (err, _req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ApiError(404, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    const message = `Duplicate value entered for: ${field}`;
    error = new ApiError(400, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    const message = `Validation Error: ${messages.join(', ')}`;
    error = new ApiError(400, message, messages);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired');
  }

  const statusCode = error.statusCode || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: error.message || 'Internal Server Error',
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;

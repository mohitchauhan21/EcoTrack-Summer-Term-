/**
 * Custom API Error class for consistent error responses.
 *
 * Usage:
 *   throw new ApiError(404, 'Resource not found');
 *   throw new ApiError(400, 'Validation failed', ['email is required']);
 *
 * @class ApiError
 * @extends Error
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array} errors - Optional array of detailed error messages
   * @param {string} stack - Optional stack trace
   */
  constructor(statusCode, message = 'Something went wrong', errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;

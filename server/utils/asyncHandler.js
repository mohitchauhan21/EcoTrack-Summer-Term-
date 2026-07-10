/**
 * Wraps an async route handler to catch errors and forward them
 * to Express error-handling middleware.
 *
 * Usage:
 *   router.get('/example', asyncHandler(async (req, res) => { ... }));
 *
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

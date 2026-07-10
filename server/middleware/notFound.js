import ApiError from '../utils/ApiError.js';

/**
 * Catch-all middleware for undefined routes.
 * Returns a 404 error for any route not matched by the application.
 */
const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export default notFound;

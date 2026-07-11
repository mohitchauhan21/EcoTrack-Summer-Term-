import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Protect routes — verify JWT and attach user to request.
 */
export const protect = asyncHandler(async (req, _res, next) => {
  let token;

  // Check for token in cookies first, then fallback to Bearer header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Attach user to request (exclude password)
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, 'Not authorized, user not found');
  }

  req.user = user;
  next();
});

/**
 * Authorize by role — restrict access to specific roles.
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'user')
 */
export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Role '${req.user.role}' is not authorized to access this resource`);
    }
    next();
  };
};

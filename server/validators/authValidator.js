import ApiError from '../utils/ApiError.js';

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || name.trim().length === 0) {
    return next(new ApiError(400, 'Name is required'));
  }
  
  if (!email || !/^\\S+@\\S+\\.\\S+$/.test(email)) {
    return next(new ApiError(400, 'A valid email is required'));
  }
  
  if (!password || password.length < 6) {
    return next(new ApiError(400, 'Password must be at least 6 characters'));
  }
  
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !/^\\S+@\\S+\\.\\S+$/.test(email)) {
    return next(new ApiError(400, 'A valid email is required'));
  }
  
  if (!password) {
    return next(new ApiError(400, 'Password is required'));
  }
  
  next();
};

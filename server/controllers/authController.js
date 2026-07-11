import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Generate JWT token.
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Create user
  const user = await User.create({ name, email, password });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json(
    new ApiResponse(201, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      token,
    }, 'User registered successfully')
  );
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return token
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Compare password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json(
    new ApiResponse(200, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      token,
    }, 'Login successful')
  );
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('companyId');

  res.status(200).json(
    new ApiResponse(200, { user }, 'User profile fetched')
  );
});

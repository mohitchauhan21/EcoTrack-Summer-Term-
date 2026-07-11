import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @route   GET /api/profile
 * @desc    Get current user's profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('companyId');

  res.status(200).json(
    new ApiResponse(200, { user }, 'Profile fetched successfully')
  );
});

/**
 * @route   PUT /api/profile
 * @desc    Update user profile (name, email)
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // Check if email is taken by another user
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'Email is already in use');
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  ).populate('companyId');

  res.status(200).json(
    new ApiResponse(200, { user }, 'Profile updated successfully')
  );
});

/**
 * @route   PUT /api/profile/password
 * @desc    Change password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Please provide current and new password');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, null, 'Password changed successfully')
  );
});

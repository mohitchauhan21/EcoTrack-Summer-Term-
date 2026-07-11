import Company from '../models/Company.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @route   POST /api/company
 * @desc    Create a company and link it to the user
 * @access  Private
 */
export const createCompany = asyncHandler(async (req, res) => {
  const { name, region } = req.body;

  // Check if user already has a company
  if (req.user.companyId) {
    throw new ApiError(400, 'You already have a company. Use update instead.');
  }

  const company = await Company.create({
    name,
    region,
    createdBy: req.user._id,
  });

  // Link company to user
  await User.findByIdAndUpdate(req.user._id, { companyId: company._id });

  res.status(201).json(
    new ApiResponse(201, { company }, 'Company created successfully')
  );
});

/**
 * @route   GET /api/company
 * @desc    Get current user's company
 * @access  Private
 */
export const getCompany = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.companyId) {
    return res.status(200).json(
      new ApiResponse(200, { company: null }, 'No company setup yet')
    );
  }

  const company = await Company.findById(user.companyId);

  if (!company) {
    throw new ApiError(404, 'Company not found');
  }

  res.status(200).json(
    new ApiResponse(200, { company }, 'Company fetched successfully')
  );
});

/**
 * @route   PUT /api/company
 * @desc    Update company details
 * @access  Private
 */
export const updateCompany = asyncHandler(async (req, res) => {
  const { name, region } = req.body;

  if (!req.user.companyId) {
    throw new ApiError(400, 'No company to update. Create one first.');
  }

  const company = await Company.findByIdAndUpdate(
    req.user.companyId,
    { name, region },
    { new: true, runValidators: true }
  );

  if (!company) {
    throw new ApiError(404, 'Company not found');
  }

  res.status(200).json(
    new ApiResponse(200, { company }, 'Company updated successfully')
  );
});

import Department from '../models/Department.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @route   POST /api/company/departments
 * @desc    Create a department within the user's company
 * @access  Private
 */
export const createDepartment = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!req.user.companyId) {
    throw new ApiError(400, 'Set up your company first before adding departments');
  }

  const department = await Department.create({
    name,
    companyId: req.user.companyId,
  });

  res.status(201).json(
    new ApiResponse(201, { department }, 'Department created successfully')
  );
});

/**
 * @route   GET /api/company/departments
 * @desc    Get all departments for the user's company
 * @access  Private
 */
export const getDepartments = asyncHandler(async (req, res) => {
  if (!req.user.companyId) {
    return res.status(200).json(
      new ApiResponse(200, { departments: [] }, 'No company setup yet')
    );
  }

  const departments = await Department.find({ companyId: req.user.companyId }).sort('name');

  res.status(200).json(
    new ApiResponse(200, { departments }, 'Departments fetched successfully')
  );
});

/**
 * @route   DELETE /api/company/departments/:id
 * @desc    Delete a department
 * @access  Private
 */
export const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    throw new ApiError(404, 'Department not found');
  }

  // Ensure department belongs to user's company
  if (department.companyId.toString() !== req.user.companyId.toString()) {
    throw new ApiError(403, 'Not authorized to delete this department');
  }

  await Department.findByIdAndDelete(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, 'Department deleted successfully')
  );
});

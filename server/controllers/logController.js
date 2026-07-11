import CarbonLog from '../models/CarbonLog.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @route   POST /api/logs
 * @desc    Create a new carbon log
 * @access  Private
 */
export const createLog = asyncHandler(async (req, res) => {
  const { date, departmentId, activityType, amount, unit, carbonEquivalent } = req.body;

  if (!req.user.companyId) {
    throw new ApiError(400, 'Set up your company before adding logs');
  }

  const log = await CarbonLog.create({
    date,
    departmentId,
    activityType,
    amount,
    unit,
    carbonEquivalent,
    createdBy: req.user._id,
    companyId: req.user.companyId,
  });

  const populated = await CarbonLog.findById(log._id).populate('departmentId', 'name');

  res.status(201).json(
    new ApiResponse(201, { log: populated }, 'Carbon log created successfully')
  );
});

/**
 * @route   GET /api/logs
 * @desc    Get carbon logs with search, filters, and pagination
 * @access  Private
 *
 * Query params:
 *   page (default 1), limit (default 10),
 *   search (keyword), activityType, departmentId,
 *   startDate, endDate, sortBy (default '-date')
 */
export const getLogs = asyncHandler(async (req, res) => {
  if (!req.user.companyId) {
    return res.status(200).json(
      new ApiResponse(200, { logs: [], total: 0, page: 1, totalPages: 0 }, 'No company setup')
    );
  }

  const {
    page = 1,
    limit = 10,
    search,
    activityType,
    departmentId,
    startDate,
    endDate,
    sortBy = '-date',
  } = req.query;

  const query = { companyId: req.user.companyId };

  // Activity type filter
  if (activityType) {
    query.activityType = activityType;
  }

  // Department filter
  if (departmentId) {
    query.departmentId = departmentId;
  }

  // Date range filter
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Search by activity type or unit
  if (search) {
    query.$or = [
      { activityType: { $regex: search, $options: 'i' } },
      { unit: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [logs, total] = await Promise.all([
    CarbonLog.find(query)
      .populate('departmentId', 'name')
      .populate('createdBy', 'name')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit)),
    CarbonLog.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / parseInt(limit));

  res.status(200).json(
    new ApiResponse(200, {
      logs,
      total,
      page: parseInt(page),
      totalPages,
    }, 'Logs fetched successfully')
  );
});

/**
 * @route   PUT /api/logs/:id
 * @desc    Update a carbon log
 * @access  Private
 */
export const updateLog = asyncHandler(async (req, res) => {
  const log = await CarbonLog.findById(req.params.id);

  if (!log) {
    throw new ApiError(404, 'Log not found');
  }

  // Ensure log belongs to user's company
  if (log.companyId.toString() !== req.user.companyId.toString()) {
    throw new ApiError(403, 'Not authorized to update this log');
  }

  const updated = await CarbonLog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('departmentId', 'name');

  res.status(200).json(
    new ApiResponse(200, { log: updated }, 'Log updated successfully')
  );
});

/**
 * @route   DELETE /api/logs/:id
 * @desc    Delete a carbon log
 * @access  Private
 */
export const deleteLog = asyncHandler(async (req, res) => {
  const log = await CarbonLog.findById(req.params.id);

  if (!log) {
    throw new ApiError(404, 'Log not found');
  }

  if (log.companyId.toString() !== req.user.companyId.toString()) {
    throw new ApiError(403, 'Not authorized to delete this log');
  }

  await CarbonLog.findByIdAndDelete(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, 'Log deleted successfully')
  );
});

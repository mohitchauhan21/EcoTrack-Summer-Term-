import CarbonLog from '../models/CarbonLog.js';
import mongoose from 'mongoose';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @route   GET /api/dashboard
 * @desc    Get dashboard KPIs — total emissions, log count, top department, month-over-month trend
 * @access  Private
 */
export const getDashboard = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;

  if (!companyId) {
    return res.status(200).json(
      new ApiResponse(200, {
        totalEmissions: 0,
        logCount: 0,
        topDepartment: null,
        trend: 0,
        recentLogs: [],
      }, 'No company setup')
    );
  }

  const companyObjectId = new mongoose.Types.ObjectId(companyId);

  // Total emissions & log count
  const totals = await CarbonLog.aggregate([
    { $match: { companyId: companyObjectId } },
    {
      $group: {
        _id: null,
        totalEmissions: { $sum: '$carbonEquivalent' },
        logCount: { $sum: 1 },
      },
    },
  ]);

  const totalEmissions = totals[0]?.totalEmissions || 0;
  const logCount = totals[0]?.logCount || 0;

  // Top department by emissions
  const topDeptResult = await CarbonLog.aggregate([
    { $match: { companyId: companyObjectId } },
    {
      $group: {
        _id: '$departmentId',
        total: { $sum: '$carbonEquivalent' },
      },
    },
    { $sort: { total: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: 'departments',
        localField: '_id',
        foreignField: '_id',
        as: 'department',
      },
    },
    { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
  ]);

  const topDepartment = topDeptResult[0]
    ? { name: topDeptResult[0].department?.name || 'Unknown', total: topDeptResult[0].total }
    : null;

  // Month-over-month trend
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const [thisMonthData, lastMonthData] = await Promise.all([
    CarbonLog.aggregate([
      { $match: { companyId: companyObjectId, date: { $gte: thisMonthStart } } },
      { $group: { _id: null, total: { $sum: '$carbonEquivalent' } } },
    ]),
    CarbonLog.aggregate([
      { $match: { companyId: companyObjectId, date: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
      { $group: { _id: null, total: { $sum: '$carbonEquivalent' } } },
    ]),
  ]);

  const thisMonthTotal = thisMonthData[0]?.total || 0;
  const lastMonthTotal = lastMonthData[0]?.total || 0;
  const trend = lastMonthTotal > 0
    ? (((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)
    : 0;

  // Recent logs (last 5)
  const recentLogs = await CarbonLog.find({ companyId })
    .populate('departmentId', 'name')
    .sort('-date')
    .limit(5);

  res.status(200).json(
    new ApiResponse(200, {
      totalEmissions,
      logCount,
      topDepartment,
      trend: parseFloat(trend),
      recentLogs,
    }, 'Dashboard data fetched')
  );
});

/**
 * @route   GET /api/analytics
 * @desc    Get analytics data — emissions by activity, by department, by month
 * @access  Private
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const companyId = req.user.companyId;

  if (!companyId) {
    return res.status(200).json(
      new ApiResponse(200, { byActivity: [], byDepartment: [], byMonth: [] }, 'No company setup')
    );
  }

  const companyObjectId = new mongoose.Types.ObjectId(companyId);

  // Build date filter
  const dateFilter = {};
  if (req.query.startDate) dateFilter.$gte = new Date(req.query.startDate);
  if (req.query.endDate) dateFilter.$lte = new Date(req.query.endDate);

  const matchStage = { companyId: companyObjectId };
  if (Object.keys(dateFilter).length > 0) matchStage.date = dateFilter;
  if (req.query.departmentId) matchStage.departmentId = new mongoose.Types.ObjectId(req.query.departmentId);

  // By activity type
  const byActivity = await CarbonLog.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$activityType',
        total: { $sum: '$carbonEquivalent' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  // By department
  const byDepartment = await CarbonLog.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$departmentId',
        total: { $sum: '$carbonEquivalent' },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'departments',
        localField: '_id',
        foreignField: '_id',
        as: 'department',
      },
    },
    { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        name: { $ifNull: ['$department.name', 'Unknown'] },
        total: 1,
        count: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);

  // By month (last 12 months)
  const byMonth = await CarbonLog.aggregate([
    { $match: { companyId: companyObjectId } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        total: { $sum: '$carbonEquivalent' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  res.status(200).json(
    new ApiResponse(200, { byActivity, byDepartment, byMonth }, 'Analytics data fetched')
  );
});

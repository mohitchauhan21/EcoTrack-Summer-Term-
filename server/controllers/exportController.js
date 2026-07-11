import XLSX from 'xlsx';
import CarbonLog from '../models/CarbonLog.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @route   GET /api/export
 * @desc    Export carbon logs as Excel file
 * @access  Private
 */
export const exportLogs = asyncHandler(async (req, res) => {
  if (!req.user.companyId) {
    throw new ApiError(400, 'Set up your company before exporting');
  }

  const logs = await CarbonLog.find({ companyId: req.user.companyId })
    .populate('departmentId', 'name')
    .populate('createdBy', 'name')
    .sort('-date');

  if (!logs.length) {
    throw new ApiError(404, 'No logs to export');
  }

  // Transform data for Excel
  const data = logs.map((log) => ({
    Date: new Date(log.date).toLocaleDateString(),
    Department: log.departmentId?.name || 'Unknown',
    'Activity Type': log.activityType,
    Amount: log.amount,
    Unit: log.unit,
    'CO₂ Equivalent (kg)': log.carbonEquivalent,
    'Created By': log.createdBy?.name || 'Unknown',
    'Created At': new Date(log.createdAt).toLocaleDateString(),
  }));

  // Create workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Carbon Logs');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 12 }, // Date
    { wch: 20 }, // Department
    { wch: 15 }, // Activity Type
    { wch: 10 }, // Amount
    { wch: 10 }, // Unit
    { wch: 18 }, // CO2e
    { wch: 15 }, // Created By
    { wch: 12 }, // Created At
  ];

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  // Set response headers for download
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=EcoTrack_Carbon_Report_${Date.now()}.xlsx`);
  res.send(buffer);
});

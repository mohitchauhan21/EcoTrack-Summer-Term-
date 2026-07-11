import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import XLSX from 'xlsx';
import CarbonLog from '../models/CarbonLog.js';
import Department from '../models/Department.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const VALID_ACTIVITY_TYPES = ['electricity', 'transport', 'waste', 'water', 'fuel', 'other'];

/**
 * Parse CSV file and return rows.
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', (err) => reject(err));
  });
};

/**
 * Parse Excel file and return rows.
 */
const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
};

/**
 * Validate and transform a row of data.
 */
const validateRow = (row, index, departmentMap) => {
  const errors = [];
  const transformed = {};

  // Date
  const dateValue = row.date || row.Date;
  if (!dateValue) {
    errors.push(`Row ${index + 1}: Missing date`);
  } else {
    const parsed = new Date(dateValue);
    if (isNaN(parsed.getTime())) {
      errors.push(`Row ${index + 1}: Invalid date "${dateValue}"`);
    } else {
      transformed.date = parsed;
    }
  }

  // Department
  const deptName = (row.department || row.Department || '').trim();
  if (!deptName) {
    errors.push(`Row ${index + 1}: Missing department`);
  } else {
    const deptId = departmentMap[deptName.toLowerCase()];
    if (!deptId) {
      errors.push(`Row ${index + 1}: Department "${deptName}" not found. Create it first.`);
    } else {
      transformed.departmentId = deptId;
    }
  }

  // Activity Type
  const activity = (row.activityType || row.activity_type || row['Activity Type'] || '').trim().toLowerCase();
  if (!activity) {
    errors.push(`Row ${index + 1}: Missing activity type`);
  } else if (!VALID_ACTIVITY_TYPES.includes(activity)) {
    errors.push(`Row ${index + 1}: Invalid activity type "${activity}". Must be one of: ${VALID_ACTIVITY_TYPES.join(', ')}`);
  } else {
    transformed.activityType = activity;
  }

  // Amount
  const amount = parseFloat(row.amount || row.Amount);
  if (isNaN(amount) || amount < 0) {
    errors.push(`Row ${index + 1}: Invalid or missing amount`);
  } else {
    transformed.amount = amount;
  }

  // Unit
  const unit = (row.unit || row.Unit || '').trim();
  if (!unit) {
    errors.push(`Row ${index + 1}: Missing unit`);
  } else {
    transformed.unit = unit;
  }

  // Carbon Equivalent
  const co2e = parseFloat(row.carbonEquivalent || row.carbon_equivalent || row['CO2e'] || row['co2e']);
  if (isNaN(co2e) || co2e < 0) {
    errors.push(`Row ${index + 1}: Invalid or missing carbon equivalent`);
  } else {
    transformed.carbonEquivalent = co2e;
  }

  return { errors, transformed };
};

/**
 * @route   POST /api/upload
 * @desc    Upload CSV/Excel, validate, preview, and bulk insert
 * @access  Private
 */
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  if (!req.user.companyId) {
    throw new ApiError(400, 'Set up your company before uploading');
  }

  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  let rows;
  try {
    if (ext === '.csv') {
      rows = await parseCSV(filePath);
    } else {
      rows = parseExcel(filePath);
    }
  } catch (err) {
    // Cleanup file
    fs.unlink(filePath, () => {});
    throw new ApiError(400, `Failed to parse file: ${err.message}`);
  }

  if (!rows.length) {
    fs.unlink(filePath, () => {});
    throw new ApiError(400, 'File is empty');
  }

  // Build department map
  const departments = await Department.find({ companyId: req.user.companyId });
  const departmentMap = {};
  departments.forEach((d) => {
    departmentMap[d.name.toLowerCase()] = d._id;
  });

  // Validate all rows
  const allErrors = [];
  const validRows = [];

  rows.forEach((row, idx) => {
    const { errors, transformed } = validateRow(row, idx, departmentMap);
    if (errors.length > 0) {
      allErrors.push(...errors);
    } else {
      validRows.push({
        ...transformed,
        createdBy: req.user._id,
        companyId: req.user.companyId,
      });
    }
  });

  // If confirm flag is set and there are valid rows, insert them
  if (req.query.confirm === 'true' && validRows.length > 0) {
    const inserted = await CarbonLog.insertMany(validRows);
    // Cleanup file
    fs.unlink(filePath, () => {});

    return res.status(201).json(
      new ApiResponse(201, {
        inserted: inserted.length,
        errors: allErrors,
      }, `${inserted.length} logs inserted successfully`)
    );
  }

  // Otherwise return preview
  // Cleanup file on preview (we'll re-parse on confirm)
  // Actually keep the file for confirm step — but for simplicity, insert on confirm=true

  res.status(200).json(
    new ApiResponse(200, {
      totalRows: rows.length,
      validRows: validRows.length,
      invalidRows: allErrors.length > 0 ? rows.length - validRows.length : 0,
      errors: allErrors.slice(0, 20), // Limit error messages
      preview: validRows.slice(0, 10).map((r) => ({
        date: r.date,
        activityType: r.activityType,
        department: departments.find((d) => d._id.toString() === r.departmentId.toString())?.name,
        amount: r.amount,
        unit: r.unit,
        carbonEquivalent: r.carbonEquivalent,
      })),
      filePath: req.file.filename,
    }, 'File parsed successfully')
  );
});

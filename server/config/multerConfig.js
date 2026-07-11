import multer from 'multer';
import path from 'path';
import ApiError from '../utils/ApiError.js';

/**
 * Multer configuration for CSV/Excel file uploads.
 * Stores files in the 'uploads/' directory.
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `upload-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  // Also check by extension for broader compatibility
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.csv', '.xls', '.xlsx'];

  if (allowedTypes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only CSV and Excel files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;

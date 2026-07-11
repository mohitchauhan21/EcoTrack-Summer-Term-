import { Router } from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../config/multerConfig.js';

const router = Router();

router.use(protect);

/**
 * @route   POST /api/upload
 * @desc    Upload CSV/Excel file for bulk carbon log insert
 * @query   confirm=true to insert after preview
 */
router.post('/', upload.single('file'), uploadFile);

export default router;

import { Router } from 'express';
import { exportLogs } from '../controllers/exportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

/**
 * @route   GET /api/export
 * @desc    Export carbon logs as Excel
 */
router.get('/', exportLogs);

export default router;

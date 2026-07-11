import { Router } from 'express';
import { getDashboard, getAnalytics } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

/**
 * @route   GET /api/dashboard
 * @desc    Get dashboard KPIs and recent logs
 */
router.get('/', getDashboard);

/**
 * @route   GET /api/analytics
 * @desc    Get analytics aggregation data
 */
router.get('/analytics', getAnalytics);

export default router;

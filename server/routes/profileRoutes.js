import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

/**
 * @route   GET /api/profile
 * @desc    Get user profile
 */
router.get('/', getProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 */
router.put('/', updateProfile);

/**
 * @route   PUT /api/profile/password
 * @desc    Change password
 */
router.put('/password', changePassword);

export default router;

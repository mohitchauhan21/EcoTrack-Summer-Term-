import { Router } from 'express';
import ApiResponse from '../utils/ApiResponse.js';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', (_req, res) => {
  res.status(200).json(new ApiResponse(200, { status: 'running' }, 'Server is healthy'));
});

export default router;

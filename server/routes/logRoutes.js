import { Router } from 'express';
import { createLog, getLogs, updateLog, deleteLog } from '../controllers/logController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// All routes are protected
router.use(protect);

/**
 * @route   GET /api/logs
 * @desc    Get carbon logs with filters and pagination
 */
router.get('/', getLogs);

/**
 * @route   POST /api/logs
 * @desc    Create a new carbon log
 */
router.post('/', createLog);

/**
 * @route   PUT /api/logs/:id
 * @desc    Update a carbon log
 */
router.put('/:id', updateLog);

/**
 * @route   DELETE /api/logs/:id
 * @desc    Delete a carbon log
 */
router.delete('/:id', deleteLog);

export default router;

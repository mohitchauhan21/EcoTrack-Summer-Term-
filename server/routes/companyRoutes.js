import { Router } from 'express';
import { createCompany, getCompany, updateCompany } from '../controllers/companyController.js';
import { createDepartment, getDepartments, deleteDepartment } from '../controllers/departmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// All routes are protected
router.use(protect);

// Company routes
router.post('/', createCompany);
router.get('/', getCompany);
router.put('/', updateCompany);

// Department routes (nested under company)
router.post('/departments', createDepartment);
router.get('/departments', getDepartments);
router.delete('/departments/:id', deleteDepartment);

export default router;

import { Router } from "express";
import { getDepartments, createDepartment, deleteDepartment } from "../controllers/departmentController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.get("/", requireAuth, getDepartments);
router.post("/", requireAuth, requireRole(["admin"]), createDepartment);
router.delete("/:id", requireAuth, requireRole(["admin"]), deleteDepartment);

export default router;

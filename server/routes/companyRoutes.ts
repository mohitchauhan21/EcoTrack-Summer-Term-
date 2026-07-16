import { Router } from "express";
import { getCompany, updateCompany } from "../controllers/companyController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.get("/", requireAuth, getCompany);
router.post("/", requireAuth, requireRole(["admin", "superadmin"]), updateCompany);

export default router;

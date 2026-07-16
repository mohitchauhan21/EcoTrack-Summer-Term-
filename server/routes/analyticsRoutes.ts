import { Router } from "express";
import { getSummary, getTrend, getBySource, getByDepartment, exportData } from "../controllers/analyticsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/summary", requireAuth, getSummary);
router.get("/trend", requireAuth, getTrend);
router.get("/by-source", requireAuth, getBySource);
router.get("/by-department", requireAuth, getByDepartment);
router.get("/export", requireAuth, exportData);

export default router;

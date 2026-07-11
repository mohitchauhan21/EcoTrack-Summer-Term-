import { Router } from "express";
import { getSummary, getTrend, getBySource, getByDepartment, exportData } from "../controllers/analyticsController.js";

const router = Router();

router.get("/summary", getSummary);
router.get("/trend", getTrend);
router.get("/by-source", getBySource);
router.get("/by-department", getByDepartment);
router.get("/export", exportData);

export default router;

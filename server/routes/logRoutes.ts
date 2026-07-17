import { Router } from "express";
import { createLog, getLogs, updateLog, deleteLog, bulkUploadLogs } from "../controllers/logController.js";
import { upload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

const canManageLogs = requireRole(["admin", "employee"]);

router.post("/", requireAuth, canManageLogs, createLog);
router.get("/", requireAuth, canManageLogs, getLogs);
router.put("/:id", requireAuth, canManageLogs, updateLog);
router.delete("/:id", requireAuth, canManageLogs, deleteLog);
router.post("/bulk-upload", requireAuth, canManageLogs, upload.single("file"), bulkUploadLogs);

export default router;

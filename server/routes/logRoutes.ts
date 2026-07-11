import { Router } from "express";
import { createLog, getLogs, updateLog, deleteLog, bulkUploadLogs } from "../controllers/logController.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/", createLog);
router.get("/", getLogs);
router.put("/:id", updateLog);
router.delete("/:id", deleteLog);
router.post("/bulk-upload", upload.single("file"), bulkUploadLogs);

export default router;

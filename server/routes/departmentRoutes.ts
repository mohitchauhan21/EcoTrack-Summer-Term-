import { Router } from "express";
import { getDepartments, createDepartment, deleteDepartment } from "../controllers/departmentController.js";

const router = Router();

router.get("/", getDepartments);
router.post("/", createDepartment);
router.delete("/:id", deleteDepartment);

export default router;

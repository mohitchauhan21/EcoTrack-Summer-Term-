import { Router } from "express";
import { getCompany, updateCompany } from "../controllers/companyController.js";

const router = Router();

router.get("/", getCompany);
router.post("/", updateCompany);

export default router;

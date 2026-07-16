import express from "express";
import { getUsers, createUser, deleteUser } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

const canManageUsers = requireRole(["superadmin", "admin"]);

router.get("/", requireAuth, canManageUsers, getUsers);
router.post("/", requireAuth, canManageUsers, createUser);
router.delete("/:id", requireAuth, canManageUsers, deleteUser);

export default router;

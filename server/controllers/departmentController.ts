import { Request, Response } from "express";
import mongoose from "mongoose";
import { Department } from "../models/Department.js";

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await Department.find({ active: true, companyId: req.user!.companyId });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const companyId = req.user!.companyId; // trust the token, not the request body
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const duplicate = await Department.findOne({
      companyId,
      active: true,
      name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }
    });
    if (duplicate) {
      return res.status(409).json({ message: `A department named "${name}" already exists` });
    }

    const department = await Department.create({ companyId, name });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid department id" });
    }

    // Scope the update to the caller's own company so one company can't deactivate another's department.
    const department = await Department.findOneAndUpdate(
      { _id: id, companyId: req.user!.companyId },
      { active: false }
    );
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({ message: "Department deactivated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

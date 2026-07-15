import { Request, Response } from "express";
import mongoose from "mongoose";
import { Department } from "../models/Department.js";
import { Company } from "../models/Company.js";

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await Department.find({ active: true });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.body;
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Valid companyId is required" });
    }

    const companyExists = await Company.exists({ _id: companyId });
    if (!companyExists) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Case-insensitive duplicate check within the same company
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

    const department = await Department.findByIdAndUpdate(id, { active: false });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({ message: "Department deactivated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

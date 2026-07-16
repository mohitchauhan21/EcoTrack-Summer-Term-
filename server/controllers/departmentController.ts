import { Request, Response } from "express";
import { Department } from "../models/Department.js";

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
    const { companyId, name } = req.body;
    const department = await Department.create({ companyId, name });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Department.findByIdAndUpdate(id, { active: false });
    res.json({ message: "Department deactivated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

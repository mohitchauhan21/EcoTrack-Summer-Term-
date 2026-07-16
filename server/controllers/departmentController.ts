import { Request, Response } from "express";
import { Company } from "../models/Company.js";
import { Department } from "../models/Department.js";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const resolveCompanyId = async (req: Request) => {
  const requestedCompanyId = req.query.companyId ?? req.body?.companyId;

  if (requestedCompanyId) {
    return requestedCompanyId;
  }

  const company = await Company.findOne();
  return company?._id ?? null;
};

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const companyId = await resolveCompanyId(req);
    const departments = await Department.find({
      ...(companyId ? { companyId } : {}),
      active: true,
    }).sort({ createdAt: 1 });

    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const companyId = await resolveCompanyId(req);

    if (!companyId) {
      return res.status(404).json({ message: "No company found. Please complete onboarding first." });
    }

    if (!name) {
      return res.status(400).json({ message: "Department name is required." });
    }

    const existing = await Department.findOne({
      companyId,
      name: { $regex: new RegExp(`^${escapeRegex(name)}$`, "i") },
      active: true,
    });

    if (existing) {
      return res.status(400).json({ message: "A department with this name already exists." });
    }

    const department = await Department.create({ companyId, name });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";

    if (!name) {
      return res.status(400).json({ message: "Department name is required." });
    }

    const current = await Department.findById(id);
    if (!current) {
      return res.status(404).json({ message: "Department not found." });
    }

    const existing = await Department.findOne({
      companyId: current.companyId,
      name: { $regex: new RegExp(`^${escapeRegex(name)}$`, "i") },
      active: true,
      _id: { $ne: id },
    });

    if (existing) {
      return res.status(400).json({ message: "A department with this name already exists." });
    }

    current.name = name;
    await current.save();
    res.json(current);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndUpdate(id, { active: false }, { new: true });

    if (!department) {
      return res.status(404).json({ message: "Department not found." });
    }

    res.json({ message: "Department deactivated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

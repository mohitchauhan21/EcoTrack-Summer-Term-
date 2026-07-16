import { Request, Response } from "express";
import { Company, VALID_REGIONS } from "../models/Company.js";

export const getCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.user!.companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const region = req.body.region;

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }
    if (!VALID_REGIONS.includes(region)) {
      return res.status(400).json({ message: `Region must be one of: ${VALID_REGIONS.join(", ")}` });
    }

    const company = await Company.findById(req.user!.companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    company.name = name;
    company.region = region;
    await company.save();

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

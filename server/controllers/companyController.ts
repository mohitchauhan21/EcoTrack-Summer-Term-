import { Request, Response } from "express";
import { Company } from "../models/Company.js";

export const getCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findOne();
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { name, region } = req.body;
    let company = await Company.findOne();
    if (company) {
      company.name = name;
      company.region = region;
      await company.save();
    } else {
      company = await Company.create({ name, region });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

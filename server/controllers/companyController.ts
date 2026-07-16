import { Request, Response } from "express";
import { Company } from "../models/Company.js";

const normalizeCompanyPayload = (body: Record<string, unknown>) => {
  const updates: {
    name?: string;
    region?: string;
    carbonTarget?: number;
    reportingFrequency?: "monthly" | "quarterly" | "annually";
    anomalyThreshold?: number;
  } = {};

  if (body.name !== undefined) updates.name = String(body.name).trim();
  if (body.region !== undefined) updates.region = String(body.region).trim();
  if (body.carbonTarget !== undefined) updates.carbonTarget = Number(body.carbonTarget);
  if (body.reportingFrequency !== undefined) {
    const frequency = String(body.reportingFrequency);
    if (frequency === "monthly" || frequency === "quarterly" || frequency === "annually") {
      updates.reportingFrequency = frequency;
    }
  }
  if (body.anomalyThreshold !== undefined) updates.anomalyThreshold = Number(body.anomalyThreshold);

  return updates;
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    const requestedCompanyId = req.query.companyId;
    const company = requestedCompanyId
      ? await Company.findById(requestedCompanyId)
      : await Company.findOne();

    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const updates = normalizeCompanyPayload(req.body);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No company updates were provided." });
    }

    let company = await Company.findOne();

    if (company) {
      Object.assign(company, updates);
      await company.save();
      return res.json(company);
    }

    if (!updates.name || !updates.region) {
      return res.status(400).json({ message: "Company name and region are required." });
    }

    company = await Company.create({
      name: updates.name,
      region: updates.region,
      carbonTarget: updates.carbonTarget ?? 1000,
      reportingFrequency: updates.reportingFrequency ?? "monthly",
      anomalyThreshold: updates.anomalyThreshold ?? 50,
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

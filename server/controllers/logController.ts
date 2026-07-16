import { Request, Response } from "express";
import { EmissionLog } from "../models/EmissionLog.js";
import { Department } from "../models/Department.js";
import { calculateCarbonEquivalent } from "../utils/conversionFactors.js";
import csvParser from "csv-parser";
import { Readable } from "stream";

export const createLog = async (req: Request, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const { departmentId, date, activityType, rawAmount, rawUnit, source } = req.body;

    // Make sure the department actually belongs to this user's company —
    // otherwise a log could be attached to another company's department.
    const department = await Department.findOne({ _id: departmentId, companyId });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const carbonEquivalent = calculateCarbonEquivalent(activityType, rawUnit, rawAmount);

    const log = await EmissionLog.create({
      companyId,
      departmentId,
      date,
      activityType,
      rawAmount,
      rawUnit,
      carbonEquivalent,
      source
    });

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getLogs = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, departmentId, startDate, endDate } = req.query;
    
    const query: any = { companyId: req.user!.companyId };
    if (departmentId && departmentId !== "all") query.departmentId = departmentId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const logs = await EmissionLog.find(query)
      .sort({ date: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate("departmentId", "name");

    const total = await EmissionLog.countDocuments(query);

    res.json({ logs, total });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { activityType, rawAmount, rawUnit } = req.body;
    const companyId = req.user!.companyId;

    const log = await EmissionLog.findOne({ _id: id, companyId });
    if (!log) return res.status(404).json({ message: "Log not found" });

    const updates = { ...req.body };
    if (activityType || rawAmount || rawUnit) {
      const newActivity = activityType || log.activityType;
      const newUnit = rawUnit || log.rawUnit;
      const newAmount = rawAmount !== undefined ? rawAmount : log.rawAmount;

      updates.carbonEquivalent = calculateCarbonEquivalent(newActivity, newUnit, newAmount);
    }
    // Never let the request body override which company this log belongs to.
    delete updates.companyId;

    const updatedLog = await EmissionLog.findOneAndUpdate({ _id: id, companyId }, updates, { new: true });
    res.json(updatedLog);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await EmissionLog.findOneAndDelete({ _id: id, companyId: req.user!.companyId });
    if (!deleted) return res.status(404).json({ message: "Log not found" });
    res.json({ message: "Log deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const bulkUploadLogs = async (req: Request, res: Response) => {
  const file = (req as any).file;
  if (!file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const companyId = req.user!.companyId;

    const departments = await Department.find({ companyId });
    const deptMap = new Map(departments.map(d => [d.name.toLowerCase(), d._id]));

    const docs: any[] = [];
    const errors: any[] = [];
    let rowNum = 1;

    const stream = Readable.from(file.buffer.toString('utf-8'));
    
    stream.pipe(csvParser())
      .on("data", (row) => {
        rowNum++;
        const { date, department, activityType, rawAmount, rawUnit, source } = row;

        if (!date || !department || !activityType || !rawAmount || !rawUnit) {
          errors.push({ row: rowNum, reason: "Missing required fields" });
          return;
        }

        const deptId = deptMap.get(department.trim().toLowerCase());
        if (!deptId) {
          errors.push({ row: rowNum, reason: `Unknown department: ${department}` });
          return;
        }

        const amount = Number(rawAmount);
        if (isNaN(amount)) {
          errors.push({ row: rowNum, reason: "Invalid rawAmount" });
          return;
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          errors.push({ row: rowNum, reason: "Invalid date" });
          return;
        }

        const carbonEquivalent = calculateCarbonEquivalent(activityType, rawUnit, amount);

        docs.push({
          companyId,
          departmentId: deptId,
          date: parsedDate,
          activityType,
          rawAmount: amount,
          rawUnit,
          carbonEquivalent,
          source
        });
      })
      .on("end", async () => {
        let insertedCount = 0;
        if (docs.length > 0) {
          await EmissionLog.insertMany(docs);
          insertedCount = docs.length;
        }
        res.json({ insertedCount, errorCount: errors.length, errors });
      });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

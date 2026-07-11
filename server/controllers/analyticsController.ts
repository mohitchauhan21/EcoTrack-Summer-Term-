import { Request, Response } from "express";
import mongoose from "mongoose";
import { EmissionLog } from "../models/EmissionLog.js";
import ExcelJS from "exceljs";

const buildMatchStage = (req: Request) => {
  const { departmentId, startDate, endDate } = req.query;
  const match: any = {};
  
  if (departmentId && departmentId !== "all") {
    match.departmentId = new mongoose.Types.ObjectId(departmentId as string);
  }
  
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate as string);
    if (endDate) match.date.$lte = new Date(endDate as string);
  }
  
  return match;
};

export const getSummary = async (req: Request, res: Response) => {
  try {
    const match = buildMatchStage(req);

    // 1. Total Emissions + Log Count
    const totalResult = await EmissionLog.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: "$carbonEquivalent" }, count: { $sum: 1 } } }
    ]);
    const totalEmissions = totalResult[0]?.total || 0;
    const logCount = totalResult[0]?.count || 0;

    // 2. Highest Emitting Dept
    const topDeptResult = await EmissionLog.aggregate([
      { $match: match },
      { $group: { _id: "$departmentId", total: { $sum: "$carbonEquivalent" } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
      { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "dept" } },
      { $unwind: "$dept" }
    ]);

    let highestEmittingDept = null;
    if (topDeptResult.length > 0 && totalEmissions > 0) {
      highestEmittingDept = {
        name: topDeptResult[0].dept.name,
        percentage: ((topDeptResult[0].total / totalEmissions) * 100).toFixed(1)
      };
    }

    // 3. MoM Change (Previous Period)
    const { startDate, endDate } = req.query;
    let momChange = 0;
    
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      
      const prevEnd = new Date(start.getTime() - 1);
      const prevStart = new Date(prevEnd.getTime() - diffTime);

      const prevMatch = { ...match, date: { $gte: prevStart, $lte: prevEnd } };
      
      const prevTotalResult = await EmissionLog.aggregate([
        { $match: prevMatch },
        { $group: { _id: null, total: { $sum: "$carbonEquivalent" } } }
      ]);
      
      const prevTotal = prevTotalResult[0]?.total || 0;
      if (prevTotal > 0) {
        momChange = ((totalEmissions - prevTotal) / prevTotal) * 100;
      }
    }

    res.json({
      totalEmissions: Number(totalEmissions.toFixed(2)),
      logCount,
      highestEmittingDept,
      momChange: Number(momChange.toFixed(1))
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getTrend = async (req: Request, res: Response) => {
  try {
    const match = buildMatchStage(req);

    const trend = await EmissionLog.aggregate([
      { $match: match },
      { $group: { 
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          total: { $sum: "$carbonEquivalent" } 
      }},
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $project: {
          _id: 0,
          month: {
            $arrayElemAt: [
              ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              "$_id.month"
            ]
          },
          year: "$_id.year",
          tCO2e: { $round: ["$total", 2] }
      }}
    ]);

    res.json(trend.map(t => ({ month: `${t.month} ${t.year.toString().slice(2)}`, tCO2e: t.tCO2e })));
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getBySource = async (req: Request, res: Response) => {
  try {
    const match = buildMatchStage(req);

    const sources = await EmissionLog.aggregate([
      { $match: match },
      { $group: { _id: "$activityType", value: { $sum: "$carbonEquivalent" } } },
      { $project: { _id: 0, name: "$_id", value: { $round: ["$value", 2] } } }
    ]);

    res.json(sources);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getByDepartment = async (req: Request, res: Response) => {
  try {
    const match = buildMatchStage(req);

    const depts = await EmissionLog.aggregate([
      { $match: match },
      { $group: { _id: "$departmentId", value: { $sum: "$carbonEquivalent" } } },
      { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "dept" } },
      { $unwind: "$dept" },
      { $project: { _id: 0, name: "$dept.name", value: { $round: ["$value", 2] } } },
      { $sort: { value: -1 } }
    ]);

    res.json(depts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const exportData = async (req: Request, res: Response) => {
  try {
    const match = buildMatchStage(req);
    
    const logs = await EmissionLog.find(match)
      .populate("departmentId", "name")
      .sort({ date: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Emissions");

    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Department", key: "department", width: 20 },
      { header: "Activity Type", key: "activityType", width: 20 },
      { header: "Raw Amount", key: "rawAmount", width: 15 },
      { header: "Unit", key: "rawUnit", width: 10 },
      { header: "CO2e (tonnes)", key: "carbonEquivalent", width: 15 },
      { header: "Source", key: "source", width: 30 }
    ];

    logs.forEach(log => {
      worksheet.addRow({
        date: log.date.toISOString().split('T')[0],
        department: (log.departmentId as any)?.name || "Unknown",
        activityType: log.activityType,
        rawAmount: log.rawAmount,
        rawUnit: log.rawUnit,
        carbonEquivalent: log.carbonEquivalent.toFixed(2),
        source: log.source || ""
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="ecotrack-export.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

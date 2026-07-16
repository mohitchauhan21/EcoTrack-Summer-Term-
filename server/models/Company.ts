import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICompany extends Document {
  name: string;
  region: string;
  carbonTarget: number;
  reportingFrequency: "monthly" | "quarterly" | "annually";
  anomalyThreshold: number;
  createdAt: Date;
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  region: { type: String, required: true },
  carbonTarget: { type: Number, default: 1000 },
  reportingFrequency: { type: String, enum: ["monthly", "quarterly", "annually"], default: "monthly" },
  anomalyThreshold: { type: Number, default: 50 },
  createdAt: { type: Date, default: Date.now }
});

export const Company = mongoose.model<ICompany>("Company", CompanySchema);

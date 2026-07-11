import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICompany extends Document {
  name: string;
  region: string;
  createdAt: Date;
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  region: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Company = mongoose.model<ICompany>("Company", CompanySchema);

import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEmissionLog extends Document {
  companyId: Types.ObjectId;
  departmentId: Types.ObjectId;
  date: Date;
  activityType: string;
  rawAmount: number;
  rawUnit: string;
  carbonEquivalent: number;
  source?: string;
  createdAt: Date;
}

const EmissionLogSchema = new Schema<IEmissionLog>({
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  departmentId: { type: Schema.Types.ObjectId, ref: "Department", required: true },
  date: { type: Date, required: true },
  activityType: { type: String, enum: ["Travel", "Utilities", "Supply Chain", "Other"], required: true },
  rawAmount: { type: Number, required: true },
  rawUnit: { type: String, required: true },
  carbonEquivalent: { type: Number, required: true },
  source: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const EmissionLog = mongoose.model<IEmissionLog>("EmissionLog", EmissionLogSchema);

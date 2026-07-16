import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDepartment extends Document {
  companyId: Types.ObjectId;
  name: string;
  active: boolean;
}

const DepartmentSchema = new Schema<IDepartment>({
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  name: { type: String, required: true, trim: true },
  active: { type: Boolean, default: true }
});

export const Department = mongoose.model<IDepartment>("Department", DepartmentSchema);

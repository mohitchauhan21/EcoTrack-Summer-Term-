import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'admin' | 'employee' | 'executive';
  companyId: mongoose.Types.ObjectId;
  departmentId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // select: false means password is excluded from queries by default (e.g. Company/User lookups
  // elsewhere in the app won't accidentally leak the hash) - authController explicitly opts in
  // with .select("+password") when it actually needs to compare it during login.
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['superadmin', 'admin', 'employee', 'executive'], required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", UserSchema);

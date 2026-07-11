import mongoose from 'mongoose';

/**
 * Department Schema
 * Represents a department within a company.
 */
const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
      maxlength: [100, 'Department name cannot exceed 100 characters'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique department names within a company
departmentSchema.index({ name: 1, companyId: 1 }, { unique: true });

const Department = mongoose.model('Department', departmentSchema);

export default Department;

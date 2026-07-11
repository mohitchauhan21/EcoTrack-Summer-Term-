import mongoose from 'mongoose';

/**
 * Company Schema
 * Represents an organization using the platform.
 */
const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      trim: true,
      maxlength: [100, 'Region cannot exceed 100 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', companySchema);

export default Company;

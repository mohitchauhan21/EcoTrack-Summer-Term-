import mongoose from 'mongoose';

/**
 * CarbonLog Schema
 * Represents a single carbon emission activity record.
 */
const carbonLogSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    activityType: {
      type: String,
      required: [true, 'Activity type is required'],
      enum: {
        values: ['electricity', 'transport', 'waste', 'water', 'fuel', 'other'],
        message: '{VALUE} is not a valid activity type',
      },
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
      maxlength: [30, 'Unit cannot exceed 30 characters'],
    },
    carbonEquivalent: {
      type: Number,
      required: [true, 'Carbon equivalent is required'],
      min: [0, 'Carbon equivalent cannot be negative'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common query patterns
carbonLogSchema.index({ companyId: 1, date: -1 });
carbonLogSchema.index({ companyId: 1, activityType: 1 });
carbonLogSchema.index({ departmentId: 1 });

const CarbonLog = mongoose.model('CarbonLog', carbonLogSchema);

export default CarbonLog;

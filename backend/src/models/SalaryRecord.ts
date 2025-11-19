import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISalaryRecord extends Document {
  monthReport_id: Types.ObjectId;
  user_id: Types.ObjectId;
  gross: number;
  deductions: number;
  net: number;
  paid_state: boolean;
  paid_date?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SalaryRecordSchema = new Schema<ISalaryRecord>(
  {
    monthReport_id: {
      type: Schema.Types.ObjectId,
      ref: 'MonthReport',
      required: [true, 'Month report is required'],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    gross: {
      type: Number,
      required: [true, 'Gross salary is required'],
      min: [0, 'Gross salary must be positive'],
    },
    deductions: {
      type: Number,
      default: 0,
      min: [0, 'Deductions cannot be negative'],
    },
    net: {
      type: Number,
      required: [true, 'Net salary is required'],
      min: [0, 'Net salary must be positive'],
    },
    paid_state: {
      type: Boolean,
      default: false,
    },
    paid_date: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

SalaryRecordSchema.index({ monthReport_id: 1 });
SalaryRecordSchema.index({ user_id: 1 });
SalaryRecordSchema.index({ monthReport_id: 1, user_id: 1 }, { unique: true });

export const SalaryRecord = mongoose.model<ISalaryRecord>(
  'SalaryRecord',
  SalaryRecordSchema
);


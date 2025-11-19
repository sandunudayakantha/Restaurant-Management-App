import mongoose, { Document, Schema, Types } from 'mongoose';

export enum MonthReportStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface IMonthReport extends Document {
  month: string; // YYYY-MM format
  start_date: Date;
  end_date: Date;
  created_by: Types.ObjectId;
  status: MonthReportStatus;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MonthReportSchema = new Schema<IMonthReport>(
  {
    month: {
      type: String,
      required: [true, 'Month is required'],
      unique: true,
      match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
    },
    start_date: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    end_date: {
      type: Date,
      required: [true, 'End date is required'],
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(MonthReportStatus),
      default: MonthReportStatus.OPEN,
    },
    closedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

MonthReportSchema.index({ month: 1 });
MonthReportSchema.index({ status: 1 });
MonthReportSchema.index({ created_by: 1 });

export const MonthReport = mongoose.model<IMonthReport>(
  'MonthReport',
  MonthReportSchema
);


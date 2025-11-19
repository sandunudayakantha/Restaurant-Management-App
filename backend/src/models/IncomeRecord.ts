import mongoose, { Document, Schema, Types } from 'mongoose';

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  ONLINE = 'online',
  CHEQUE = 'cheque',
  OTHER = 'other',
}

export interface IIncomeRecord extends Document {
  date: Date;
  source: string;
  amount: number;
  payment_method: PaymentMethod;
  created_by: Types.ObjectId;
  note?: string;
  monthReport_id?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const IncomeRecordSchema = new Schema<IIncomeRecord>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    payment_method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: [true, 'Payment method is required'],
      default: PaymentMethod.CASH,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    monthReport_id: {
      type: Schema.Types.ObjectId,
      ref: 'MonthReport',
    },
  },
  {
    timestamps: true,
  }
);

IncomeRecordSchema.index({ date: 1 });
IncomeRecordSchema.index({ monthReport_id: 1 });
IncomeRecordSchema.index({ created_by: 1 });

export const IncomeRecord = mongoose.model<IIncomeRecord>(
  'IncomeRecord',
  IncomeRecordSchema
);


import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IInventoryUsage extends Document {
  product_id: Types.ObjectId;
  user_id: Types.ObjectId;
  monthReport_id?: Types.ObjectId;
  date: Date;
  before_volume: number;
  used_amount: number;
  wastage_amount: number;
  after_volume: number;
  purpose: string;
  note?: string;
  evidence_image_url: string;
  scale_image_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryUsageSchema = new Schema<IInventoryUsage>(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    monthReport_id: {
      type: Schema.Types.ObjectId,
      ref: 'MonthReport',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    before_volume: {
      type: Number,
      required: [true, 'Before volume is required'],
      min: [0, 'Before volume cannot be negative'],
    },
    used_amount: {
      type: Number,
      required: [true, 'Used amount is required'],
      min: [0, 'Used amount cannot be negative'],
    },
    wastage_amount: {
      type: Number,
      required: [true, 'Wastage amount is required'],
      default: 0,
      min: [0, 'Wastage amount cannot be negative'],
    },
    after_volume: {
      type: Number,
      required: [true, 'After volume is required'],
      min: [0, 'After volume cannot be negative'],
    },
    purpose: {
      type: String,
      required: [true, 'Purpose is required'],
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    evidence_image_url: {
      type: String,
      required: [true, 'Evidence image is required'],
    },
    scale_image_url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

InventoryUsageSchema.index({ product_id: 1 });
InventoryUsageSchema.index({ user_id: 1 });
InventoryUsageSchema.index({ monthReport_id: 1 });
InventoryUsageSchema.index({ date: 1 });

export const InventoryUsage = mongoose.model<IInventoryUsage>(
  'InventoryUsage',
  InventoryUsageSchema
);


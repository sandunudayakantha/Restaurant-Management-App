import mongoose, { Document, Schema, Types } from 'mongoose';

export enum UnitType {
  KG = 'kg',
  LITRE = 'litre',
  PIECE = 'piece',
  BOTTLE = 'bottle',
  PACKET = 'packet',
}

export interface IProduct extends Document {
  name: string;
  unit_type: UnitType;
  cost_per_unit: number;
  current_volume: number;
  reorder_level: number;
  suppliers: Types.ObjectId[];
  image_url?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    unit_type: {
      type: String,
      enum: Object.values(UnitType),
      required: [true, 'Unit type is required'],
    },
    cost_per_unit: {
      type: Number,
      required: [true, 'Cost per unit is required'],
      min: [0, 'Cost per unit must be positive'],
    },
    current_volume: {
      type: Number,
      required: [true, 'Current volume is required'],
      default: 0,
      min: [0, 'Current volume cannot be negative'],
    },
    reorder_level: {
      type: Number,
      required: [true, 'Reorder level is required'],
      default: 0,
      min: [0, 'Reorder level cannot be negative'],
    },
    suppliers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
      },
    ],
    image_url: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: 1 });
ProductSchema.index({ createdBy: 1 });
ProductSchema.index({ current_volume: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);


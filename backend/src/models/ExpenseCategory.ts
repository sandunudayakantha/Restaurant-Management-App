import mongoose, { Document, Schema, Types } from 'mongoose';

export enum ExpenseSubType {
  FIXED = 'fixed',
  UTILITY = 'utility',
  MAINTENANCE = 'maintenance',
  VARIABLE = 'variable',
  OTHER = 'other',
}

export interface IExpenseCategory extends Document {
  name: string;
  is_cost_of_sales: boolean;
  is_cost_of_operation: boolean;
  sub_type: ExpenseSubType;
  description?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseCategorySchema = new Schema<IExpenseCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    is_cost_of_sales: {
      type: Boolean,
      default: false,
    },
    is_cost_of_operation: {
      type: Boolean,
      default: true,
    },
    sub_type: {
      type: String,
      enum: Object.values(ExpenseSubType),
      required: [true, 'Sub type is required'],
      default: ExpenseSubType.OTHER,
    },
    description: {
      type: String,
      trim: true,
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

ExpenseCategorySchema.index({ name: 1 });
ExpenseCategorySchema.index({ createdBy: 1 });

export const ExpenseCategory = mongoose.model<IExpenseCategory>(
  'ExpenseCategory',
  ExpenseCategorySchema
);


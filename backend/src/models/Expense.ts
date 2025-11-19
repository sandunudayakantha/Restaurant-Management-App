import mongoose, { Document, Schema, Types } from 'mongoose';

export enum PaymentState {
  CASH = 'cash',
  FLOAT = 'float',
  CHEQUE = 'cheque',
  TO_BE_PAID = 'to_be_paid',
  UNPAID = 'unpaid',
}

export interface IExpense extends Document {
  date: Date;
  bill_no?: string;
  supplier_id?: Types.ObjectId;
  item_or_product: string;
  amount: number;
  expenseCategory_id: Types.ObjectId;
  payment_state: PaymentState;
  paid: boolean;
  note?: string;
  receipt_url?: string;
  created_by: Types.ObjectId;
  monthReport_id?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    bill_no: {
      type: String,
      trim: true,
    },
    supplier_id: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    item_or_product: {
      type: String,
      required: [true, 'Item or product is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    expenseCategory_id: {
      type: Schema.Types.ObjectId,
      ref: 'ExpenseCategory',
      required: [true, 'Expense category is required'],
    },
    payment_state: {
      type: String,
      enum: Object.values(PaymentState),
      required: [true, 'Payment state is required'],
      default: PaymentState.CASH,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      trim: true,
    },
    receipt_url: {
      type: String,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

ExpenseSchema.index({ date: 1 });
ExpenseSchema.index({ monthReport_id: 1 });
ExpenseSchema.index({ created_by: 1 });
ExpenseSchema.index({ supplier_id: 1 });
ExpenseSchema.index({ expenseCategory_id: 1 });

export const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);


import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  contact: {
    phone?: string;
    email?: string;
  };
  address?: string;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema = new Schema<ISupplier>(
  {
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true,
    },
    contact: {
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
    address: {
      type: String,
      trim: true,
    },
    notes: {
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

SupplierSchema.index({ name: 1 });
SupplierSchema.index({ createdBy: 1 });

export const Supplier = mongoose.model<ISupplier>('Supplier', SupplierSchema);


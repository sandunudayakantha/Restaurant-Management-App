import mongoose, { Document, Schema, Types } from 'mongoose';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

export interface IAuditLog extends Document {
  record_type: string; // e.g., 'User', 'Expense', 'Product'
  record_id: Types.ObjectId;
  user_id: Types.ObjectId;
  action: AuditAction;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  timestamp: Date;
  ip_address?: string;
  user_agent?: string;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    record_type: {
      type: String,
      required: [true, 'Record type is required'],
      trim: true,
    },
    record_id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Record ID is required'],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: [true, 'Action is required'],
    },
    before: {
      type: Schema.Types.Mixed,
    },
    after: {
      type: Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ip_address: {
      type: String,
    },
    user_agent: {
      type: String,
    },
  },
  {
    timestamps: false,
  }
);

AuditLogSchema.index({ record_type: 1, record_id: 1 });
AuditLogSchema.index({ user_id: 1 });
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ action: 1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);


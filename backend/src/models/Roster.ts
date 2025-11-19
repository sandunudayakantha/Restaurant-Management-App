import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRoster extends Document {
  date: Date;
  user_id: Types.ObjectId;
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  role: string;
  notes?: string;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RosterSchema = new Schema<IRoster>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    start_time: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:mm format'],
    },
    end_time: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:mm format'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    acknowledged: {
      type: Boolean,
      default: false,
    },
    acknowledgedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

RosterSchema.index({ date: 1 });
RosterSchema.index({ user_id: 1 });
RosterSchema.index({ date: 1, user_id: 1 });

export const Roster = mongoose.model<IRoster>('Roster', RosterSchema);


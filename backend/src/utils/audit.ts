import { Request } from 'express';
import { AuditLog, AuditAction } from '../models/AuditLog';
import { Types } from 'mongoose';

export interface AuditData {
  record_type: string;
  record_id: Types.ObjectId | string;
  user_id: Types.ObjectId | string;
  action: AuditAction;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  req?: Request;
}

export const createAuditLog = async (data: AuditData): Promise<void> => {
  try {
    const ip_address = data.req?.ip || data.req?.socket.remoteAddress;
    const user_agent = data.req?.get('user-agent');

    await AuditLog.create({
      record_type: data.record_type,
      record_id: typeof data.record_id === 'string' ? new Types.ObjectId(data.record_id) : data.record_id,
      user_id: typeof data.user_id === 'string' ? new Types.ObjectId(data.user_id) : data.user_id,
      action: data.action,
      before: data.before,
      after: data.after,
      timestamp: new Date(),
      ip_address,
      user_agent,
    });
  } catch (error) {
    // Don't throw error if audit logging fails - log it instead
    console.error('Failed to create audit log:', error);
  }
};


import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission {
  resource: string;
  actions: string[];
}

export interface IRole extends Document {
  name: string;
  permissions: IPermission[];
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
    },
    permissions: [
      {
        resource: {
          type: String,
          required: true,
        },
        actions: [
          {
            type: String,
            enum: ['create', 'read', 'update', 'delete'],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Role = mongoose.model<IRole>('Role', RoleSchema);


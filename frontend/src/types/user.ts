export enum UserRole {
  ADMIN = 'admin',
  CHEF = 'chef',
  CASHIER = 'cashier',
  MEMBER = 'member',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}


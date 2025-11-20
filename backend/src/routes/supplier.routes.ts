import { Router } from 'express';
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplier.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = Router();

// All authenticated users can view
router.get('/', authenticate, getSuppliers);
router.get('/:id', authenticate, getSupplier);

// Only admin can create, update, delete
router.post('/', authenticate, authorize(UserRole.ADMIN), createSupplier);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), updateSupplier);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteSupplier);

export default router;


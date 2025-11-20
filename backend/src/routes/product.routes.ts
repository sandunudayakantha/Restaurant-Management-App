import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = Router();

// All authenticated users can view
router.get('/', authenticate, getProducts);
router.get('/:id', authenticate, getProduct);

// Only admin can create, update, delete
router.post('/', authenticate, authorize(UserRole.ADMIN), createProduct);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), updateProduct);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteProduct);

export default router;


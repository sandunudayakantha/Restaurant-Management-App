import { Router } from 'express';
import {
  getRestaurantProfile,
  updateRestaurantProfile,
} from '../controllers/restaurant.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = Router();

// All authenticated users can view, only admin can update
router.get('/', authenticate, getRestaurantProfile);
router.put('/', authenticate, authorize(UserRole.ADMIN), updateRestaurantProfile);

export default router;


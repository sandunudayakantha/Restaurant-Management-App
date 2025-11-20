import { Router } from 'express';
import authRoutes from './auth.routes';
import restaurantRoutes from './restaurant.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/restaurant', restaurantRoutes);

export default router;


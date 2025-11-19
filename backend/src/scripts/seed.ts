import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User, UserRole } from '../models/User';
import { hashPassword } from '../utils/password';
import { RestaurantProfile } from '../models/RestaurantProfile';

dotenv.config();

const seed = async (): Promise<void> => {
  try {
    await connectDatabase();

    // Create default admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@restaurant.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
    } else {
      const passwordHash = await hashPassword(adminPassword);
      const admin = await User.create({
        name: 'Admin User',
        email: adminEmail,
        passwordHash,
        role: UserRole.ADMIN,
        isActive: true,
      });
      console.log('✅ Admin user created:', admin.email);
    }

    // Create default restaurant profile
    const existingProfile = await RestaurantProfile.findOne();
    if (!existingProfile) {
      await RestaurantProfile.create({
        name: 'My Restaurant',
        address: '123 Main Street, City, Country',
        default_currency: 'USD',
        contact: {
          email: adminEmail,
          phone: '+1234567890',
        },
      });
      console.log('✅ Restaurant profile created');
    } else {
      console.log('✅ Restaurant profile already exists');
    }

    console.log('\n📝 Default credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('\n⚠️  Please change the default password after first login!');

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

seed();


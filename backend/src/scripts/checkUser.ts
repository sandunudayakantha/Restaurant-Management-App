import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/User';

dotenv.config();

const checkUser = async (): Promise<void> => {
  try {
    await connectDatabase();

    const email = process.argv[2] || 'admin@restaurant.com';
    const user = await User.findOne({ email });

    if (user) {
      console.log('✅ User found:');
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
    } else {
      console.log('❌ User not found!');
      console.log(`   Email: ${email}`);
      console.log('\n💡 Run "npm run seed" to create the admin user.');
    }

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

checkUser();


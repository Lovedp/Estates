// api/seedAdmin.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../api/models/user.model.js'; // Note the .js extension

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = process.env.ADMIN_EMAIL || 'ifedolapoemmanue@gmail.com';
    
    // Check if user exists
    const existingUser = await User.findOne({ email: adminEmail });
    
    if (existingUser) {
      // Update existing user to admin
      existingUser.isAdmin = true;
      existingUser.roles = ['admin'];
      await existingUser.save();
      console.log('✅ Existing user promoted to admin');
    } else {
      // Create new admin user
      const password = process.env.ADMIN_PASSWORD || '12345';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await User.create({
        username: 'Raji Ifedolapo',
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true
      });
      console.log('✅ New admin user created');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
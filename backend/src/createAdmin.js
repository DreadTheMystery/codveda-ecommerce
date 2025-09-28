require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

async function createNewAdmin() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for admin creation.');

    // New admin user
    const newAdmin = {
      name: 'Super Admin',
      email: 'superadmin@codveda.com',
      password: 'admin12345',
      phone: '+234 900 000 0001',
      address: {
        street: '1 Admin Plaza',
        city: 'Lagos',
        state: 'Lagos State',
        zipCode: '100001',
        country: 'Nigeria'
      },
      role: 'admin',
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: newAdmin.email });
    if (existingAdmin) {
      console.log(`Admin with email ${newAdmin.email} already exists.`);
      console.log('Admin details:');
      console.log(`- Name: ${existingAdmin.name}`);
      console.log(`- Email: ${existingAdmin.email}`);
      console.log(`- Role: ${existingAdmin.role}`);
      console.log(`- Active: ${existingAdmin.isActive}`);
    } else {
      // Create the new admin
      const createdAdmin = await User.create(newAdmin);
      console.log('New admin user created successfully!');
      console.log(`- Name: ${createdAdmin.name}`);
      console.log(`- Email: ${createdAdmin.email}`);
      console.log(`- Role: ${createdAdmin.role}`);
      console.log(`- Active: ${createdAdmin.isActive}`);
    }

    // Also create a secondary admin for backup
    const backupAdmin = {
      name: 'Backup Admin',
      email: 'admin@example.com',
      password: 'password123',
      phone: '+234 900 000 0002',
      address: {
        street: '2 Admin Street',
        city: 'Abuja',
        state: 'FCT',
        zipCode: '900001',
        country: 'Nigeria'
      },
      role: 'admin',
      isActive: true
    };

    const existingBackup = await User.findOne({ email: backupAdmin.email });
    if (!existingBackup) {
      const createdBackup = await User.create(backupAdmin);
      console.log('\nBackup admin user created successfully!');
      console.log(`- Name: ${createdBackup.name}`);
      console.log(`- Email: ${createdBackup.email}`);
      console.log(`- Role: ${createdBackup.role}`);
    } else {
      console.log('\nBackup admin already exists.');
    }

    console.log('\n🎉 Admin creation completed!');
    console.log('\nYou can now login with either:');
    console.log('1. Email: superadmin@codveda.com | Password: admin12345');
    console.log('2. Email: admin@example.com | Password: password123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Admin creation failed:', err);
    process.exit(1);
  }
}

createNewAdmin();

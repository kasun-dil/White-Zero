const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminEmail = 'admin@whitezero.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists!');
    } else {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user seeded successfully!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

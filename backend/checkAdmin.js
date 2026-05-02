const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    const admin = await User.findOne({ email: 'admin@whitezero.com' });
    if (admin) {
      console.log('Admin user found:', admin.email, 'Role:', admin.role);
    } else {
      console.log('Admin user NOT found. Creating one...');
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'Admin User',
        email: 'admin@whitezero.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user created successfully.');
    }
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('DB Connection Error:', err);
  });

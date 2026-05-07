const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
  email: String,
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: 300 } } // Expires in 5 minutes
});

module.exports = mongoose.model('OTP', otpSchema);

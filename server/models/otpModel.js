import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Ye document 5 minute (300 seconds) baad automatically delete ho jayega
  },
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
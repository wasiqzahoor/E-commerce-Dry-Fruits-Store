import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    verificationOtp: { type: String },
    otpExpiry: { type: Date },
    role: { type: String, required: true, default: 'user' },
     passwordResetOtp: { type: String },
    passwordResetOtpExpiry: { type: Date },
  },
  { timestamps: true }
);

// Password ko save karne se pehle hash karein
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// Password compare karne ke liye method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
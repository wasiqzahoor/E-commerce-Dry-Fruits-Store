import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

const sendOtpEmail = async (email, otp) => {
  const transporter = createTransporter(); // Transporter yahan banayein
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your Verification Code',
    text: `Your OTP for Khan Dry Fruits is: ${otp}. It is valid for 10 minutes.`,
  };
  await transporter.sendMail(mailOptions);
};

const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  
    let user = await User.findOne({ email });
  
    // CASE 1: User exists
    if (user) {
      if (user.isVerified) {
        if (await user.matchPassword(password)) {
          return res.status(200).json({
            action: 'login_success',
            message: 'Login successful!',
            userData: { _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) },
          });
        } else {
          return res.status(401).json({ action: 'login_fail', message: 'Invalid password.' });
        }
      } 
      else {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.verificationOtp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.password = password;
        await user.save();
        await sendOtpEmail(email, otp);
        return res.status(200).json({ action: 'verify_otp', message: 'Account not verified. New OTP sent.' });
      }
    } 
    // CASE 2: New user
    else {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const newUser = new User({
        name: 'Guest',
        email,
        password,
        verificationOtp: otp,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      });
      await newUser.save();
      await sendOtpEmail(email, otp);
      return res.status(200).json({ action: 'register_and_verify', message: 'New account. Please provide your name and verify OTP.' });
    }
  } catch (error) {
    console.error("Authentication Error:", error);
    // Specifically check for email sending failure
    if (error.code === 'EAUTH') {
        return res.status(500).json({ message: "Failed to send verification email. Please check server configuration."});
    }
    res.status(500).json({ message: "An internal server error occurred."});
  }
};

const verifyAndComplete = async (req, res) => {
    // ... (Ye function waisa hi rahega, ismein email nahi bhej rahe)
    try {
        const { email, otp, name } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.verificationOtp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        user.isVerified = true;
        user.verificationOtp = undefined;
        user.otpExpiry = undefined;
        if (name) {
            user.name = name;
        }
        await user.save();

        res.status(200).json({
            message: 'Verification successful!',
            userData: { _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) },
        });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: "An internal server error occurred during verification."});
    }
};

const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password'); // password ke ilawa sab bhejo
  res.json(users);
};

const googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            // User pehle se hai, usay login karwa do
        } else {
            // Naya user hai, usay create karo
            user = await User.create({
                name,
                email,
                // Password nahi hai, isVerified ko true rakhein
                isVerified: true, 
            });
        }
        
        // JWT token bhej kar login complete karo
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(400).json({ message: 'Google authentication failed' });
    }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: 'If a user with that email exists, a reset code has been sent.' });
    }

    // 6-digit OTP generate karein
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordResetOtp = otp;
    // OTP ko 10 minute ke liye valid rakhein
    user.passwordResetOtpExpiry = Date.now() + 10 * 60 * 1000; 
    await user.save();

    // User ko OTP email karein
    await sendOtpEmail(email, otp); // Hum purana helper function istemal kar rahe hain

    res.status(200).json({ message: 'A reset code has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      passwordResetOtp: otp,
      passwordResetOtpExpiry: { $gt: Date.now() }, // Check karein ke OTP expire na hua ho
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
     res.status(500).json({ message: "Server error." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // Security: OTP ko dobara verify karein
    const user = await User.findOne({
      email,
      passwordResetOtp: otp,
      passwordResetOtpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
    }

    // Naya password set karein
    user.password = password;
    // OTP fields ko saaf kar dein
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpiry = undefined;
    
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully. Please log in.' });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
export { authenticateUser, verifyAndComplete ,getUsers,googleLogin,resetPassword ,forgotPassword,verifyResetOtp};
import express from 'express';
const router = express.Router();
import { protect, admin } from '../middlewares/authMiddleware.js';
import { authenticateUser, verifyAndComplete,getUsers ,googleLogin,resetPassword ,forgotPassword,verifyResetOtp} from '../controllers/userController.js';

router.post('/authenticate', authenticateUser);
router.post('/verify', verifyAndComplete);
router.route('/').get(protect, admin, getUsers);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);
export default router;
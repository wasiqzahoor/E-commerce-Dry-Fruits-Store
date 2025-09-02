import express from 'express';
const router = express.Router();
import { getAdminStats, getPromotions, createPromotion, deletePromotion, togglePromotionStatus } from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

router.route('/stats').get(protect, admin, getAdminStats);
router.route('/promotions').get(protect, admin, getPromotions).post(protect, admin, createPromotion);
router.route('/promotions/:id').delete(protect, admin, deletePromotion);
router.route('/promotions/:id/toggle').put(protect, admin, togglePromotionStatus);

export default router;
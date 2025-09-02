import express from 'express';
const router = express.Router();
import { createOrder , getMyOrders, cancelOrder,getAllOrders,updateOrderStatus} from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

// `protect` middleware ko route se pehle laga dein
router.route('/').get(protect, admin, getAllOrders); // Admin saare orders dekhega
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, getMyOrders); // <-- Naya route
router.route('/:id/cancel').put(protect, cancelOrder);
export default router;
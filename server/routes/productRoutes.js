import express from 'express';
const router = express.Router();
import { protect, admin } from '../middlewares/authMiddleware.js';
import { getProducts,createProduct,getProductById,updateProduct,deleteProduct,createProductReview } from '../controllers/productController.js';

// Jab is route par GET request aaye, to getProducts controller chalao
router.route('/').post(protect, admin, createProduct);
router.route('/:id').put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/:id/reviews').post(protect, createProductReview); 
export default router;
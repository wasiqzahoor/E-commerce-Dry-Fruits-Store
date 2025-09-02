// backend/routes/homeRoutes.js
import express from 'express';
const router = express.Router();
import { getHomePageData } from '../controllers/homeController.js';
router.route('/').get(getHomePageData);
export default router;
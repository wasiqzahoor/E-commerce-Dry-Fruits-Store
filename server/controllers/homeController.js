// backend/controllers/homeController.js
import Product from '../models/productModel.js';
import Promotion from '../models/Promotion.js';

const getHomePageData = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        const promotions = await Promotion.find({ isActive: true }).limit(2); // Sirf 2 active promotions
        
        // Products se saari unique categories nikalein
        const categories = await Product.distinct('category');

        res.json({ products, promotions, categories });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export { getHomePageData };
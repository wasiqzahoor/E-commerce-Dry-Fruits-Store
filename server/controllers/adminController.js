import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Promotion from '../models/Promotion.js';
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Sirf "Delivered" orders ki sales calculate karein 
        const salesData = await Order.aggregate([
            { $match: { orderStatus: 'Delivered' } },
            { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
        ]);
        const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

        // Daily sales (pichlay 7 din ki)
        const dailySales = await Order.aggregate([
            { $match: { orderStatus: 'Delivered' } },
            { $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                dailyTotal: { $sum: '$totalPrice' }
            }},
            { $sort: { _id: 1 } }, // Date ke hisab se sort karein
            { $limit: 7 }
        ]);

        // Sab se naye 5 orders
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            totalUsers,
            totalOrders,
            totalSales,
            dailySales,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
const getPromotions = async (req, res) => {
const promotions = await Promotion.find({});
res.json(promotions);
};
const createPromotion = async (req, res) => {
const { title, videoUrl } = req.body;
const promotion = new Promotion({ title, videoUrl });
const createdPromotion = await promotion.save();
res.status(201).json(createdPromotion);
};
const deletePromotion = async (req, res) => {
const promotion = await Promotion.findById(req.params.id);
if (promotion) {
await promotion.deleteOne();
res.json({ message: 'Promotion removed' });
} else {
res.status(404).json({ message: 'Promotion not found' });
}
};
const togglePromotionStatus = async (req, res) => {
const promotion = await Promotion.findById(req.params.id);
if (promotion) {
promotion.isActive = !promotion.isActive;
await promotion.save();
res.json(promotion);
} else {
res.status(404).json({ message: 'Promotion not found' });
}
};
export { getAdminStats,getPromotions,createPromotion ,deletePromotion,togglePromotionStatus};
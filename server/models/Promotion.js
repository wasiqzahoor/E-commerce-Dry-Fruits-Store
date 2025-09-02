import mongoose from 'mongoose';

const promotionSchema = mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true }, // e.g., YouTube embed URL
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Promotion = mongoose.model('Promotion', promotionSchema);
export default Promotion;
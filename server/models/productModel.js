import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Product ka naam lazmi hai
    },
    description: {
      type: String,
      required: true, // Thori si tafseel bhi lazmi hai
    },
    basePrice: { type: Number, required: true },

    
discountPercentage: { type: Number, default: 0 },
    imageUrl: {
      type: String,
      required: true, // Tasveer ka link bhi zaroori hai
    },
    countInStock: { type: Number, required: true, default: 0 }, // <-- Stock ke liye
    sku: { type: String, default: 'N/A' },
    category: { type: String, required: true, default: 'Uncategorized' },
    reviews: [reviewSchema], // Array of reviews
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Virtuals ko enable karein
    toObject: { virtuals: true } // Ye automatically 'createdAt' aur 'updatedAt' fields add kar dega
  }
);
productSchema.virtual('price').get(function() {
  if (this.discountPercentage > 0) {
    return this.basePrice - (this.basePrice * this.discountPercentage / 100);
  }
  return this.basePrice;
});
const Product = mongoose.model('Product', productSchema);

export default Product;
import Product from '../models/productModel.js';

const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword ? {
      $or: [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { category: { $regex: req.query.keyword, $options: 'i' } },
        { sku: { $regex: req.query.keyword, $options: 'i' } }
      ]
    } : {};

    const products = await Product.find({ ...keyword });
    res.status(200).json(products);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};
const createProduct = async (req, res) => {
  try {
    // Ab form se aane wali saari fields ko receive karein
    const { 
      name, 
      description, 
      basePrice, 
      discountPercentage,
      imageUrl,
      category,
      countInStock,
      sku
    } = req.body;

    const product = new Product({
      name,
      description,
      basePrice,
      discountPercentage,
      imageUrl,
      category,
      countInStock,
      sku,
      // user: req.user._id // Agar aap save karna chahte hain ke kis admin ne product banaya
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      basePrice, 
      discountPercentage,
      imageUrl,
      category,
      countInStock,
      sku
    } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (product) {
      // Ab saari fields ko update karein
      product.name = name || product.name;
      product.description = description || product.description;
      product.basePrice = basePrice || product.basePrice;
      product.discountPercentage = discountPercentage !== undefined ? discountPercentage : product.discountPercentage;
      product.imageUrl = imageUrl || product.imageUrl;
      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.sku = sku || product.sku;

      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const deleteProduct = async (req, res) => { 
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne(); // Mongoose v6+ mein .remove() ki jagah .deleteOne()
      res.status(200).json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};
export { getProducts,createProduct,getProductById,updateProduct,deleteProduct ,createProductReview};
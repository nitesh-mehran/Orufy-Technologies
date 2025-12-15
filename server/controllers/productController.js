const Product = require("../models/Product");

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const { productName, productType, stock, mrp, sellingPrice, brandName, exchangeEligible } = req.body;
    const images = req.files ? req.files.map((file) => file.filename) : [];

    const newProduct = new Product({
      productName,
      productType,
      stock,
      mrp,
      sellingPrice,
      brandName,
      exchangeEligible,
      images,
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Single Product
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, productType, stock, mrp, sellingPrice, brandName, exchangeEligible } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    product.productName = productName || product.productName;
    product.productType = productType || product.productType;
    product.stock = stock || product.stock;
    product.mrp = mrp || product.mrp;
    product.sellingPrice = sellingPrice || product.sellingPrice;
    product.brandName = brandName || product.brandName;
    product.exchangeEligible = exchangeEligible || product.exchangeEligible;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.filename);
      product.images.push(...newImages);
      if (product.images.length > 5) product.images = product.images.slice(0, 5);
    }

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Publish / Unpublish Product
exports.togglePublish = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    product.isPublished = !product.isPublished;
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

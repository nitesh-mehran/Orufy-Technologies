const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    productType: { type: String, required: true },
    stock: { type: Number, default: 0 },
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    brandName: { type: String },
    exchangeEligible: { type: String, enum: ["Yes", "No"], default: "Yes" },
    images: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

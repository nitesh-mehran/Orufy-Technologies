import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    stock: "",
    brandName: "",
    mrp: "",
    sellingPrice: "",
    exchangeEligible: "Yes",
  });

  const [images, setImages] = useState([]); // array of selected files
  const [errors, setErrors] = useState({}); // inline field errors

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Image selection
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("You can upload maximum 5 images.");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  // Remove selected image
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate required fields
  const validate = () => {
    const newErrors = {};
    if (!formData.productName.trim()) newErrors.productName = "Please enter product name";
    if (!formData.productType.trim()) newErrors.productType = "Please select product type";
    if (!formData.stock) newErrors.stock = "Please enter stock quantity";
    if (!formData.mrp) newErrors.mrp = "Please enter MRP";
    if (!formData.sellingPrice) newErrors.sellingPrice = "Please enter selling price";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    images.forEach((img) => data.append("images", img));

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Product added successfully");
        navigate("/dashboard");
      } else {
        toast.error("Failed to add product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add Product</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4 text-sm">
          {/* Product Name */}
          <div>
            <label className="font-medium text-gray-700">Product Name *</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
            {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
          </div>

          {/* Product Type */}
          <div>
            <label className="font-medium text-gray-700">Product Type *</label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            >
              <option value="">Select product type</option>
              <option>Foods</option>
              <option>Electronics</option>
              <option>Clothes</option>
              <option>Beauty Products</option>
              <option>Others</option>
            </select>
            {errors.productType && <p className="text-red-500 text-xs mt-1">{errors.productType}</p>}
          </div>

          {/* Stock */}
          <div>
            <label className="font-medium text-gray-700">Quantity Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md"
              min="0"
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
          </div>

          {/* MRP */}
          <div>
            <label className="font-medium text-gray-700">MRP (₹) *</label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md"
              min="0"
            />
            {errors.mrp && <p className="text-red-500 text-xs mt-1">{errors.mrp}</p>}
          </div>

          {/* Selling Price */}
          <div>
            <label className="font-medium text-gray-700">Selling Price (₹) *</label>
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md"
              min="0"
            />
            {errors.sellingPrice && <p className="text-red-500 text-xs mt-1">{errors.sellingPrice}</p>}
          </div>

          {/* Brand Name */}
          <div>
            <label className="font-medium text-gray-700">Brand Name</label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>

          {/* Images */}
          <div>
            <label className="font-medium text-gray-700">Product Images (Max 5)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 border rounded-md overflow-hidden">
                  <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="w-20 h-20 border-dashed border-2 border-gray-400 flex items-center justify-center rounded-md cursor-pointer hover:border-indigo-500 text-gray-400 text-sm">
                  Add
                  <input type="file" accept="image/*" multiple onChange={handleAddImages} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Exchange Eligibility */}
          <div>
            <label className="font-medium text-gray-700">Exchange or return eligibility</label>
            <select
              name="exchangeEligible"
              value={formData.exchangeEligible}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <button type="button" onClick={() => navigate(-1)} className="text-gray-600 hover:text-red-600 font-medium">
            Close
          </button>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

const EditProduct = () => {
  const { id } = useParams();
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

  const [images, setImages] = useState([]); // new uploaded files
  const [existingImages, setExistingImages] = useState([]); // existing images from backend
  const [loading, setLoading] = useState(false);

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (data.success) {
        const product = data.products.find((p) => p._id === id);
        if (!product) {
          toast.error("Product not found");
          navigate("/dashboard");
          return;
        }
        setFormData({
          productName: product.productName,
          productType: product.productType,
          stock: product.stock,
          brandName: product.brandName,
          mrp: product.mrp,
          sellingPrice: product.sellingPrice,
          exchangeEligible: product.exchangeEligible,
        });
        setExistingImages(product.images);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch product");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file change
  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    images.forEach((file) => data.append("images", file));

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Product updated successfully");
        navigate("/dashboard");
      } else {
        toast.error(result.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-2xl mx-auto space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Product Name *</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Product Type *</label>
          <select
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none"
          >
            <option value="">Select product type</option>
            <option>Foods</option>
            <option>Electronics</option>
            <option>Clothes</option>
            <option>Beauty Products</option>
            <option>Others</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stock *</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
            className="w-full border px-3 py-2 rounded focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">MRP (₹) *</label>
          <input
            type="number"
            name="mrp"
            value={formData.mrp}
            onChange={handleChange}
            min="0"
            required
            className="w-full border px-3 py-2 rounded focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Selling Price (₹) *</label>
          <input
            type="number"
            name="sellingPrice"
            value={formData.sellingPrice}
            onChange={handleChange}
            min="0"
            required
            className="w-full border px-3 py-2 rounded focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Brand Name</label>
          <input
            type="text"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Exchange Eligible</label>
          <select
            name="exchangeEligible"
            value={formData.exchangeEligible}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Images (Max 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {existingImages.length > 0 && (
          <div className="flex gap-3 flex-wrap mt-2">
            {existingImages.map((img, idx) => (
              <img
                key={idx}
                src={`${API_URL}/uploads/${img}`}
                alt="existing"
                className="w-20 h-20 object-contain border p-1 rounded"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;

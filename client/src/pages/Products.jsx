import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  // Toggle Publish
  const togglePublish = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/products/publish/${id}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to update publish status");
    }
  };

  return (
    <div className="pt-20 px-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
        <button
          onClick={() => navigate("/addproduct")}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          + Add Products
        </button>
      </div>

      {/* No Products */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <h2 className="text-xl font-semibold text-gray-800">No Products Found</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md">
            Products you add will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white border rounded-lg p-3 shadow hover:shadow-lg transition flex flex-col"
            >
              {/* Image */}
              <div className="h-32 flex items-center justify-center mb-3 bg-gray-100 rounded-md overflow-hidden">
                {p.images && p.images.length > 0 ? (
                  <img
                    src={`${API_URL}/uploads/${p.images[0]}`}
                    alt={p.productName}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400">No Image</div>
                )}
              </div>

              {/* Product Name */}
              <h2 className="font-bold text-md text-gray-800 mb-2">{p.productName}</h2>

              {/* Product Info */}
              <div className="flex-1 space-y-1 text-sm text-gray-500">
                {[
                  ["Type", p.productType],
                  ["Stock", p.stock],
                  ["MRP", `₹ ${p.mrp || "-"}`],
                  ["Selling Price", `₹ ${p.sellingPrice || "-"}`],
                  ["Brand", p.brandName || "-"],
                  ["Exchange", p.exchangeEligible],
                  ["Images", p.images.length],
                ].map(([label, value], idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="font-medium">{label}:</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-3 items-center">
                <button
                  onClick={() => togglePublish(p._id)}
                  className={`px-3 py-1 rounded text-white text-xs ${
                    p.isPublished ? "bg-green-600" : "bg-blue-600"
                  }`}
                >
                  {p.isPublished ? "Unpublish" : "Publish"}
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => navigate(`/editproduct/${p._id}`)}
                    className="px-2 py-1 rounded border text-xs flex items-center justify-center"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-2 py-1 rounded border text-xs text-red-500 flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaBoxOpen,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL; 

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("published");
  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error("Fetch Products Error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const togglePublish = async (id) => {
    try {
      await fetch(`${API_URL}/api/products/publish/${id}`, {
        method: "PATCH",
      });
      fetchProducts();
    } catch (err) {
      console.error("Publish Toggle Error:", err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const tabMatch = activeTab === "published" ? p.isPublished : !p.isPublished;
    const searchMatch =
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      p.brandName?.toLowerCase().includes(search.toLowerCase()) ||
      p.productType?.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <div className="flex min-h-screen pt-16">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-16 z-40 h-[calc(100vh-64px)] w-64 bg-[#1f2233] text-white transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="px-4 py-4 border-b border-gray-700">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[#2a2d40] text-sm text-white outline-none"
            />
          </div>
        </div>

        <nav className="px-3 py-4 space-y-2">
          <MenuItem icon={<FaHome />} text="Home" onClick={() => navigate("/dashboard")} />
          <MenuItem icon={<FaBoxOpen />} text="Products" onClick={() => navigate("/products")} />
          <div
            onClick={() => navigate("/addproduct")}
            className="ml-7 flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#2a2d40] cursor-pointer text-gray-300"
          >
            <FaPlus className="text-xs" />
            <span>Add Product</span>
          </div>
        </nav>
      </aside>

      <div className="flex-1 bg-white rounded-tl-xl overflow-hidden">
        <div className="flex items-center px-4 border-b h-12">
          <FaBars
            className="lg:hidden cursor-pointer text-gray-700 text-lg"
            onClick={() => setSidebarOpen(true)}
          />
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex gap-6 border-b mb-6">
            {["published", "unpublished"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="h-[50vh] flex flex-col items-center justify-center">
              <p className="text-gray-500 mb-4">No products found</p>
              <button
                onClick={() => navigate("/addproduct")}
                className="px-6 py-2 bg-indigo-600 text-white rounded"
              >
                + Add Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div key={p._id} className="border rounded-lg p-4 shadow">
                  <div className="h-40 bg-gray-100 rounded mb-4 flex items-center justify-center">
                    {p.images?.length ? (
                       <img
                    src={`${API_URL}/uploads/${p.images[0]}`}
                    alt={p.productName}
                    className="max-h-full max-w-full object-contain"
                  />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>

                  <h2 className="font-bold mb-2">{p.productName}</h2>

                  <div className="space-y-1 text-sm">
                    {[
                      ["Type", p.productType],
                      ["Stock", p.stock],
                      ["MRP", `₹ ${p.mrp || "-"}`],
                      ["Selling Price", `₹ ${p.sellingPrice || "-"}`],
                      ["Brand", p.brandName || "-"],
                      ["Exchange", p.exchangeEligible],
                      ["Images", p.images.length],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-gray-500">{label}</span>
                        <span className="text-gray-800">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => togglePublish(p._id)}
                      className={`flex-1 text-xs py-1 rounded text-white ${
                        p.isPublished ? "bg-green-600" : "bg-blue-600"
                      }`}
                    >
                      {p.isPublished ? "Unpublish" : "Publish"}
                    </button>

                    <IconBtn onClick={() => navigate(`/editproduct/${p._id}`)}>
                      <FaEdit />
                    </IconBtn>

                    <IconBtn onClick={() => handleDelete(p._id)} danger>
                      <FaTrash />
                    </IconBtn>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, text, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#2a2d40] cursor-pointer"
  >
    {icon}
    <span>{text}</span>
  </div>
);

const IconBtn = ({ children, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`p-2 border rounded ${danger ? "text-red-500" : ""}`}
  >
    {children}
  </button>
);

export default Dashboard;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginOtp from "./pages/LoginOtp";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Products from "./pages/Products";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<LoginOtp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/editproduct/:id" element={<EditProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

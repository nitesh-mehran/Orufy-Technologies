import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 h-16 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center h-full px-6 md:px-10">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-30 md:h-12 object-contain"
          />
        </Link>

        {/* RIGHT SIDE (ALWAYS ROUNDED ICON) */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDropdown(!dropdown)}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer font-semibold"
            >
              {user.profile ? (
                <img
                  src={user.profile}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.email.charAt(0).toUpperCase()
              )}
            </div>

            {/* Dropdown */}
            {dropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden">
                <div className="px-4 py-2 text-sm text-gray-800 border-b">
                  {user.name || user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

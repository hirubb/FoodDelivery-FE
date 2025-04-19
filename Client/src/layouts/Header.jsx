import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars, FaUserCircle } from "react-icons/fa";
import logo from "/src/assets/logo-color.png";
import Sidebar from "./Sidebar"; // Import the Sidebar component

function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav className="bg-[#03081F] shadow-md w-full top-0 left-0 z-40">
        <div className="container mx-auto my-10 px-4 md:px-10 flex items-center justify-between h-28">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="FoodDelivery Logo" className="h-40 mr-2" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 text-xl font-bold">
            <Link to="/" className="text-white px-4 py-2 rounded hover:bg-[#FC8A06]">Home</Link>
            <Link to="#" className="text-white px-4 py-2 rounded hover:bg-[#FC8A06]">Browse Menu</Link>
            <Link to="/restaurants" className="text-white px-4 py-2 rounded hover:bg-[#FC8A06]">Restaurants</Link>
            <Link to="#" className="text-white px-4 py-2 rounded hover:bg-[#FC8A06]">Track Order</Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {!loggedIn ? (
              <Link
                to="/login"
                className="hidden md:block text-[#FC8A06] border border-[#FC8A06] px-4 py-1 rounded hover:bg-[#FC8A06] hover:text-white"
              >
                Login / Signup
              </Link>
            ) : (
              <Link to="owner/profile" className="hidden md:block text-[#FC8A06] hover:text-[#E67E22]">
                <FaUserCircle size={28} />
              </Link>
            )}

            <Link to="/cart" className="relative">
              <FaShoppingCart size={24} className="text-white" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </Link>

            {/* Menu toggler - visible on all screen sizes */}
            <button onClick={toggleSidebar} className="text-white focus:outline-none">
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} loggedIn={loggedIn} />
    </>
  );
}

export default Header;

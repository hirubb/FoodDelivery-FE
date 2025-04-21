import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import logo from "/src/assets/logo-color.png";
import Sidebar from "./Sidebar";
import { UserContext } from "../context/UserContext";

function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const profileLink = role === "Admin" ? "/admin-dashboard" : "/owner/profile";

  // Access user data from context
  const { user } = useContext(UserContext);
  const { username, loggedIn, profile_image } = user;

  const userImage = profile_image || "/default-profile.png";

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav className="bg-[#03081F] shadow-md w-full top-0 left-0 z-40">
        <div className="container mx-auto my-10 px-4 md:px-10 flex items-center justify-between h-28">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="FoodDelivery Logo" className="h-40 mr-2" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 text-xl font-bold">
            <Link
              to="/"
              className="text-white px-4 py-2 rounded hover:bg-[#FC8A06]"
            >
              Home
            </Link>
            <Link
              to="#"
              className="text-white px-4 py-2 rounded hover:bg-[#FC8A06]"
            >
              Browse Menu
            </Link>
            <Link
              to="/restaurants"
              className="text-white px-4 py-2 rounded hover:bg-[#FC8A06]"
            >
              Restaurants
            </Link>
            <Link
              to="#"
              className="text-white px-4 py-2 rounded hover:bg-[#FC8A06]"
            >
              Track Order
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* If logged in: Show profile, else show login */}
            {token && loggedIn ? (
              <Link
                to={profileLink}
                className="flex items-center text-[#FC8A06] hover:text-[#E67E22]"
              >
                <img
                  src={userImage}
                  alt="Profile"
                  className="h-10 w-10 rounded-full mr-2"
                />
                <span className="text-sm font-semibold">{username}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center bg-[#FC8A06] hover:bg-[#e07b00] text-white px-4 py-2 rounded-md text-sm font-semibold"
              >
                Login
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <FaShoppingCart size={24} className="text-white" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </Link>

            {/* Menu Icon */}
            <button
              onClick={toggleSidebar}
              className="text-white focus:outline-none"
            >
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        loggedIn={loggedIn}
      />
    </>
  );
}

export default Header;

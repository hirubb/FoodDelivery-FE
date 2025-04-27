import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import logo from "/src/assets/logo-color.png";
import Sidebar from "./Sidebar";
import { UserContext } from "../context/UserContext";
import { FaUserCircle } from "react-icons/fa";
import { CartContext } from "../context/CartContext";

function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  let profileLink = "";

  if(role === "Admin") {
    profileLink = "/admin-dashboard"
  }
  if(role === "Restaurant Owner"){
    profileLink = "/owner/profile"
  }
  if(role === "Customer"){
    profileLink = "/customer-dashboard"
  }


  // Access user data from context
  const { user } = useContext(UserContext);
  const { username, loggedIn, profile_image } = user;

  const userImage = profile_image;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

const { getCartCount, setIsCartOpen } = useContext(CartContext);
const cartItemCount = getCartCount();


  return (
    <>
      <nav className="relative shadow-md w-full top-0 left-0 z-40">
        <div className="container mx-auto px-4 md:px-10 flex items-center justify-between h-28">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="FoodDelivery Logo" className="h-20 mr-2" />
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
              to="/restaurants"
              className="text-white px-4 py-2 rounded hover:bg-[#FC8A06]"
            >
              Restaurants
            </Link>
            <Link
              to="/orders"
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
              className="flex flex-col items-center text-[#FC8A06] hover:text-[#E67E22]"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 mb-1">
                {userImage ? (
                  <img
                    src={userImage}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-orange-500 w-6 h-6" />
                )}
              </div>
           
              <span className="text-md font-semibold text-center ">{username}</span>
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
            <button onClick={() => setIsCartOpen(true)} className="relative">
                <FaShoppingCart size={24} className="text-white" />
                {cartItemCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {cartItemCount}
    </span>
  )}
</button>

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
        username={username}
        profileImage={profile_image}
      />
    </>
  );
}

export default Header;

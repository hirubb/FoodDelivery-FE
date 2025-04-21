import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

function Header() {

  return (
    <nav className="bg-[#03081F] shadow-md w-full fixed top-0 left-0 z-50">
      <div className="container mx-auto my-10 px-4 md:px-10 flex items-center justify-between h-28">

        <Link to="/" className="flex items-center">
          <img src="/src/assets/logo-color.png" alt="FoodDelivery Logo" className="h-40 mr-2" />
        </Link>


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
            to="#"
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
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="#"
            className="text-[#FC8A06] border border-[#FC8A06] px-4 py-1 rounded hover:bg-[#FC8A06] hover:text-white">
            Login / Signup
          </Link>
          <Link to="#" className="relative">
            <FaShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              3
            </span>
          </Link>
          {/* Menu Icon */}
          <Link to="#" className="text-white">
            <FaBars size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
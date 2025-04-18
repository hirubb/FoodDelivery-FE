import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaHome, FaUtensils, FaStore, FaMapMarkerAlt, FaUserCircle } from 'react-icons/fa';

const Sidebar = ({ sidebarOpen, toggleSidebar, loggedIn }) => {
  return (
    <>
      {/* Sidebar overlay - appears when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={toggleSidebar} className="text-gray-700">
              <FaTimes size={24} />
            </button>
          </div>

          {loggedIn ? (
            <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-100 rounded">
              <FaUserCircle size={32} className="text-gray-700" />
              <div>
                <p className="font-semibold">User Name</p>
                <p className="text-sm text-gray-600">user@example.com</p>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="block w-full text-center bg-[#FC8A06] text-white py-2 rounded mb-6"
            >
              Login / Signup
            </Link>
          )}

          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3 text-gray-700 hover:text-[#FC8A06] p-2 rounded hover:bg-gray-100">
              <FaHome />
              <span>Home</span>
            </Link>
            <Link to="#" className="flex items-center space-x-3 text-gray-700 hover:text-[#FC8A06] p-2 rounded hover:bg-gray-100">
              <FaUtensils />
              <span>Browse Menu</span>
            </Link>
            <Link to="/restaurants" className="flex items-center space-x-3 text-gray-700 hover:text-[#FC8A06] p-2 rounded hover:bg-gray-100">
              <FaStore />
              <span>Restaurants</span>
            </Link>
            <Link to="#" className="flex items-center space-x-3 text-gray-700 hover:text-[#FC8A06] p-2 rounded hover:bg-gray-100">
              <FaMapMarkerAlt />
              <span>Track Order</span>
            </Link>
            <hr />
            {loggedIn && (
              <Link to="/logout" className="flex items-center space-x-3 text-red-600 p-2 rounded hover:bg-red-50">
                <span>Sign Out</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

import React, { useState } from "react";
import {
  FaUsers,
  FaStore,
  FaMoneyCheckAlt,
  FaTags,
  FaSignOutAlt,
  FaBell,
  FaUser,
} from "react-icons/fa";

import ManageUsers from "../../components/Admin/ManageUsers";
import ManageRestaurants from "../../components/Admin/ManageRestaurants";
import Financials from "../../components/Admin/Financials";
import Offers from "../../components/Admin/Offers";
import AdminProfile from "../../components/Admin/AdminProfile";
import RestaurantOwners from "../../components/Admin/RestaurantOwners";
import DeliveryPerson from "../../components/Admin/DeliveryPerson";



function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-[#0C1A39] text-white flex flex-col">
        <div className="p-4 flex items-center justify-center md:justify-start">
          {/* <img src={Logo} alt="OrderLk" className="h-12 w-12" /> */}
          <span className="hidden md:block ml-3 font-bold text-xl">
            AMBULA.LK
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="mt-8 px-2">
          <SidebarItem
              icon={<FaUser />}
              title="My Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <SidebarItem
              icon={<FaUsers />}
              title="Customers"
              active={activeTab === "users"}
              onClick={() => setActiveTab("users")}
            />
            <SidebarItem
              icon={<FaStore />}
              title="Restaurant Owners"
              active={activeTab === "restaurant owners"}
              onClick={() => setActiveTab("restaurant owners")}
            />
            <SidebarItem
              icon={<FaStore />}
              title="Delivery persons"
              active={activeTab === "delivery person"}
              onClick={() => setActiveTab("delivery person")}
            />
            <SidebarItem
              icon={<FaStore />}
              title="Manage Restaurants"
              active={activeTab === "restaurants"}
              onClick={() => setActiveTab("restaurants")}
            />
            <SidebarItem
              icon={<FaMoneyCheckAlt />}
              title="Financials"
              active={activeTab === "financials"}
              onClick={() => setActiveTab("financials")}
            />
            <SidebarItem
              icon={<FaTags />}
              title="Offers"
              active={activeTab === "offers"}
              onClick={() => setActiveTab("offers")}
            />
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/admin/login";
            }}
            className="flex items-center justify-center md:justify-start w-full py-2 text-sm text-white hover:bg-gray-700 rounded transition-colors"
          >
            <FaSignOutAlt className="h-5 w-5" />
            <span className="hidden md:block ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-semibold text-gray-800">
                {activeTab === "profile" && "My Profile"}
              {activeTab === "users" && "Customers"}
              {activeTab === "restaurant owners" && "Restaurant Owners"}
              {activeTab === "delivery person" && "Delivery Persons"}
              {activeTab === "restaurants" && "Manage Restaurants"}
              {activeTab === "financials" && "Financial Overview"}
              {activeTab === "offers" && "Manage Offers"}
            </h1>

            <div className="flex items-center space-x-4">
              <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                <FaBell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500"></span>
              </button>
              <div className="flex items-center">
                <img
                  className="h-9 w-9 rounded-full object-cover border-2 border-orange-500"
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Admin"
                />
                <div className="hidden md:block ml-3">
                  <p className="text-sm font-medium text-gray-800">Admin</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {activeTab === "profile" && <AdminProfile />}
          {activeTab === "users" && <ManageUsers />}
          {activeTab === "restaurant owners" && <RestaurantOwners />}
          {activeTab === "delivery person" && <DeliveryPerson />}
          {activeTab === "restaurants" && <ManageRestaurants />}
          {activeTab === "financials" && <Financials />}
          {activeTab === "offers" && <Offers />}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, title, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center md:justify-start w-full py-3 px-2 mb-2 rounded-lg transition-colors ${
        active ? "bg-[#FF8A00] text-white" : "text-gray-300 hover:bg-gray-700"
      }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="hidden md:block ml-3">{title}</span>
    </button>
  );
}

export default AdminDashboard;

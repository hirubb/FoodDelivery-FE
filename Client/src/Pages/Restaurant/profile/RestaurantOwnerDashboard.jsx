import React, { useState } from "react";
import {
  FaUser,
  FaUtensils,
  FaClipboardList,
  FaChartPie,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";

import OwnerProfileData from "../../../components/ResturantManagement/profile/OwnerProfile";
import RestaurantDetails from "../../../components/ResturantManagement/profile/RestaurantDetails";
import RestaurantOrders from "../../../components/ResturantManagement/profile/RestaurantOrders";
import EarningsOverview from "../../../components/ResturantManagement/profile/EarningsOverview";

import Logo from "../../../assets/logo-color.png";

function RestaurantOwnerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-[#0C1A39] text-white flex flex-col">
        <div className="p-4 flex items-center justify-center md:justify-start">
          <img src={Logo} alt="OrderLk" className="h-12 w-12" />
          <span className="hidden md:block ml-3 font-bold text-xl">
            AMBULA.LK
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="mt-8 px-2">
            <SidebarItem
              icon={<FaChartPie />}
              title="Dashboard"
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            />
            <SidebarItem
              icon={<FaUser />}
              title="My Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <SidebarItem
              icon={<FaUtensils />}
              title="Restaurant Details"
              active={activeTab === "restaurant"}
              onClick={() => setActiveTab("restaurant")}
            />
            <SidebarItem
              icon={<FaClipboardList />}
              title="Orders"
              active={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            />

            <SidebarItem
              icon={<FaChartPie />}
              title="Earnings"
              active={activeTab === "earnings"}
              onClick={() => setActiveTab("earnings")}
            />
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              // Add logout logic here
              localStorage.removeItem("token");
              window.location.href = "/owner/login";
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
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-semibold text-gray-800">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "profile" && "My Profile"}
              {activeTab === "restaurant" && "Restaurant Details"}
              {activeTab === "orders" && "Orders Management"}
            </h1>

            <div className="flex items-center space-x-4">
              <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                <FaBell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500"></span>
              </button>
              <div className="flex items-center">
                <img
                  className="h-9 w-9 rounded-full object-cover border-2 border-orange-500"
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="Owner"
                />
                <div className="hidden md:block ml-3">
                  <p className="text-sm font-medium text-gray-800">Restaurant Owner</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          {activeTab === "dashboard" && (
            <div className="text-center text-gray-600 text-lg mt-10">
              Welcome to your restaurant dashboard!
            </div>
          )}
          {activeTab === "profile" && <OwnerProfileData />}
          {activeTab === "restaurant" && <RestaurantDetails />}
          {activeTab === "orders" && <RestaurantOrders />}
          {activeTab === "earnings" && <EarningsOverview />}
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

export default RestaurantOwnerDashboard;

import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaUtensils,
  FaClipboardList,
  FaChartPie,
  FaBell,
  FaSignOutAlt,
  FaAddressBook,
  FaCcAmazonPay,
  FaAd,
} from "react-icons/fa";

import OwnerProfileData from "../../../components/ResturantManagement/profile/OwnerProfile";
import RestaurantDetails from "../../../components/ResturantManagement/profile/RestaurantDetails";
import RestaurantOrders from "../../../components/ResturantManagement/profile/RestaurantOrders";
import Analytics from "../../../components/ResturantManagement/profile/Analytics";
import RestaurantPaymentInfo from "../../../components/ResturantManagement/profile/RestaurantPaymentInfo";
import MenuManagement from "../../../components/ResturantManagement/profile/MenuManagement";
import RestaurantOffers from "../../../components/ResturantManagement/profile/RestaurantOffers";

import Logo from "../../../assets/logo-color.png";

function RestaurantOwnerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await adminService.getAllNotifications();
        console.log("response notifications : ", response.data.notifications);
        setNotifications(response.data.notifications);
      } catch (err) {
        setError("Failed to load admin profile.");
      }
    };

    fetchNotifications();
  }, []);
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString(); // or customize the format as needed
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-[#0C1A39] text-white flex flex-col">
        <div className="flex items-center justify-center p-4 md:justify-start">
          <img src={Logo} alt="OrderLk" className="w-12 h-12" />
          <span className="hidden ml-3 text-xl font-bold md:block">
            AMBULA.LK
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 mt-8">
            <SidebarItem
              icon={<FaChartPie />}
              title="Analytics"
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
              icon={<FaAddressBook />} // You can change this icon
              title="Menus"
              active={activeTab === "menu"}
              onClick={() => setActiveTab("menu")}
            />
            <SidebarItem
              icon={<FaAd />} // You can change this icon
              title="Offers"
              active={activeTab === "offers"}
              onClick={() => setActiveTab("offers")}
            />
            <SidebarItem
              icon={<FaClipboardList />}
              title="Orders"
              active={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            />



            <SidebarItem
              icon={<FaCcAmazonPay />} // You can change this icon
              title="Payment Info"
              active={activeTab === "payment"}
              onClick={() => setActiveTab("payment")}
            />

          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              // Add logout logic here
              localStorage.removeItem("token")
              localStorage.removeItem("role");
              localStorage.removeItem("userId");
              window.location.href = "/login";
            }}
            className="flex items-center justify-center w-full py-2 text-sm text-white transition-colors rounded md:justify-start hover:bg-gray-700"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="hidden ml-3 md:block">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden bg-[#03081F] ">
        {/* Header */}
        <header className=" shadow-sm bg-[#03081F]">
          <div className="flex items-center justify-between px-4 py-3 bg-[#03081F]">
            <h1 className="text-xl font-semibold text-white">
              {activeTab === "dashboard" && "Analytics Overview"}
              {activeTab === "profile" && "My Profile"}
              {activeTab === "restaurant" && "Restaurant Details"}
              {activeTab === "menu" && "Menus"}
              {activeTab === "offers" && "Offers"}
              {activeTab === "orders" && "Orders Management"}

              {activeTab === "payment" && "Payment Info"}

            </h1>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1 text-gray-400 rounded-full hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <FaBell className="w-6 h-6" />
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500"></span>
              </button>
              <div className="flex items-center">
                <img
                  className="object-cover border-2 border-orange-500 rounded-full h-9 w-9"
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="Owner"
                />
                <div className="hidden ml-3 md:block">
                  <p className="text-sm font-medium text-gray-800">
                    Restaurant Owner
                  </p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 overflow-y-auto">
          {activeTab === "dashboard" && <Analytics />}
          {activeTab === "profile" && <OwnerProfileData />}
          {activeTab === "restaurant" && <RestaurantDetails />}
          {activeTab === "menu" && <MenuManagement />}
          {activeTab === "offers" && <RestaurantOffers />}
          {activeTab === "orders" && <RestaurantOrders />}
          {activeTab === "payment" && <RestaurantPaymentInfo />}

        </main>
      </div>
      {showNotifications && (
        <div className="absolute top-64 right-6 z-50 w-80 h-96 bg-[#03081F] border border-gray-300 shadow-lg rounded-lg p-4 overflow-hidden">
          <h2 className="text-lg font-semibold mb-2 text-white">Notifications</h2>
          <div className="h-[20rem] overflow-y-auto space-y-2 pr-2">
            {Array.isArray(notifications) && notifications.length > 0 ? (
              notifications
                .slice()
                .reverse()
                .map((note, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50"
                  >
                    <p className="text-sm text-gray-700">{note.message}</p>
                    <p className="text-xs text-gray-400">{formatTime(note.createdAt)}</p>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-300">No new notifications.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, title, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center md:justify-start w-full py-3 px-2 mb-2 rounded-lg transition-colors ${active ? "bg-[#FF8A00] text-white" : "text-gray-300 hover:bg-gray-700"
        }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="hidden ml-3 md:block">{title}</span>
    </button>
  );
}

export default RestaurantOwnerDashboard;

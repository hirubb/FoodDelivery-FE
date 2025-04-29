import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaHome,
  FaHistory,
  FaBell,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaSearch,
  FaUtensils
} from "react-icons/fa";

import CustomerProfile from "../../components/CustomerManagement/profile/CustomerProfile";
import OrderHistory from "../../components/CustomerManagement/profile/OrderHistory";
import PaymentMethods from "../../components/CustomerManagement/profile/PaymentMethods";
import AddressBook from "../../components/CustomerManagement/profile/AddressBook";
import Notifications from "../../components/CustomerManagement/profile/Notifications";

import Logo from "../../assets/logo-color.png";
import { useNavigate } from "react-router-dom";

function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("welcome");
  const [cart, setCart] = useState([]); // Example cart state
  const [cartItems, setCartItems] = useState(3); // Example cart count
  const [customerData, setCustomerData] = useState(null);
  const [notifications, setNotifications] = useState(2); // Example notification count
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch customer data
    fetchCustomerData(token);
  }, [navigate]);

  const fetchCustomerData = async (token) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch("https://api.ambula.lk/customer/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      setCustomerData(data);

      // Simulate fetching cart data
      const cartResponse = await fetch("https://api.ambula.lk/customer/cart", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        setCartItems(cartData.items.length);

        // Update localStorage with the fresh cart data
        localStorage.setItem("cart", JSON.stringify(cartData.items));
      } else {
        // If cart fetch fails, clear any existing cart data
        setCartItems(0);
        localStorage.removeItem("cart");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      // Clear cart data if there's an error
      setCartItems(0);
      localStorage.removeItem("cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("rememberedEmail");
    setCart([]);
    setCartItems(0); // Reset the cart count to zero
    navigate("/login");
  };
  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results or filter current view
    if (searchQuery.trim()) {
      // You could navigate to a dedicated search page
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);

      // Or set state to show filtered results in the current view
      setActiveTab("restaurants");
      // Implement search functionality in the restaurants component
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-orange-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-[#0C1A39] text-white flex flex-col">
        <div className="flex items-center justify-center p-4 md:justify-start">
          <img src={Logo} alt="Ambula" className="w-12 h-12" />
          <span className="hidden ml-3 text-xl font-bold md:block">
            AMBULA.LK
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 mt-8">
            <SidebarItem
              icon={<FaHome />}
              title="Welcome"
              active={activeTab === "welcome"}
              onClick={() => setActiveTab("welcome")}
            />
            <SidebarItem
              icon={<FaUser />}
              title="My Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <SidebarItem
              icon={<FaHistory />}
              title="Order History"
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
            />
            <SidebarItem
              icon={<FaCreditCard />}
              title="Payment Methods"
              active={activeTab === "payment"}
              onClick={() => setActiveTab("payment")}
            />
            <SidebarItem
              icon={<FaMapMarkerAlt />}
              title="Address Book"
              active={activeTab === "addresses"}
              onClick={() => setActiveTab("addresses")}
            />
            <SidebarItem
              icon={<FaBell />}
              title="Notifications"
              active={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
              badge={notifications}
            />
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-2 text-sm text-white transition-colors rounded md:justify-start hover:bg-gray-700"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="hidden ml-3 md:block">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-[#0C1A39] shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-semibold text-white-800">
              {activeTab === "welcome" && "Welcome to Ambula.lk"}
              {activeTab === "profile" && "My Profile"}
              {activeTab === "history" && "Order History"}
              {activeTab === "payment" && "Payment Methods"}
              {activeTab === "addresses" && "Delivery Addresses"}
              {activeTab === "notifications" && "Notifications"}
            </h1>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search for restaurants or food..."
                  className="w-64 py-2 pl-3 pr-10 text-sm bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 p-2 text-gray-500 transform -translate-y-1/2 top-1/2"
                >
                  <FaSearch className="w-4 h-4" />
                </button>
              </form>

              {/* Notifications */}
              <button
                className="relative p-1 text-gray-400 rounded-full hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={() => setActiveTab("notifications")}
              >
                <FaBell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500"></span>
                )}
              </button>

              {/* User Profile */}
              <div className="flex items-center">
                {customerData?.profile_image ? (
                  <img
                    className="object-cover border-2 border-orange-500 rounded-full h-9 w-9"
                    src={customerData.profile_image}
                    alt="Customer"
                  />
                ) : (
                  <div className="flex items-center justify-center bg-gray-200 border-2 border-orange-500 rounded-full h-9 w-9">
                    <FaUser className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                <div className="hidden ml-3 md:block">
                  <p className="text-sm font-medium text-white-800">
                    {customerData ? `${customerData.first_name} ${customerData.last_name}` : "Loading..."}
                  </p>
                  <p className="text-xs text-white-500">Customer</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 overflow-y-auto">
          {activeTab === "welcome" && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Welcome, {customerData ? `${customerData.first_name}` : "Valued Customer"}!
              </h2>
              <p className="mb-4 text-gray-600">
                Hungry? We've got you covered! Browse through our wide selection of restaurants and order your favorite meals delivered straight to your doorstep.
              </p>

              {/* Current/Active Order Status (if any) */}
              <div className="p-4 mb-8 border border-orange-200 rounded-lg bg-orange-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Your Active Order</h3>
                  <button
                    className="px-3 py-1 text-sm text-orange-600 border border-orange-600 rounded-full hover:bg-orange-600 hover:text-white"
                    onClick={() => setActiveTab("history")}
                  >
                    View Details
                  </button>
                </div>
                <div className="flex items-center mt-4">
                  <div className="flex items-center justify-center w-12 h-12 text-white bg-orange-500 rounded-full">
                    <FaUtensils className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">Order #AMB23956</p>
                    <p className="text-sm text-gray-600">Being prepared at Royal Thai Restaurant</p>
                    <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-orange-500 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Estimated delivery: 6:45 PM</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
                <div className="p-4 transition-all rounded-lg bg-blue-50 hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 text-white bg-blue-500 rounded-full">
                      <FaHistory className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Order Again</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Quickly reorder from your past orders.</p>
                  <button
                    className="w-full px-4 py-2 mt-4 text-white transition-all bg-blue-500 rounded-lg hover:bg-blue-600"
                    onClick={() => setActiveTab("history")}
                  >
                    View History
                  </button>
                </div>

                <div className="p-4 transition-all rounded-lg bg-purple-50 hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 text-white bg-purple-500 rounded-full">
                      <FaMapMarkerAlt className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Manage Addresses</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Update or add delivery locations.</p>
                  <button
                    className="w-full px-4 py-2 mt-4 text-white transition-all bg-purple-500 rounded-lg hover:bg-purple-600"
                    onClick={() => setActiveTab("addresses")}
                  >
                    My Addresses
                  </button>
                </div>

                <div className="p-4 transition-all rounded-lg bg-teal-50 hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 text-white bg-teal-500 rounded-full">
                      <FaCreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Payment Methods</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Manage your payment options.</p>
                  <button
                    className="w-full px-4 py-2 mt-4 text-white transition-all bg-teal-500 rounded-lg hover:bg-teal-600"
                    onClick={() => setActiveTab("payment")}
                  >
                    View Methods
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && <CustomerProfile setCustomerData={setCustomerData} customerData={customerData} />}
          {activeTab === "history" && <OrderHistory />}
          {activeTab === "payment" && <PaymentMethods />}
          {activeTab === "addresses" && <AddressBook />}
          {activeTab === "notifications" && <Notifications />}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, title, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center md:justify-start w-full py-3 px-2 mb-2 rounded-lg transition-colors relative ${active ? "bg-[#FF8A00] text-white" : "text-gray-300 hover:bg-gray-700"
        }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="hidden ml-3 md:block">{title}</span>
      {badge && (
        <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full md:relative md:top-auto md:right-auto md:ml-2">
          {badge}
        </span>
      )}
    </button>
  );
}

export default CustomerDashboard;
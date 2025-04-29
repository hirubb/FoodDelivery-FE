import React from "react";
import { FaHistory, FaMapMarkerAlt, FaCreditCard, FaUtensils } from "react-icons/fa";

function WelcomeSection({ customerData, setActiveTab }) {
  return (
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
  );
}

export default WelcomeSection;
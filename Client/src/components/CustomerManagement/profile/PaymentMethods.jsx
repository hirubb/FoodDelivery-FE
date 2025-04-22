import React from "react";
import { FaCreditCard, FaMapMarkerAlt } from "react-icons/fa";

function PaymentMethods() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payment Methods</h2>
        <button className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600">
          Add New Card
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center">
            <div className="p-2 mr-4 text-white bg-blue-600 rounded-md">
              <FaCreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-gray-800">VISA •••• 4582</p>
              <p className="text-sm text-gray-600">Expires 09/26</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-600 transition-colors border border-gray-300 rounded-md hover:bg-gray-100">
              Edit
            </button>
            <button className="px-3 py-1 text-sm text-red-600 transition-colors border border-red-200 rounded-md hover:bg-red-50">
              Remove
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center">
            <div className="p-2 mr-4 text-white bg-red-600 rounded-md">
              <FaCreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-gray-800">MASTERCARD •••• 7896</p>
              <p className="text-sm text-gray-600">Expires 12/27</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-600 transition-colors border border-gray-300 rounded-md hover:bg-gray-100">
              Edit
            </button>
            <button className="px-3 py-1 text-sm text-red-600 transition-colors border border-red-200 rounded-md hover:bg-red-50">
              Remove
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Other Payment Options</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="p-2 mr-4 text-gray-700 bg-gray-200 rounded-md">
              <FaMapMarkerAlt className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Cash on Delivery</p>
              <p className="text-sm text-gray-600">Pay with cash upon delivery</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="p-2 mr-4 text-blue-700 bg-blue-100 rounded-md">
              <img src="/api/placeholder/24/24" alt="PayHere" className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-gray-800">PayHere</p>
              <p className="text-sm text-gray-600">Pay online using PayHere</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethods;
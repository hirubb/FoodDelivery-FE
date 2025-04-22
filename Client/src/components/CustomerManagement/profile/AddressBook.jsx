import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

function AddressBook() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Delivery Addresses</h2>
        <button className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600">
          Add New Address
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border-2 border-orange-500 rounded-lg bg-orange-50">
          <div className="flex items-center">
            <div className="p-2 mr-4 text-white bg-orange-500 rounded-full">
              <FaMapMarkerAlt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center">
                <p className="font-medium text-gray-800">Home</p>
                <span className="px-2 py-0.5 ml-2 text-xs text-orange-600 bg-orange-100 rounded-full">Default</span>
              </div>
              <p className="text-sm text-gray-600">123 Palm Grove, Colombo 03</p>
              <p className="text-sm text-gray-600">+94 71 234 5678</p>
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
            <div className="p-2 mr-4 text-white bg-gray-500 rounded-full">
              <FaMapMarkerAlt className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Work</p>
              <p className="text-sm text-gray-600">456 Tech Park, Colombo 07</p>
              <p className="text-sm text-gray-600">+94 71 234 5678</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-orange-600 transition-colors border border-orange-300 rounded-md hover:bg-orange-50">
              Set as Default
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 transition-colors border border-gray-300 rounded-md hover:bg-gray-100">
              Edit
            </button>
            <button className="px-3 py-1 text-sm text-red-600 transition-colors border border-red-200 rounded-md hover:bg-red-50">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressBook;
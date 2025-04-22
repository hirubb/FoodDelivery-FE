import React from "react";

function Notifications() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Notifications</h2>
      
      <div className="space-y-4">
        <div className="p-4 transition-colors border-l-4 border-orange-500 rounded-lg bg-orange-50 hover:bg-orange-100">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">Your order has been confirmed!</h3>
            <span className="text-xs text-gray-500">Today, 3:45 PM</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Your order #AMB23956 from Royal Thai Restaurant has been confirmed and is being prepared.
          </p>
          <div className="flex mt-2 space-x-2">
            <button className="text-sm text-orange-600 hover:text-orange-800">View Order</button>
          </div>
        </div>
        
        <div className="p-4 transition-colors border-l-4 border-blue-500 rounded-lg bg-blue-50 hover:bg-blue-100">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">Special Offer!</h3>
            <span className="text-xs text-gray-500">Today, 11:20 AM</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Get 20% off on your next order from Spice Garden. Use code SPICE20.
          </p>
          <div className="flex mt-2 space-x-2">
            <button className="text-sm text-blue-600 hover:text-blue-800">View Restaurant</button>
          </div>
        </div>
    
        
        <div className="p-4 transition-colors border-l-4 border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">Your order has been delivered!</h3>
            <span className="text-xs text-gray-500">Apr 19, 7:30 PM</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Your order #AMB23892 from Spice Garden has been delivered. Enjoy your meal!
          </p>
          <div className="flex mt-2 space-x-2">
            <button className="text-sm text-gray-600 hover:text-gray-800">Rate Your Experience</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
// components/OrderManagement/OrderSummary.jsx
import React from 'react';

function OrderSummary({ cart, showItemDetails = false }) {
  // Calculate totals
  const itemsTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity, 
    0
  );
  const deliveryFee = itemsTotal * 0.05; // 5% delivery fee
  const total = itemsTotal + deliveryFee;

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <h3 className="font-bold text-black mb-3">Order Summary</h3>
      
      {showItemDetails && (
        <div className="mb-4 space-y-2">
          <div className="text-black font-medium border-b pb-1 mb-2 flex">
            <span className="flex-1">Item</span>
            <span className="w-16 text-center">Qty</span>
            <span className="w-24 text-right">Price</span>
          </div>
          
          {cart.map((item) => (
            <div key={item._id} className="text-black flex items-center">
              <span className="flex-1 truncate">{item.name}</span>
              <span className="w-16 text-center">{item.quantity}x</span>
              <span className="w-24 text-right">Rs. {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between text-black">
          <span>Items Total:</span>
          <span>Rs. {itemsTotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-black">
          <span>Delivery Fee (5%):</span>
          <span>Rs. {deliveryFee.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between font-bold text-black border-t border-gray-300 pt-2 mt-2">
          <span>Total:</span>
          <span>Rs. {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
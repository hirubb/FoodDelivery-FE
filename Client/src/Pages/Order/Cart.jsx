import React from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  // This would typically come from a global state management solution
  // For now, we'll use mock data
  const cartItems = [
    {
      id: 1,
      name: 'Farm House Xtreme Pizza',
      size: 'large',
      price: 27.50,
      quantity: 2,
      image: '🍕'
    },
    {
      id: 2,
      name: 'Deluxe Pizza',
      size: 'medium',
      price: 25.50,
      quantity: 1,
      image: '🍕'
    }
  ];

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const deliveryFee = 64; // RS.64 as shown in the image
  const total = calculateSubtotal() + deliveryFee;

  return (
    <div className="min-h-screen bg-[#03081F] mt-48 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cart Header */}
        <div className="py-8">
          <h1 className="text-5xl font-bold text-white">Your Cart</h1>
          <p className="text-xl text-gray-300 mt-2">{cartItems.length} items in cart</p>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mt-8">
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between py-6 border-b border-gray-800"
            >
              <div className="flex items-center gap-6">
                <span className="text-4xl">{item.image}</span>
                <div>
                  <h3 className="text-xl text-white font-semibold">{item.name}</h3>
                  <p className="text-gray-400 mt-1">Size: {item.size}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-4 bg-[#0B0E22] rounded-lg px-4 py-2">
                  <button className="text-2xl text-gray-400 hover:text-[#FC8A06] transition-colors">-</button>
                  <span className="w-8 text-center font-medium text-white text-xl">{item.quantity}</span>
                  <button className="text-2xl text-gray-400 hover:text-[#FC8A06] transition-colors">+</button>
                </div>
                <div className="text-xl font-semibold text-white w-32 text-right">
                  RS.{(item.price * item.quantity).toFixed(2)}
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors ml-4">
                  <span className="text-3xl">×</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary - Right Aligned */}
        <div className="mt-8 ml-auto max-w-md">
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span className="text-gray-300">Subtotal</span>
              <span className="text-white font-medium">RS.{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-300">Delivery Fee</span>
              <span className="text-white font-medium">RS.{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-800 pt-4 mt-4">
              <div className="flex justify-between text-xl font-bold">
                <span className="text-white">Total</span>
                <span className="text-[#FC8A06]">RS.{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <button className="w-full bg-[#FC8A06] text-white py-4 rounded-xl mt-8 text-lg font-semibold hover:bg-white hover:text-[#03081F] transition-all duration-300 border-2 border-[#FC8A06]">
            Proceed to Checkout
          </button>
          <Link to="/" className="block text-center mt-4 text-gray-400 hover:text-[#FC8A06] transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart; 
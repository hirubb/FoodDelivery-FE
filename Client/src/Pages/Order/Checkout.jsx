import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  
  // Mock cart data - in a real app, this would come from global state or context
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
  
  // Calculate order totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const deliveryFee = 64;
  const subtotal = calculateSubtotal();
  const total = subtotal + deliveryFee;
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process payment
    alert('Payment processing would happen here');
    // Navigate to confirmation page (which would be created separately)
    // navigate('/order/confirmation');
  };
  
  return (
    <div className="min-h-screen bg-[#03081F] mt-48 px-4 md:px-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Checkout Header */}
        <div className="py-8">
          <h1 className="text-5xl font-bold text-white">Checkout</h1>
          <p className="text-xl text-gray-300 mt-2">Complete your order</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Delivery Information Form */}
          <div className="w-full lg:w-2/3">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-6">Delivery Information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <input 
                      type="text" 
                      name="firstName" 
                      placeholder="First name" 
                      className="w-full p-4 rounded-lg bg-[#0B0E22] border border-gray-700 text-white"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      name="lastName" 
                      placeholder="Last name" 
                      className="w-full p-4 rounded-lg bg-[#0B0E22] border border-gray-700 text-white"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Email address" 
                    className="w-full p-4 rounded-lg bg-[#0B0E22] border border-gray-700 text-white"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <input 
                    type="text" 
                    name="street" 
                    placeholder="Street" 
                    className="w-full p-4 rounded-lg bg-[#0B0E22] border border-gray-700 text-white"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <input 
                      type="text" 
                      name="city" 
                      placeholder="City" 
                      className="w-full p-4 rounded-lg bg-[#0B0E22] border border-gray-700 text-white"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      name="state" 
                      placeholder="State" 
                      className="w-full p-4 rounded-lg bg-[#0B0E22] border border-gray-700 text-white"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <input 
                      type="text" 
                      name="zipCode" 
                      placeholder="Zip code" 
                      className="w-full p-4 rounded-lg bg-[#0B0E22] border border-gray-700 text-white"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      name="country" 
                      placeholder="Country" 
                      className="w-full p-4 rounded-lg bg-[#0B0E22] border border-gray-700 text-white"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="Phone" 
                    className="w-full p-4 rounded-lg bg-[#0B0E22] border border-gray-700 text-white"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-[#0B0E22] rounded-xl p-8 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">Cart Total</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-lg border-b border-gray-800 pb-4">
                  <span className="text-gray-300">Sub total</span>
                  <span className="text-white font-medium">{subtotal.toFixed(2)} LKR</span>
                </div>
                <div className="flex justify-between text-lg border-b border-gray-800 pb-4">
                  <span className="text-gray-300">Delivery Fee</span>
                  <span className="text-white font-medium">{deliveryFee.toFixed(2)} LKR</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span className="text-white">Total</span>
                  <span className="text-[#FC8A06]">{total.toFixed(2)} LKR</span>
                </div>
              </div>
              
              <button 
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-[#FC8A06] text-white py-4 rounded-xl mt-8 text-lg font-semibold hover:bg-white hover:text-[#03081F] transition-all duration-300 border-2 border-[#FC8A06]"
              >
                PROCEED TO PAYMENT
              </button>
              
              <Link to="/cart" className="block text-center mt-4 text-gray-400 hover:text-[#FC8A06] transition-colors">
                Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 
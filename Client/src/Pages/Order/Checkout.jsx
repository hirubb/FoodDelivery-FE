import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const deliveryFee = 64;
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customerId = "cust123"; // Replace with actual login logic later
    const restaurantId = "rest123"; // Replace with dynamic restaurant ID later

    const formattedItems = cartItems.map(item => ({
      menuItemId: item.id,
      quantity: item.quantity
    }));

    try {
      const response = await axios.post("http://localhost:5001/orders", {
        customerId,
        restaurantId,
        items: formattedItems
      });

      const orderId = response.data._id;
      localStorage.removeItem("cart");
      navigate(`/order-status/${orderId}`);
    } catch (error) {
      console.error("Order failed:", error);
      alert("Order could not be placed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#03081F] text-white p-10">
      <h1 className="text-4xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className="p-4 w-full bg-[#0B0E22] rounded" />
        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className="p-4 w-full bg-[#0B0E22] rounded" />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="p-4 w-full bg-[#0B0E22] rounded" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required className="p-4 w-full bg-[#0B0E22] rounded" />
        <button type="submit" className="w-full bg-[#FC8A06] py-4 text-lg font-semibold rounded">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
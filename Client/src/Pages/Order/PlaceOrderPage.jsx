import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PlaceOrderPage() {
  const { cartItems, restaurantId, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const placeOrder = async () => {
    try {
      const response = await axios.post('http://localhost:5001/orders', {
        customerId: 'cust101', // Replace with logged in user ID
        restaurantId,
        items: cartItems.map(item => ({
          menuItemId: item._id,
          quantity: item.quantity
        }))
      });
      clearCart();
      navigate(`/order/${response.data._id}/status`);
    } catch (error) {
      alert('Failed to place order');
    }
  };

  return (
    <div>
      <h2>Confirm Order</h2>
      <button onClick={placeOrder}>Place Order Now</button>
    </div>
  );
}

export default PlaceOrderPage;

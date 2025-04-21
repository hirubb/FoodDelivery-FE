import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto p-4 mt-20">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-[#FC8A06] text-white px-6 py-2 rounded-lg hover:bg-[#E67A00]"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Rs.{item.price * item.quantity}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, Math.max(0, item.quantity - 1))}
                      className="px-2 py-1 bg-gray-100 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-100 rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <p className="text-xl font-bold">Total: Rs.{total.toFixed(2)}</p>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 bg-[#FC8A06] text-white px-6 py-3 rounded-lg hover:bg-[#E67A00]"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
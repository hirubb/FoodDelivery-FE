import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import axios from 'axios';

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get image URL
  const getImageUrl = (path) => {
    if (!path) return '/default-food.jpg';
    return path.startsWith('http') ? path : `${import.meta.env.VITE_API_URL}${path}`;
  };

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (itemId, newQuantity) => {
    const updatedCart = cart.map(item =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    ).filter(item => item.quantity > 0);
    updateCart(updatedCart);
  };

  const removeItem = (itemId) => {
    const updatedCart = cart.filter(item => item._id !== itemId);
    updateCart(updatedCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // 🧾 Place order and send to backend
  const handlePlaceOrder = async () => {
    if (!cart.length) return;

    try {
      const order = {
        customerId: "cust123", // Replace with real user if needed
        restaurantId: cart[0].restaurant_id,
        items: cart.map(item => ({
          menuItemId: item._id,
          quantity: item.quantity
        }))
      };

      const res = await axios.post("http://localhost:5001/orders", order);

      alert("✅ Order placed successfully!");
      localStorage.removeItem("cart");
      navigate("/"); // Redirect to home or order list
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order.");
    }
  };

  // Loader
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC8A06]"></div>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some delicious items to your cart!</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="flex items-center gap-2 mx-auto text-[#FC8A06] hover:text-[#E67E22]"
          >
            <ArrowLeft size={20} />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button
          onClick={() => navigate('/restaurants')}
          className="flex items-center gap-2 text-[#FC8A06] hover:text-[#E67E22]"
        >
          <ArrowLeft size={20} />
          <span>Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm"
            >
              <img
                src={getImageUrl(item.images?.[0])}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-food.jpg';
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.portion}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-1 border rounded-full"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-1 border rounded-full"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">Rs. {item.price * item.quantity}</span>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {calculateTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs. 100</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rs. {calculateTotal() + 100}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-[#FC8A06] text-white py-3 rounded-full hover:bg-[#E67E22] transition-colors"
              >
                ✅ Place Order
              </button>
              <button
                onClick={clearCart}
                className="w-full text-red-500 py-2 hover:text-red-600"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

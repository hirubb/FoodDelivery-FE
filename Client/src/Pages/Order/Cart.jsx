import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import orderService from '../../services/order-service';

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const getImageUrl = (path) => {
    if (!path) return '/default-food.jpg';
    return path.startsWith('http')
      ? path
      : `${import.meta.env.VITE_API_URL}${path}`;
  };

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // If not authenticated, redirect to login page
      setOrderError("You need to be logged in to view your cart");
      // You could also automatically redirect to login
      // navigate('/login', { state: { returnUrl: '/cart' } });
    }
    
    setLoading(false);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (itemId, newQuantity) => {
    const updatedCart = cart
      .map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(updatedCart);
  };

  const removeItem = (itemId) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    updateCart(updatedCart);
  };

  // Calculate total amount
  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // Handle place order
  const placeOrder = async () => {
    // Check for authentication
    const token = localStorage.getItem('token');
    if (!token) {
      setOrderError("Please login to place an order");
      navigate('/login', { state: { returnUrl: '/cart' } });
      return;
    }
    
    // Check if cart is empty
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      return;
    }
    
    // Prepare order data
    const restaurantId = cart[0].restaurant_id; // Assuming all items are from the same restaurant
    
    const orderItems = cart.map(item => ({
      menuItemId: item._id,
      quantity: item.quantity
    }));
    
    const totalAmount = calculateTotal();
    
    const orderData = {
      restaurantId,
      items: orderItems,
      totalAmount
    };
    
    try {
      setIsPlacingOrder(true);
      setOrderError(null);
      
      const response = await orderService.placeOrder(orderData);
      
      // Clear cart after successful order
      localStorage.removeItem('cart');
      setCart([]);
      
      // Save order ID for tracking
      const orderId = response.data.order.orderId;
      const recentOrders = JSON.parse(localStorage.getItem('recentOrders') || '[]');
      recentOrders.unshift(orderId);
      localStorage.setItem('recentOrders', JSON.stringify(recentOrders.slice(0, 10))); // Keep last 10 orders
      
      alert("Order Placed Successfully! Your order ID is: " + orderId);
      navigate("/checkout", { state: { orderId } });

    } catch (err) {
      console.error("Order placement failed:", err);
      
      if (!err.response) {
        setOrderError("Network error. Please check your connection and try again.");
      } else if (err.response.status === 401) {
        setOrderError("Your session has expired. Please login again.");
        navigate('/login', { state: { returnUrl: '/cart' } });
      } else {
        setOrderError(`Failed to place order: ${err.response.data.error || err.message}`);
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC8A06]"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-10 text-center">
        <h2 className="mb-4 text-2xl font-bold">Your cart is empty</h2>
        <button
          onClick={() => navigate('/restaurants')}
          className="flex items-center gap-2 text-[#FC8A06] hover:text-[#E67E22] underline mx-auto"
        >
          <ArrowLeft size={20} />
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
      
      {orderError && (
        <div className="px-4 py-3 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
          {orderError}
        </div>
      )}
      
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow"
          >
            {/* Image */}
            <img
              src={getImageUrl(item.images?.[0])}
              alt={item.name}
              className="object-cover w-20 h-20 rounded"
            />

            {/* Item Details */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="mb-1 text-sm text-gray-600">
                Portion: {item.portion}
              </p>
              <p className="mb-1 text-sm text-gray-700">
                Price: Rs. {item.price}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item._id, Math.max(item.quantity - 1, 0))
                  }
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price and Remove */}
            <div className="text-right">
              <p className="font-bold text-lg text-[#FC8A06]">
                Rs. {item.price * item.quantity}
              </p>
              <p className="text-xs text-gray-500">
                ({item.price} x {item.quantity})
              </p>
              <button
                onClick={() => removeItem(item._id)}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total & Action Buttons */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-[#FC8A06] hover:text-[#E67E22] underline flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>
          <div className="text-xl font-bold">
            Total: Rs. {calculateTotal()}
          </div>
        </div>
        
        {/* Place Order Button */}
        <button
          onClick={placeOrder}
          disabled={isPlacingOrder}
          className={`w-full py-3 ${
            isPlacingOrder ? 'bg-gray-400' : 'bg-[#FC8A06] hover:bg-[#E67E22]'
          } text-white rounded-lg flex items-center justify-center gap-2`}
        >
          {isPlacingOrder ? (
            <>
              <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
              Processing...
            </>
          ) : (
            <>
              <ShoppingBag size={20} />
              Place Order (Rs. {calculateTotal()})
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default CartPage;
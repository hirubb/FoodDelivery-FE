import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ArrowLeft, ShoppingBag, MapPin } from "lucide-react";
import orderService from "../../services/order-service";

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const getImageUrl = (path) => {
    if (!path) return "/default-food.jpg";
    return path.startsWith("http")
      ? path
      : `${import.meta.env.VITE_API_URL}${path}`;
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Get user location from localStorage (set in RestaurantMenuPage)
    const locationData = localStorage.getItem("userLocation");
    if (locationData) {
      setUserLocation(JSON.parse(locationData));
    } else {
      // If location isn't available, try to get it now
      getCurrentLocation();
    }

    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      setOrderError("You need to be logged in to view your cart");
    }

    setLoading(false);
  }, []);

  // Function to get current location if not already set
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = {
            latitude,
            longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          setUserLocation(locationData);
          localStorage.setItem("userLocation", JSON.stringify(locationData));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
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
    const itemsTotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const deliveryFee = itemsTotal * 0.05; // 5% delivery fee
    return itemsTotal + deliveryFee;
  };

  
  // Handle place order
  const placeOrder = async () => {
    // Check for authentication
    const token = localStorage.getItem("token");
    if (!token) {
      setOrderError("Please login to place an order");
      navigate("/login", { state: { returnUrl: "/cart" } });
      return;
    }

    // Check if cart is empty
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      return;
    }

    // Prepare order data
    const restaurantId = cart[0].restaurant_id; // Assuming all items are from the same restaurant

    const orderItems = cart.map((item) => ({
      menuItemId: item._id,
      quantity: item.quantity,
    }));

    const totalAmount = calculateTotal();

    // Include location data in the order
    const orderData = {
      restaurantId,
      items: orderItems,
      totalAmount,
      deliveryLocation: userLocation,
    };

    try {
      setIsPlacingOrder(true);
      setOrderError(null);

      const response = await orderService.placeOrder(orderData);

      // Clear cart after successful order
      localStorage.removeItem("cart");
      setCart([]);

      // Save order ID for tracking
      const orderId = response.data.order.orderId;
      const recentOrders = JSON.parse(
        localStorage.getItem("recentOrders") || "[]"
      );
      recentOrders.unshift(orderId);
      localStorage.setItem(
        "recentOrders",
        JSON.stringify(recentOrders.slice(0, 10))
      ); // Keep last 10 orders

      // alert("Order Placed Successfully! Your order ID is: " + orderId);
      navigate("/checkout", { state: { orderId } });
    } catch (err) {
      console.error("Order placement failed:", err);

      if (!err.response) {
        setOrderError(
          "Network error. Please check your connection and try again."
        );
      } else if (err.response.status === 401) {
        setOrderError("Your session has expired. Please login again.");
        navigate("/login", { state: { returnUrl: "/cart" } });
      } else {
        setOrderError(
          `Failed to place order: ${err.response.data.error || err.message}`
        );
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC8A06]"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate("/restaurants")}
          className="flex items-center gap-2 text-[#FC8A06] hover:text-[#E67E22] underline mx-auto"
        >
          <ArrowLeft size={20} />
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Order</h1>

      {orderError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {orderError}
        </div>
      )}

      {/* Location status */}
      <div
        className={`flex items-center p-3 rounded mb-6 ${userLocation
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
          }`}
      >
        <MapPin size={20} className="mr-2" />
        {userLocation ? (
          <div>
            <span className="font-semibold">Delivery location:</span> Location
            detected for delivery
          </div>
        ) : (
          <div className="flex flex-col">
            <span>No delivery location provided</span>
            <button
              onClick={getCurrentLocation}
              className="text-blue-600 underline text-sm mt-1"
            >
              Share your location for delivery
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 bg-white p-4 rounded-lg shadow"
          >
            {/* Image */}
            <img
              src={getImageUrl(item.images?.[0])}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />

            {/* Item Details */}
            <div className="flex-1">
              <h3 className="text-black font-bold">{item.name}</h3>
              <p className="text-black text-gray-600 mb-1 font-bold">
                Portion: {item.portion}
              </p>
              <p className="text-black text-gray-700 mb-1 font-bold">
                Price: Rs. {item.price}
              </p>
              <div className="flex items-center gap-2">
                {/* Decrease Button */}
                <button
                  onClick={() =>
                    updateQuantity(item._id, Math.max(item.quantity - 1, 0))
                  }
                  className="px-2 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
                >
                  -
                </button>

                {/* Quantity Text */}
                <span className="text-black">{item.quantity}</span>

                {/* Increase Button */}
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
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
                className="text-red-500 hover:text-red-700 mt-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total & Action Buttons */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-[#FC8A06] hover:text-[#E67E22] underline flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>
          <div className="text-xl font-bold">
            <div className="text- text-gray-200">
              Items Total: Rs.{" "}
              {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
            </div>
            <div className="text-lg text-gray-200">
              Delivery Fee: Rs.{" "}
              {cart.reduce((acc, item) => acc + item.price * item.quantity, 0) *
                0.05}
            </div>
            <div>Total: Rs. {calculateTotal()}</div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={placeOrder}
          disabled={isPlacingOrder}
          className={`w-full py-3 ${isPlacingOrder ? "bg-gray-400" : "bg-[#FC8A06] hover:bg-[#E67E22]"
            } text-white rounded-lg flex items-center justify-center gap-2`}
        >
          {isPlacingOrder ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
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

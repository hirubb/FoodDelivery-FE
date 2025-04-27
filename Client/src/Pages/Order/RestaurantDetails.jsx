import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Star, Clock, MapPin } from "lucide-react";
import restaurantService from "../../services/restaurant-service";
import DeliveryLocationPopup from "../../components/OrderManagement/DeliveryLocationPopup";
import FloatingCart from "../../components/OrderManagement/FloatingCart";
import CartButton from "../../components/OrderManagement/CartButton";
import orderService from "../../services/order-service";
import { CartContext } from "../../context/CartContext";

function RestaurantMenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Ordering state
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  
  // Location related state
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(true);

  // Access cart context
  const { 
    cart, 
    addToCart: contextAddToCart, 
    updateQuantity, 
    removeItem, 
    isCartOpen, 
    setIsCartOpen,
    getCartCount 
  } = useContext(CartContext);

  const menuIcons = {
    Breakfast: "🥗",
    kottuspecial: "🍰",
    Beverages: "🥤",
    dinner: "🍟",
    lunch: "🍚",
    Others: "🍽️",
  };

  const getImageUrl = (path) => {
    if (!path) return "/default-food.jpg";
    return path.startsWith("http")
      ? path
      : `${import.meta.env.VITE_API_URL}${path}`;
  };

  // Check for saved location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        if (parsedLocation.latitude && parsedLocation.longitude) {
          setUserLocation(parsedLocation);
        }
      } catch (error) {
        console.error("Error parsing saved location:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        const [menuResponse, restaurantResponse] = await Promise.all([
          restaurantService.getMenus(id),
          restaurantService.getRestaurantById(id),
        ]);

        if (!restaurantResponse.data || !menuResponse.data) {
          throw new Error("Invalid response from server");
        }

        setMenus(menuResponse.data || []);
        setRestaurant(restaurantResponse.data.data);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message || "Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  const handleSaveLocation = (locationData) => {
    setUserLocation(locationData);
    localStorage.setItem('userLocation', JSON.stringify(locationData));
    
    const message = locationData.source === "current" 
      ? "Using your current location for delivery" 
      : "Delivery location has been set";
    
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };

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

  const addToCart = (item) => {
    if (!userLocation) {
      setNotification("Please set your delivery location first");
      setTimeout(() => {
        setNotification(null);
        setIsLocationPopupOpen(true);
      }, 1500);
      return;
    }
    
    // Add restaurant_id and userLocation to the item
    const itemWithRestaurantInfo = {
      ...item,
      restaurant_id: id,
      userLocation: userLocation
    };
    
    // Use the contextAddToCart from CartContext
    contextAddToCart(itemWithRestaurantInfo);
    
    setNotification(`${item.name} added to cart`);
    setIsCartOpen(true);
    setTimeout(() => setNotification(null), 1000);
  };
  
  // Handle place order
  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOrderError("Please login to place an order");
      navigate("/login", { state: { returnUrl: `/restaurants/${id}` } });
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      return;
    }

    const restaurantId = id;
    const orderItems = cart.map((item) => ({
      menuItemId: item._id,
      quantity: item.quantity,
    }));

    const totalAmount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ) * 1.05; // Adding 5% delivery fee

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

      localStorage.removeItem("cart");
      // setCart([]);

      const orderId = response.data.order.orderId;
      const recentOrders = JSON.parse(
        localStorage.getItem("recentOrders") || "[]"
      );
      recentOrders.unshift(orderId);
      localStorage.setItem(
        "recentOrders",
        JSON.stringify(recentOrders.slice(0, 10))
      );

      navigate("/checkout", { state: { orderId } });
    } catch (err) {
      console.error("Order placement failed:", err);

      if (!err.response) {
        setOrderError(
          "Network error. Please check your connection and try again."
        );
      } else if (err.response.status === 401) {
        setOrderError("Your session has expired. Please login again.");
        navigate("/login", { state: { returnUrl: `/restaurants/${id}` } });
      } else {
        setOrderError(
          `Failed to place order: ${err.response.data.error || err.message}`
        );
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const displayedItems = menus
    .filter((menu) => !selectedCategory || selectedCategory === menu._id)
    .flatMap((menu) => menu.menu_items || []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC8A06]"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/restaurants")}
          className="text-[#FC8A06] hover:text-[#E67E22] underline"
        >
          Back to Restaurants
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      <DeliveryLocationPopup 
        isOpen={isLocationPopupOpen}
        onClose={() => setIsLocationPopupOpen(false)}
        onSave={handleSaveLocation}
        initialLocation={userLocation}
      />

      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out z-50">
          {notification}
        </div>
      )}

      {/* Restaurant Banner */}
      <div className="relative h-[300px] mb-8 rounded-xl overflow-hidden">
        {restaurant?.banner_image || restaurant?.logo ? (
          <img
            src={getImageUrl(restaurant.banner_image || restaurant.logo)}
            alt={restaurant?.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-restaurant.jpg";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-2xl">No Image Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{restaurant?.name}</h1>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            {/* Rating with stars in banner */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${i < Math.floor(restaurant?.averageRating || 0) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-300"}`} 
                  />
                ))}
              </div>
              <span>{restaurant?.averageRating?.toFixed(1) || "N/A"}</span>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsRatingExpanded(true);
                }}
                className="text-xs underline hover:text-yellow-300 ml-1"
              >
                Rate
              </button>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{restaurant?.deliveryTime || "45 min"}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{restaurant?.city || "Location not available"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Menu Categories</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("")}
            className={`flex flex-col items-center p-4 rounded-lg min-w-[100px] ${
              selectedCategory === ""
                ? "bg-[#FC8A06] text-white"
                : "bg-[#03081F] text-white hover:bg-gray-900 border border-gray-800"
            }`}
          >
            <span className="text-2xl mb-2">🍽️</span>
            <span className="text-sm">All</span>
          </button>
          {menus.map((menu) => (
            <button
              key={menu._id}
              onClick={() => setSelectedCategory(menu._id)}
              className={`flex flex-col items-center p-4 rounded-lg min-w-[100px] ${
                selectedCategory === menu._id
                  ? "bg-[#FC8A06] text-white"
                  : "bg-[#03081F] text-white hover:bg-gray-900 border border-gray-800"
              }`}
            >
              <span className="text-2xl mb-2">
                {menuIcons[menu.name] || "🍽️"}
              </span>
              <span className="text-sm whitespace-nowrap">{menu.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {item.images?.[0] && (
              <img
                src={getImageUrl(item.images[0])}
                alt={item.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-food.jpg";
                }}
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Rs. {item.price}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-[#FC8A06] text-white px-4 py-2 rounded-full hover:bg-[#E67E22] transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Button (only visible when cart has items and floating cart is closed) */}
      {cart.length > 0 && !isCartOpen && (
        <CartButton 
          itemCount={getCartCount()} 
          onClick={() => setIsCartOpen(true)} 
        />
      )}

      {/* Floating Cart */}
      <FloatingCart
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        userLocation={userLocation}
        getCurrentLocation={getCurrentLocation}
        placeOrder={placeOrder}
        isPlacingOrder={isPlacingOrder}
        orderError={orderError}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        getImageUrl={getImageUrl}
      />
    </div>
  );
}

export default RestaurantMenuPage;
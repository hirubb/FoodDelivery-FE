import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star, Clock, MapPin, AlertCircle, ShoppingBag, ChevronUp, ChevronDown } from "lucide-react";
import restaurantService from "../../services/restaurant-service";
import DeliveryLocationPopup from "../../components/OrderManagement/DeliveryLocationPopup";

function RestaurantMenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCartExpanded, setIsCartExpanded] = useState(true);
  const [ratings, setRatings] = useState({});

  // Location related state
  const [userLocation, setUserLocation] = useState(null);

  // Always show location popup on first load
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(true);

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

  const handleRateItem = (itemId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [itemId]: rating,
    }));
    console.log(`Item ${itemId} rated: ${rating} stars`);
  };

  // Check for saved location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');

    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        if (parsedLocation.latitude && parsedLocation.longitude) {
          setUserLocation(parsedLocation);
          // Even if we have a saved location, we still show the popup
          // but we'll pass the saved location as initialLocation
        }
      } catch (error) {
        console.error("Error parsing saved location:", error);
      }
    }
    // No need to set isLocationPopupOpen to true here as it's already true by default
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
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
    // Set the user location
    setUserLocation(locationData);

    // Save to localStorage for future use
    localStorage.setItem('userLocation', JSON.stringify(locationData));

    // Show confirmation notification
    const message = locationData.source === "current"
      ? "Using your current location for delivery"
      : "Delivery location has been set";

    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };

  const addToCart = (item) => {
    // Check if location is set before adding to cart
    if (!userLocation) {
      setNotification("Please set your delivery location first");
      setTimeout(() => {
        setNotification(null);
        setIsLocationPopupOpen(true);
      }, 1500);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i._id === item._id);

      let newCart;
      if (existingItem) {
        newCart = prevCart.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newCart = [
          ...prevCart,
          {
            _id: item._id,
            name: item.name,
            price: item.price,
            portion: item.portion,
            images: item.images,
            quantity: 1,
            restaurant_id: id,
            // Include user's location in the cart item
            userLocation: userLocation,
          },
        ];
      }

      localStorage.setItem("cart", JSON.stringify(newCart));
      setNotification(`${item.name} added to cart`);

      // Auto expand cart when adding items
      setIsCartExpanded(true);

      setTimeout(() => setNotification(null), 1000);
      return newCart;
    });
  };

  // Calculate total amount with delivery fee
  const calculateTotal = () => {
    const itemsTotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const deliveryFee = itemsTotal * 0.05; // 5% delivery fee
    return itemsTotal + deliveryFee;
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
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 bg-gray-200">
      {/* Delivery Location Popup - shows on page load */}
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
      <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
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
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400" />
              <span>{restaurant?.averageRating || "N/A"}</span>
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
        <h2 className="text-2xl text-black font-bold mb-6">Menu Categories</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("")}
            className={`flex flex-col items-center p-4 rounded-lg min-w-[100px] ${selectedCategory === ""
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
              className={`flex flex-col items-center p-4 rounded-lg min-w-[100px] ${selectedCategory === menu._id
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transform transition duration-300 hover:shadow-2xl hover:scale-[1.03]"
          >
            {item.images?.[0] && (
              <img
                src={getImageUrl(item.images[0])}
                alt={item.name}
                className="w-full h-40 object-cover transition duration-300 ease-in-out hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-food.jpg";
                }}
              />
            )}
            <div className="p-4">
              {/* Name and Rating in one row */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRateItem(item._id, star)}
                      className={`text-md ${ratings[item._id] >= star ? "text-yellow-400" : "text-gray-300"
                        } hover:text-yellow-500 transition`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[36px]">{item.description}</p>

              {/* Price and Add Button */}
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-bold text-lg">Rs. {item.price}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:from-green-600 hover:to-green-700 transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Floating Cart */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden w-72 transition-all duration-300">
            {/* Cart Header with Toggle */}
            <div
              className="bg-[#FC8A06] text-white p-3 flex items-center justify-between cursor-pointer"
              onClick={() => setIsCartExpanded(!isCartExpanded)}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} />
                <span className="font-medium">Your Cart</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-[#FC8A06] rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
                {isCartExpanded ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronUp size={18} />
                )}
              </div>
            </div>

            {/* Collapsible Cart Content */}
            {isCartExpanded && (
              <>
                {/* Cart Items Preview */}
                <div className="max-h-52 overflow-y-auto">
                  {cart.slice(0, 3).map((item) => (
                    <div key={item._id} className="p-2 border-b border-gray-100 flex items-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {item.images?.[0] && (
                          <img
                            src={getImageUrl(item.images[0])}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-black font-medium truncate">{item.name}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">x{item.quantity}</span>
                          <span className="text-black font-semibold">Rs. {item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <div className="text-center text-sm text-gray-500 py-2">
                      +{cart.length - 3} more items
                    </div>
                  )}
                </div>

                {/* Cart Total */}
                <div className="p-3 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-1 text-black">
                    <span>Items Total:</span>
                    <span>Rs. {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-black">
                    <span>Delivery Fee:</span>
                    <span>Rs. {(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-[#FC8A06]">
                    <span>Total:</span>
                    <span>Rs. {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* View Cart Button */}
                <button
                  onClick={() => navigate("/cart")}
                  className="bg-[#FC8A06] text-white w-full py-3 hover:bg-[#E67E22] transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  View Order & Checkout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantMenuPage;
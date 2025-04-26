import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star, Clock, MapPin, AlertCircle } from "lucide-react";
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
      setTimeout(() => setNotification(null), 1000);
      return newCart;
    });
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
    <div className="max-w-7xl mx-auto px-4 py-8">
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

      {/* Location Banner/Button */}
      <div className="mb-4">
        {userLocation ? (
          <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
              <MapPin size={18} className="text-[#FC8A06] mr-2" />
              <div>
                <p className="font-medium">Delivery Location</p>
                <p className="text-sm text-gray-600 truncate max-w-md">
                  {userLocation.address || `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsLocationPopupOpen(true)}
              className="text-[#FC8A06] hover:text-[#E67E22] text-sm font-medium"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle size={18} className="text-yellow-500 mr-2" />
              <p className="text-yellow-700">Delivery location not set</p>
            </div>
            <button 
              onClick={() => setIsLocationPopupOpen(true)}
              className="bg-[#FC8A06] text-white px-3 py-1 rounded hover:bg-[#E67E22] text-sm"
            >
              Set Location
            </button>
          </div>
        )}
      </div>

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

      {/* Menu Categories, etc. - rest of the component remains unchanged */}
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

      {/* Floating Cart + Place Order */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 space-y-2">
          <div className="bg-green-500 px-4 py-3 rounded-full shadow-lg flex items-center w-64">
            <span className="ml-5">
              Total Amount:
            </span>
            <span className="font-bold ml-2">
              Rs.{" "}
              {cart.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              )}
            </span>
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-colors w-full"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

export default RestaurantMenuPage;
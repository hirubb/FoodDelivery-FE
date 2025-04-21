import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star, Clock, MapPin, ShoppingCart } from "lucide-react";
import restaurantService from "../../services/restaurant-service";

function RestaurantMenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [notification, setNotification] = useState(null);

  const foodCategories = [
    { name: "All", icon: "🍽️" },
    { name: "Italian", icon: "🍝" },
    { name: "Chinese", icon: "🥡" },
    { name: "Indian", icon: "🍛" },
    { name: "Mexican", icon: "🌮" },
    { name: "French", icon: "🥖" },
    { name: "Korean", icon: "🍱" },
    { name: "American", icon: "🍔" },
    { name: "Japanese", icon: "🍣" },
    { name: "Srilankan", icon: "🍲" },
    { name: "Cafe", icon: "☕" },
    { name: "Seafood", icon: "🦐" }
  ];

  // Helper function for image URLs
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
  }, []);

  // Fetch restaurant details
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        const [menuResponse, restaurantResponse] = await Promise.all([
          restaurantService.getMenus(id),
          restaurantService.getRestaurantById(id)
        ]);

        if (!restaurantResponse.data || !menuResponse.data) {
          throw new Error('Invalid response from server');
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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === "All" ? "" : category);
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i._id === item._id);
      
      let newCart;
      if (existingItem) {
        newCart = prevCart.map(i => 
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newCart = [...prevCart, {
          _id: item._id,
          name: item.name,
          price: item.price,
          portion: item.portion,
          images: item.images,
          quantity: 1,
          restaurant_id: id
        }];
      }
      
      localStorage.setItem('cart', JSON.stringify(newCart));
      setNotification(`${item.name} added to cart`);
      setTimeout(() => setNotification(null), 2000);
      return newCart;
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC8A06]"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-10">
      <p className="text-red-500 mb-4">{error}</p>
      <button 
        onClick={() => navigate('/restaurants')}
        className="text-[#FC8A06] hover:text-[#E67E22] underline"
      >
        Back to Restaurants
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Notification */}
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
              e.target.src = '/default-restaurant.jpg';
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

      {/* Food Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {foodCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className={`flex flex-col items-center p-4 rounded-lg min-w-[100px] ${
                selectedCategory === category.name
                  ? "bg-[#FC8A06] text-white"
                  : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="text-sm whitespace-nowrap">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Sections */}
      <div className="grid grid-cols-12 gap-6">
        {/* Menu Categories Sidebar */}
        <div className="col-span-3 hidden md:block">
          <div className="sticky top-4">
            <h3 className="font-semibold mb-4">Menu Categories</h3>
            <nav className="flex flex-col gap-2">
              {menus.map((menu) => (
                <a
                  key={menu._id}
                  href={`#${menu._id}`}
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {menu.name}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Menu Items */}
        <div className="col-span-12 md:col-span-9">
          {menus.map((menu) => (
            <div key={menu._id} id={menu._id} className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">{menu.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menu.menu_items?.filter(item => 
                  !selectedCategory || item.category === selectedCategory
                ).map((item) => (
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
                          e.target.src = '/default-food.jpg';
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
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => navigate('/cart')}
            className="bg-[#03081F] text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <ShoppingCart size={20} />
            <span>View Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
            <span className="font-bold ml-2">
              Rs. {cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default RestaurantMenuPage;
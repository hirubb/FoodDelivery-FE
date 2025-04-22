import {
  ChevronRight,
  ChevronLeft,
  Heart,
  Search,
  MapPin,
  Clock,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import restaurantService from "../../services/restaurant-service";
import Promotions from "./Promotions";
import { useNavigate } from 'react-router-dom';//dulmi

export default function Restaurants() {
  const navigate = useNavigate(); // Navigate to restaurant details page(dulmi)
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [systemOffers, setSystemOffers] = useState([]);

  useEffect(() => {
    const fetchSystemOffers = async () => {
      try {
        const response = await restaurantService.getSystemOffers();
        setSystemOffers(response.data);
      } catch (err) {
        console.error("Failed to fetch system offers", err);
      }
    };
  
    fetchSystemOffers();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        console.log("search term : ", searchTerm);
        setLoading(true);
        const response = await restaurantService.getAllRestaurants(
          searchTerm,
          selectedCategory
        );
        setRestaurants(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchTerm, selectedCategory]);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`); // Navigate to restaurant details page(dulmi)
  };

  const handleCategoryClick = (category) => {
    // Toggle category filter
    setSelectedCategory((prev) => (prev === category ? "" : category));
  };

  const foodCategories = [
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
    { name: "Seafood", icon: "🦐" },
    { name: "Others", icon: "🍽️" },
  ];

  const promos = [
    {
      title: "Try Uber One free for 1 month",
      button: "Join now",
      color: "bg-amber-50",
    },
    {
      title: "40% Off for New Users*",
      description: "Valid on your first 2 orders above Rs.1,000 from selected",
      code: "UBEREATSSL",
      color: "bg-green-500",
    },
    {
      title: "65% Off for New Users with Commercial Bank",
      description: "Valid on the first 2 orders until 30 April*",
      code: "CB650",
      color: "bg-gray-100",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={18} />
          <span className="font-medium">335 Kandy - Colombo Rd</span>
          <span className="text-gray-500 text-sm">· Now</span>
          <ChevronRight size={16} className="text-gray-500" />
        </div>

        <div className="relative flex-1 max-w-md mx-4">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Search size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search Uber Eats"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-100 w-full pl-10 pr-4 py-2 rounded-full focus:outline-none"
          />
        </div>
      </header>
      {/* Food Categories */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Food Categories</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {foodCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className={`flex flex-col items-center p-4 rounded-lg min-w-[100px] ${
                selectedCategory === category.name
                  ? "bg-[#FC8A06] text-white"
                  : "bg-[#03081F] text-white hover:bg-gray-900 border border-gray-800"
              }`}
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 my-4 overflow-x-auto">
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full text-[#03081F]">
          <span>Offers</span>
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full text-[#03081F]">
          <span>Delivery fee</span>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
        <button className="px-4 py-2 bg-gray-100 rounded-full text-[#03081F]">
          Under 30 min
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full text-[#03081F]">
          <Star size={16} />
          <span>Highest rated</span>
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full text-[#03081F]">
          <span>Rating</span>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full text-[#03081F]">
          <span>Price</span>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full text-[#03081F]">
          <span>Dietary</span>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full text-[#03081F]">
          <span>Sort</span>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>

      <Promotions promos={systemOffers.length ? systemOffers : promos} />


      <div className="text-xs text-gray-500 mb-6">
        Additional fees may apply. <span className="underline">Learn more</span>
      </div>

      {/* Restaurant Sections */}
      {!loading && Array.isArray(restaurants) && restaurants.length > 0 && ( // dulmi
        <div className="mb-8 ">
          <h2 className="text-2xl font-bold mb-4">All Restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-[#03081F]">
            {restaurants.map((r, idx) => (
              <div key={idx} onClick={() => handleRestaurantClick(r._id)}//order details page(dulmi)
              className="p-4 bg-white rounded-lg shadow">
                {/*logo*/}
                <img
                  src={r.logo}
                  alt={r.banner_image}
                  className="w-full h-1/3 object-cover  mb-6"
                />
                <h3 className="text-lg font-semibold">{r.name}</h3>
                <p className="text-sm text-gray-600">{r.city}</p>
                <p className="text-sm text-gray-600">{r.cuisine_type}</p>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400" />
                    <span>{r.averageRating || "N/A"}</span>
                  </div>
                  <div>{r.deliveryTime || "45 min"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <p className="text-center my-10">Loading restaurants...</p>}
      {!loading && error && (
        <p className="text-center text-red-500 my-10">{error}</p>
      )}
    </div>
  );
}

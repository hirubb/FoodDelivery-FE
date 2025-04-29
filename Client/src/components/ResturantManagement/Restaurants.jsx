import {
  ChevronRight,
  ChevronLeft,
  Heart,
  Search,
  MapPin,
  Clock,
  Star,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import restaurantService from "../../services/restaurant-service";
import Promotions from "./Promotions";
import { useNavigate } from "react-router-dom";

export default function Restaurants() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [systemOffers, setSystemOffers] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    navigate(`/restaurant/${restaurantId}`);
  };

  const handleCategoryClick = (category) => {
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
    <div className="max-w-6xl mx-auto p-4 font-sans bg-[#03081F] min-h-screen text-white">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">


        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-[#83858E]" />
          </div>
          <input
            type="text"
            placeholder="Search for restaurants, cuisines, or dishes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#FFFFFF10] w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC8A06] transition-all text-white placeholder-[#83858E]"
          />
        </div>
      </header>

      {/* Food Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Food Categories</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {foodCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className={`flex flex-col items-center p-3 rounded-lg transition-all transform hover:scale-105 ${selectedCategory === category.name
                  ? "bg-[#FC8A06] text-white shadow-lg shadow-[#FC8A06]/30"
                  : "bg-[#FFFFFF10] text-white hover:bg-[#FFFFFF20]"
                }`}
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Promotions */}
      <Promotions promos={systemOffers.length ? systemOffers : promos} />

      {/* Smart Filters */}
      <div className="my-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Smart Filters</h2>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 bg-[#FFFFFF10] hover:bg-[#FFFFFF20] p-2 rounded-lg transition-colors"
          >
            <Filter size={18} className="text-[#FC8A06]" />
            <span>All Filters</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button className="flex items-center gap-1 px-4 py-2 bg-[#FC8A06] rounded-full text-white shadow-md shadow-[#FC8A06]/30 transition-all hover:brightness-110">
            <span>Special Offers</span>
          </button>
          <button className="flex items-center gap-1 px-4 py-2 bg-[#FFFFFF10] rounded-full text-white hover:bg-[#FFFFFF20] transition-colors">
            <span>Delivery Fee</span>
            <ChevronRight size={16} className="text-[#83858E]" />
          </button>
          <button className="px-4 py-2 bg-[#FFFFFF10] rounded-full text-white hover:bg-[#FFFFFF20] transition-colors">
            <span>Under 30 min</span>
          </button>
          <button className="flex items-center gap-1 px-4 py-2 bg-[#FFFFFF10] rounded-full text-white hover:bg-[#FFFFFF20] transition-colors">
            <Star size={16} className="text-[#FC8A06]" />
            <span>Top Rated</span>
          </button>
          <button className="flex items-center gap-1 px-4 py-2 bg-[#FFFFFF10] rounded-full text-white hover:bg-[#FFFFFF20] transition-colors">
            <span>Price Range</span>
            <ChevronRight size={16} className="text-[#83858E]" />
          </button>
        </div>
      </div>

      <div className="text-xs text-[#83858E] mb-6">
        Additional fees may apply.{" "}
        <span className="underline cursor-pointer hover:text-[#FC8A06]">
          Learn more
        </span>
      </div>

      {/* Restaurant Sections */}
      {!loading && Array.isArray(restaurants) && restaurants.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">All Restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r, idx) => (
              <div
                key={idx}
                onClick={() => handleRestaurantClick(r._id)}
                className="bg-[#FFFFFF10] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={r.logo}
                    alt={r.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03081F] to-transparent opacity-60"></div>
                  <button className="absolute top-3 right-3 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={18} className="text-[#FC8A06]" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white">{r.name}</h3>
                    <div className="flex items-center gap-1 bg-[#FC8A06] px-2 py-1 rounded text-xs font-semibold">
                      <Star size={12} className="text-white" />
                      <span>{r.averageRating || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-sm text-[#83858E]">
                    <MapPin size={14} />
                    <span>{r.city}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm text-[#83858E]">
                    <Clock size={14} />
                    <span>{r.deliveryTime || "45 min"}</span>
                  </div>

                  <div className="mt-3 inline-block bg-[#FFFFFF10] px-3 py-1 rounded-full text-xs font-medium">
                    {r.cuisine_type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center p-10">
          <div className="w-16 h-16 border-4 border-[#FC8A06] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#83858E]">
            Finding the best restaurants for you...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-[#FFFFFF10] p-6 rounded-lg text-center my-10">
          <p className="text-red-400 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#FC8A06] text-white px-4 py-2 rounded-lg hover:bg-[#FC8A06]/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && Array.isArray(restaurants) && restaurants.length === 0 && (
        <div className="bg-[#FFFFFF10] p-6 rounded-lg text-center my-10">
          <p className="text-[#83858E] mb-2">
            No restaurants found matching your criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
            }}
            className="bg-[#FC8A06] text-white px-4 py-2 rounded-lg hover:bg-[#FC8A06]/80 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

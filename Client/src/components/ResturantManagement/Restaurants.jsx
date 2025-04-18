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
import axios from "axios";
import restaurantService from "../../services/restaurant-service";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");


  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await restaurantService.getAllRestaurants(searchTerm, selectedCategory);
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

  const handleCategoryClick = (category) => {
    // Toggle category filter
    setSelectedCategory((prev) => (prev === category ? "" : category));
  };
  

  const foodCategories = [
    { name: "Grocery", icon: "🥬" },
    { name: "Pizza", icon: "🍕" },
    { name: "Burgers", icon: "🍔" },
    { name: "Chinese", icon: "📦" },
    { name: "Indian", icon: "🍛" },
    { name: "Convenience", icon: "🥨" },
    { name: "Healthy", icon: "🥗" },
    { name: "Soup", icon: "🍲" },
    { name: "Snacks", icon: "🍿" },
    { name: "Korean", icon: "🍱" },
    { name: "Bubble Tea", icon: "🧋" },
    { name: "Bakery", icon: "🥐" },
    { name: "Asian", icon: "🍜" },
    { name: "Italian", icon: "🍝" },
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
      <div className="relative">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
  {foodCategories.map((category, index) => (
    <div
      key={index}
      onClick={() => handleCategoryClick(category.name)}
      className={`flex flex-col items-center gap-2 min-w-16 cursor-pointer ${
        selectedCategory === category.name ? "text-[#03081F] font-bold" : ""
      }`}
    >
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
        {category.icon}
      </div>
      <span className="text-sm text-center">{category.name}</span>
    </div>
  ))}
</div>
        <button className="absolute right-0 top-8 bg-white shadow-lg rounded-full p-1">
          <ChevronRight size={20} />
        </button>
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

      {/* Promotions */}
      <div className="relative my-6 text-[#03081F]">
        <div className="flex gap-4 overflow-x-auto text-[#03081F]">
          {promos.map((promo, index) => (
            <div
              key={index}
              className={`${promo.color} p-6 rounded-lg min-w-64 flex flex-col justify-between`}
            >
              <div>
                <h3 className="font-bold text-lg mb-1">{promo.title}</h3>
                {promo.description && (
                  <p className="text-sm mb-4">{promo.description}</p>
                )}
              </div>
              {promo.button && (
                <button className="bg-black text-white rounded px-4 py-2 w-24">
                  {promo.button}
                </button>
              )}
              {promo.code && (
                <div className="bg-white rounded px-3 py-2 self-start text-sm">
                  Use {promo.code.includes("CB") ? "Promo " : ""}Code:{" "}
                  {promo.code}
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-1">
          <ChevronLeft size={20} />
        </button>

        <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-1">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="text-xs text-gray-500 mb-6">
        Additional fees may apply. <span className="underline">Learn more</span>
      </div>

      {/* Restaurant Sections */}
      {!loading && restaurants.length > 0 && (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">All Restaurants</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {restaurants.map((r, idx) => (
        <div key={idx} className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold">{r.name}</h3>
          <p className="text-sm text-gray-600">{r.city}</p>
          <p className="text-sm text-gray-600">{r.cuisine_type}</p>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400" />
              <span>{r.rating || 'N/A'}</span>
            </div>
            <div>{r.deliveryTime || '45 min'}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{loading && <p className="text-center my-10">Loading restaurants...</p>}
{!loading && error && <p className="text-center text-red-500 my-10">{error}</p>}

    </div>
  );
}

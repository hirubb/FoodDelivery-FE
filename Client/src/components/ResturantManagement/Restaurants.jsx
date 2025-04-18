
import { ChevronRight, ChevronLeft, Heart, Search, MapPin, Clock, Star } from 'lucide-react';

export default function Restaurants() {
  
  
  const foodCategories = [
    { name: 'Grocery', icon: '🥬' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Burgers', icon: '🍔' },
    { name: 'Chinese', icon: '📦' },
    { name: 'Indian', icon: '🍛' },
    { name: 'Convenience', icon: '🥨' },
    { name: 'Healthy', icon: '🥗' },
    { name: 'Soup', icon: '🍲' },
    { name: 'Snacks', icon: '🍿' },
    { name: 'Korean', icon: '🍱' },
    { name: 'Bubble Tea', icon: '🧋' },
    { name: 'Bakery', icon: '🥐' },
    { name: 'Asian', icon: '🍜' },
    { name: 'Italian', icon: '🍝' },
  ];

  const promos = [
    { 
      title: "Try Uber One free for 1 month", 
      button: "Join now",
      color: "bg-amber-50"
    },
    { 
      title: "40% Off for New Users*", 
      description: "Valid on your first 2 orders above Rs.1,000 from selected",
      code: "UBEREATSSL",
      color: "bg-green-500"
    },
    { 
      title: "65% Off for New Users with Commercial Bank", 
      description: "Valid on the first 2 orders until 30 April*",
      code: "CB650",
      color: "bg-gray-100"
    }
  ];

  const localGems = [
    {
      name: "Nihal Family Restaurant",
      rating: 4.5,
      reviews: 23,
      deliveryFee: 6.99,
      time: "55 min"
    },
    {
      name: "My Burger Thihariya",
      rating: 4.6,
      reviews: 38,
      deliveryFee: 6.99,
      time: "55 min"
    },
    {
      name: "D Lounge Cafe and Restaurant",
      rating: 3.8,
      reviews: 17,
      deliveryFee: 6.99,
      time: "50 min"
    },
    {
      name: "New Apple Green Hotel and foos",
      rating: 4.2,
      reviews: 45,
      deliveryFee: 6.99,
      time: "45 min"
    }
  ];

  const pastaOptions = [
    {
      name: "Ben Foods",
      rating: 4.3,
      reviews: 91,
      deliveryFee: 5.99,
      time: "35 min"
    },
    {
      name: "Keells Mirisiwatta",
      rating: 4.7,
      reviews: 210,
      deliveryFee: 4.99,
      time: "40 min"
    },
    {
      name: "Grand Star Restaurant",
      rating: 4.4,
      reviews: 126,
      deliveryFee: 7.99,
      time: "60 min"
    },
    {
      name: "Solo Bowl",
      rating: 4.8,
      reviews: 75,
      deliveryFee: 8.99,
      time: "45 min"
    }
  ];

  const sections = [
    {
      title: "Local gems",
      subtitle: "Now on Uber Eats",
      restaurants: localGems
    },
    {
      title: "Pasta for you",
      restaurants: pastaOptions
    }
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
            className="bg-gray-100 w-full pl-10 pr-4 py-2 rounded-full focus:outline-none"
          />
        </div>
      </header>

      {/* Food Categories */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {foodCategories.map((category, index) => (
            <div key={index} className="flex flex-col items-center gap-2 min-w-16">
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
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full">
          <span>Offers</span>
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full">
          <span>Delivery fee</span>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
        <button className="px-4 py-2 bg-gray-100 rounded-full">
          Under 30 min
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full">
          <Star size={16} />
          <span>Highest rated</span>
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full">
          <span>Rating</span>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full">
          <span>Price</span>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full">
          <span>Dietary</span>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full">
          <span>Sort</span>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Promotions */}
      <div className="relative my-6">
        <div className="flex gap-4 overflow-x-auto">
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
                  Use {promo.code.includes("CB") ? "Promo " : ""}Code: {promo.code}
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
      {sections.map((section, index) => (
        <div key={index} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">{section.title}</h2>
              {section.subtitle && <p className="text-gray-500">{section.subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">See all</span>
              <div className="flex">
                <button className="p-1 bg-gray-100 rounded-full">
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1 bg-gray-100 rounded-full ml-1">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {section.restaurants.map((restaurant, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden relative">
                <div className="h-40 bg-gray-200"></div>
                <button className="absolute top-2 right-2 bg-white p-1 rounded-full">
                  <Heart size={20} />
                </button>
                <div className="p-3">
                  <h3 className="font-medium mb-2">{restaurant.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <div className="bg-gray-200 rounded-full px-2 py-1 flex items-center gap-1">
                      <Star size={14} className="fill-current" />
                      <span>{restaurant.rating}</span>
                    </div>
                    <span className="text-gray-500">({restaurant.reviews})</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500">{restaurant.time}</span>
                  </div>
                  <div className="mt-2 text-sm flex items-center gap-1">
                    <span>${restaurant.deliveryFee.toFixed(2)} Delivery Fee</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
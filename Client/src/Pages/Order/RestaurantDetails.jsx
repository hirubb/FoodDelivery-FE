import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantDetails = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  // Function to handle adding items to cart
  const addToCart = (item, size) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.prices[size],
      size: size,
      quantity: 1
    };
    
    setCart([...cart, cartItem]);
    // Show a brief success message (you can implement a toast notification here)
    alert(`Added ${item.name} (${size}) to cart`);
  };

  // Function to navigate to cart
  const goToCart = () => {
    navigate('/cart');
  };

  // Mock data for the restaurant
  const restaurant = {
    name: 'Chinese Dragon Cafe',
    rating: 4.6,
    reviews: '40,000+',
    deliveryFee: '64.00 LKR',
    categories: ['Bakery', 'Desserts', 'Cakes'],
    address: '202 Galle Rd, Colombo, Sri Lanka, 06',
    openUntil: '10:00 PM',
    menuCategories: [
      { id: 'pizza', name: 'Pizza', image: '🍕' },
      { id: 'desserts', name: 'Desserts', image: '🍰' },
      { id: 'burgers', name: 'Burgers', image: '🍔' },
      { id: 'healthy', name: 'Healthy', image: '🥗' },
      { id: 'bakery', name: 'Bakery', image: '🥖' },
      { id: 'japanese', name: 'Japanese', image: '🍱' },
      { id: 'indian', name: 'Indian', image: '🍛' },
      { id: 'chinese', name: 'Chinese', image: '🥢' },
    ],
    menuItems: [
      {
        id: 1,
        name: 'Farm House Xtreme Pizza',
        description: '1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks',
        prices: {
          small: 23.50,
          medium: 25.50,
          large: 27.50,
          xlarge: 32.50
        },
        image: '🍕',
        category: 'pizza'
      },
      {
        id: 2,
        name: 'Deluxe Pizza',
        description: '1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks',
        prices: {
          small: 23.50,
          medium: 25.50,
          large: 27.50,
          xlarge: 32.50
        },
        image: '🍕',
        category: 'pizza'
      },
      {
        id: 3,
        name: 'Tandoori Pizza',
        description: '1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks',
        prices: {
          small: 23.50,
          medium: 25.50,
          large: 27.50,
          xlarge: 32.50
        },
        image: '🍕',
        category: 'pizza'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#03081F] mt-48">
      {/* Restaurant Header */}
      <div className="relative h-[450px] bg-black">
        <img
          src="/src/assets/Cafe.png"
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-[#03081F] via-[#03081F]/60 to-transparent">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-4">{restaurant.name}</h1>
            <div className="flex items-center text-white gap-3 mb-3">
              <span className="flex items-center gap-1">⭐ {restaurant.rating}</span>
              <span>•</span>
              <span>{restaurant.reviews} reviews</span>
              <span>•</span>
              <span>{restaurant.deliveryFee}</span>
            </div>
            <div className="flex items-center text-white gap-3 text-lg">
              <span>{restaurant.categories.join(' • ')}</span>
            </div>
            <p className="text-gray-200 mt-3 text-lg">{restaurant.address}</p>
            <div className="mt-4 inline-block bg-[#FC8A06] text-white px-4 py-2 rounded-full text-base">
              Open until {restaurant.openUntil}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Menu</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {restaurant.menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex flex-col items-center p-4 rounded-lg min-w-[100px] ${
                selectedCategory === category.id ? 'bg-[#FC8A06] text-white' : 'bg-[#03081F] text-white hover:bg-gray-900 border border-gray-800'
              }`}
            >
              <span className="text-2xl mb-2">{category.image}</span>
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="mt-8 grid gap-6">
          {restaurant.menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#03081F] rounded-xl shadow-lg p-6 flex justify-between items-start border border-gray-800"
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                <p className="text-gray-400 mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(item.prices).map(([size, price]) => (
                    <div key={size} className="flex items-center gap-2">
                      <div className="text-center">
                        <div className="font-medium text-white">{size.charAt(0).toUpperCase() + size.slice(1)}</div>
                        <div className="text-[#FC8A06]">{price.toFixed(2)} LKR</div>
                      </div>
                      <button
                        onClick={() => addToCart(item, size)}
                        className="ml-2 bg-[#FC8A06] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-white hover:text-[#03081F] transition-all duration-300"
                      >
                        <span className="text-xl">+</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ml-6 text-6xl">{item.image}</div>
            </div>
          ))}
        </div>

        {/* Cart Preview */}
        {cart.length > 0 && (
          <button
            onClick={goToCart}
            className="fixed bottom-8 right-8 bg-[#FC8A06] text-white px-8 py-4 rounded-xl shadow-xl hover:bg-white hover:text-[#03081F] transition-all duration-300 border-2 border-[#FC8A06]"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="text-2xl">🛒</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-lg font-semibold">View Cart</span>
                <span className="text-sm opacity-90">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails; 
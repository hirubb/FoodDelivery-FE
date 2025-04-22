import React, { useEffect, useState } from 'react';
import RestaurantService from '../../services/restaurant-service';

function HighestRatings() {
  const [topRestaurants, setTopRestaurants] = useState([]);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await RestaurantService.getTopRatedRestaurants();
        console.log("res : ", res);
        
        setTopRestaurants(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch top-rated restaurants:", error);
      }
    };

    fetchTopRated();
  }, []);

  return (
    <div className="-mt-4 px-16 text-white text-xl">
      <div>
        <div className="text-white text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">🍽️</span>
          Highest Ratings
        </div>

        {/* Grid layout for the cards */}
        <div className="grid grid-cols-6 gap-4 overflow-x-hidden">
          {topRestaurants.map((restaurant, index) => (
            <div 
              key={index} 
              className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <img 
                src={restaurant.logo} 
                alt={restaurant.name} 
                className="w-full h-48 object-cover"
              />
              
              <div className="p-3">
                <h3 className="text-white font-semibold mb-1">
                  {restaurant.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {restaurant.cuisine_type || 'Various cuisines'}
                </p>
                <p className="text-yellow-400 text-sm font-medium">
                  ⭐ {restaurant.averageRating?.toFixed(1) || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HighestRatings;

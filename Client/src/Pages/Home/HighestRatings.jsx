import React, { useEffect, useState } from 'react';
import RestaurantService from '../../services/restaurant-service';
import { useNavigate } from "react-router-dom";
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

function HighestRatings() {
  const [topRestaurants, setTopRestaurants] = useState([]);
  const navigate = useNavigate();

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

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="-mt-4 px-16 text-white text-xl">
      <div>
        <div className="text-white text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">🍽️</span>
          Highest Ratings
        </div>

        {/* Grid layout for the cards */}
        <div className="grid grid-cols-6 gap-4 overflow-x-hidden">
          {topRestaurants.map((r, idx) => (
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
    </div>
  );
}

export default HighestRatings;

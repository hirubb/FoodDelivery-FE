import React, { useEffect, useState } from 'react';
import OffersService from '../../services/offers-service';

function Deals({ nextSectionRef }) {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchRestaurantOffers = async () => {
      try {
        const response = await OffersService.getRestaurantOffers();
        console.log("offers : ", response.data.data);
        if (response.data.success) {
          setDeals(response.data.data); // Set the offers in state
        } else {
          console.error('Failed to fetch restaurant offers');
        }
      } catch (error) {
        console.error('Error fetching restaurant offers:', error);
      }
    };

    fetchRestaurantOffers();
  }, []);

  return (
    <div ref={nextSectionRef} className="min-h-screen mt-16 px-16 py-48 text-white text-xl">
      <div>
        <div className="text-white text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">🍽️</span>
          Up to -40% 🇱🇰 AMBULA Lk exclusive deals
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-9">
          {deals.map((deal, index) => (
            <div 
              key={index} 
              className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg transition hover:scale-105 duration-300"
            >
              {/* Optional discount badge, you can calculate from title or offer type if available */}
              <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded-full text-md z-10">
                <span>code : </span>
                {deal.code}
              </div>

              <img 
                src={deal.restaurant?.logo || "/default-image.jpg"} 
                alt={deal.restaurantOwner?.first_name} 
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {deal.title}
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  {deal.description}
                </p>
                
                <p className="text-gray-400 text-sm">
                  Valid until: {new Date(deal.validUntil).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Deals;

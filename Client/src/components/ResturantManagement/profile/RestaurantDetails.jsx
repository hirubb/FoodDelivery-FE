import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import restaurantService from '../../../services/restaurant-service';

function RestaurantDetails() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantService.getMyRestaurants();
        setRestaurants(response.data.restaurants || []);
      } catch (err) {
        setError('Failed to fetch restaurant details');
        console.error(err);
      }
    };

    fetchRestaurants();
  }, []);

  if (error) {
    return (
      <div className="text-red-600 text-center mt-10 text-lg font-semibold">
        {error}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        You haven't added any restaurants yet.
        <div className="mt-4">
          <button
            onClick={() => navigate('/restaurant-register')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
          >
            Add New Restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-900">My Restaurants</h2>
        <button
          onClick={() => navigate('/restaurant-register')}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded shadow"
        >
          + Add New Restaurant
        </button>
      </div>

      <div className="space-y-6">
        {restaurants.map((restaurant) => (
         <div
         key={restaurant._id}
         className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
       >
         {/* Banner image */}
         <div className="relative">
           <img
             src={restaurant.banner_image || '/default-banner.jpg'}
             alt="Banner"
             className="w-full h-40 object-cover"
           />
           {/* Logo/avatar image */}
           <div className="absolute -bottom-10 left-6">
             <img
               src={restaurant.logo || '/default-logo.png'}
               alt="Logo"
               className="w-20 h-20 rounded-full border-4 border-white object-cover"
             />
           </div>
         </div>
       
         <div className="pt-12 px-6 pb-6">
           {/* Header */}
           <div className="flex justify-between items-start md:items-center mb-4 gap-4 flex-col md:flex-row">
             <div>
               <h3 className="text-2xl font-bold text-gray-800">{restaurant.name}</h3>
               <p className="text-sm text-gray-500">{restaurant.address}, {restaurant.city}, {restaurant.country}</p>
             </div>
             <div className="flex gap-2">
               <button
                 onClick={() => navigate(`/restaurant/menu/${restaurant._id}`)}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
               >
                 Show Menu
               </button>
               <button
                 onClick={() => navigate(`/restaurant/menu/create/${restaurant._id}`)}
                 className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
               >
                 Add Menu
               </button>
               <button
                 onClick={() => navigate(`/restaurant/offers/${restaurant._id}`)}
                 className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded"
               >
                 Offers
               </button>
             </div>
           </div>
       
           {/* Details grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-sm text-gray-700">
             <div><span className="font-medium">Email:</span> {restaurant.email}</div>
             <div><span className="font-medium">Phone:</span> {restaurant.phone}</div>
             <div><span className="font-medium">Cuisine:</span> {restaurant.cuisine_type}</div>
             <div><span className="font-medium">Rating:</span> {restaurant.averageRating ?? 'N/A'}</div>
             <div><span className="font-medium">Status:</span> <span className="capitalize">{restaurant.status}</span></div>
           </div>
         </div>
       </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantDetails;

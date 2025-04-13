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
        console.log("Fetched Restaurant Data:", response);
        setRestaurants(response.data.restaurants || []);
      } catch (err) {
        setError('Failed to fetch restaurant details');
        console.error(err);
      }
    };

    fetchRestaurants();
  }, []);

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  if (restaurants.length === 0) {
    return <div className="p-4">No restaurants found.</div>;
  }

  return (
    <div className="p-6 bg-blue-900 rounded shadow-md max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">My Restaurants</h2>
        <button
          onClick={() => navigate('/restaurant-register')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Add New Restaurant
        </button>
      </div>

      {restaurants.map((restaurant) => (
        <div
          key={restaurant._id}
          className="mb-6 border border-gray-300 rounded-lg p-4 shadow-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{restaurant.name}</h3>
            <button
              onClick={() => navigate(`/restaurant/menu/${restaurant._id}`)}
              className="bg-blue-500 hover:bg-blue-950 text-white px-4 py-2 rounded"
            >
              Show Menu
            </button>
            <button
              onClick={() => navigate(`/restaurant/menu/create/${restaurant._id}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Menu
            </button>
          </div>

          <table className="table-auto w-full text-sm">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-medium">Email</td>
                <td className="border px-4 py-2">{restaurant.email}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Phone</td>
                <td className="border px-4 py-2">{restaurant.phone}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Address</td>
                <td className="border px-4 py-2">{restaurant.address}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">City</td>
                <td className="border px-4 py-2">{restaurant.city}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Country</td>
                <td className="border px-4 py-2">{restaurant.country}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Cuisine</td>
                <td className="border px-4 py-2">{restaurant.cuisine_type}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Rating</td>
                <td className="border px-4 py-2">{restaurant.rating}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Status</td>
                <td className="border px-4 py-2 capitalize">{restaurant.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default RestaurantDetails;

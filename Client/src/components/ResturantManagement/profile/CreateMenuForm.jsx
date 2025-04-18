// CreateMenuForm.jsx
import React, { useState, useEffect } from 'react';
import restaurantService from '../../../services/restaurant-service';

function CreateMenuForm({onRestaurantSelect}) {
  const [formData, setFormData] = useState({
    restaurant_id: '',
    name: '',
    description: ''
  });
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantService.getMyRestaurants();
        const restaurantList = response.data.restaurants;
        setRestaurants(restaurantList);

        // Set default restaurant if available
        if (restaurantList.length > 0) {
          const firstId = restaurantList[0]._id;
          setFormData(prev => ({ ...prev, restaurant_id: firstId }));
          onRestaurantSelect(firstId); // Pass the default to parent
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, [onRestaurantSelect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'restaurant_id') {
      onRestaurantSelect(value); // Notify parent when selection changes
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await restaurantService.AddMenu(formData)
      
      setFormData({
        restaurant_id: formData.restaurant_id,
        name: '',
        description: ''
      });
      
      setMessage({ 
        text: 'Menu created successfully!', 
        type: 'success' 
      });
      
      // Emit event for menu creation
      const event = new CustomEvent('menuCreated', { detail: response.data });
      window.dispatchEvent(event);
    } catch (error) {
      setMessage({ 
        text: `Error: ${error.response?.data?.error || 'Failed to create menu'}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Create New Menu</h2>
      </div>
      
      <div className="p-6">
        {message.text && (
          <div className={`mb-4 p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant
            </label>
            <select
              name="restaurant_id"
              value={formData.restaurant_id}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            >
              {restaurants.length === 0 && (
                <option value="">No restaurants available</option>
              )}
              {restaurants.map(restaurant => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Menu Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="e.g., Dinner Menu, Lunch Specials"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Describe your menu..."
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Menu...
              </>
            ) : 'Create Menu'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateMenuForm;
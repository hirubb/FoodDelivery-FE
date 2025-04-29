// CreateMenuForm.jsx
import React, { useState, useEffect } from 'react';
import restaurantService from '../../../services/restaurant-service';
import { useParams } from 'react-router-dom';

function CreateMenuForm({ onRestaurantSelect }) {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    restaurant_id: id,
    name: '',
    description: ''
  });
  console.log("restaurant id : ",id)
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [fetchingRestaurants, setFetchingRestaurants] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setFetchingRestaurants(true);
      try {
        const response = await restaurantService.getRestaurantById(id);
        const restaurant = response.data.data; // this is the single restaurant object
        
        if (restaurant) {
          setRestaurants([restaurant]); // wrap in an array
          setFormData(prev => ({ ...prev, restaurant_id: restaurant._id }));
          onRestaurantSelect(restaurant._id);
        } else {
          setMessage({
            text: 'Restaurant not found. Please create one before adding menus.',
            type: 'info'
          });
        }
      } catch (error) {
        setMessage({
          text: 'Unable to load the restaurant. Please try again later.',
          type: 'error'
        });
        console.error('Error fetching restaurant by ID:', error);
      } finally {
        setFetchingRestaurants(false);
      }
    };
  
    fetchRestaurants();
  }, [id, onRestaurantSelect]);

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
      const response = await restaurantService.AddMenu(formData);
      
      setFormData({
        restaurant_id: formData.restaurant_id,
        name: '',
        description: ''
      });
      
      setMessage({ 
        text: '✅ Menu created successfully! You can now add items to this menu.',
        type: 'success' 
      });
      
      // Emit event for menu creation
      const event = new CustomEvent('menuCreated', { detail: response.data });
      window.dispatchEvent(event);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to create menu';
      setMessage({ 
        text: `❌ ${errorMsg}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
      // Only clear success messages automatically
      if (message.type === 'success') {
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    }
  };

  // Helper function to generate message style classes
  const getMessageClasses = (type) => {
    switch(type) {
      case 'success':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Create New Menu</h2>
        <p className="text-blue-100 text-sm mt-1">
          Create a menu for your restaurant to organize your food items
        </p>
      </div>
      
      <div className="p-6">
        {message.text && (
          <div className={`mb-4 p-3 rounded-md ${getMessageClasses(message.type)}`}>
            {message.text}
            {message.type === 'error' && (
              <button 
                className="float-right text-red-700 hover:text-red-900" 
                onClick={() => setMessage({ text: '', type: '' })}
              >
                ✕
              </button>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Restaurant <span className="text-red-500">*</span>
            </label>
            {fetchingRestaurants ? (
              <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 text-sm">
                Loading restaurants...
              </div>
            ) : (
              <select
                name="restaurant_id"
                value={formData.restaurant_id}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
                disabled={restaurants.length === 0}
              >
                {restaurants.length === 0 ? (
                  <option value="">No restaurants available</option>
                ) : (
                  <>
                    <option value="" disabled>Choose a restaurant</option>
                    {restaurants.map(restaurant => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            )}
            <p className="text-xs text-gray-500 mt-1">The restaurant this menu belongs to</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Menu Name <span className="text-red-500">*</span>
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
            <p className="text-xs text-gray-500 mt-1">Choose a clear, descriptive name for your menu</p>
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
              placeholder="Describe your menu (optional). For example: 'Our dinner menu is available from 5pm to 10pm'"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Add details about when this menu is available or what it includes</p>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </p>
            <button
              type="submit"
              disabled={loading || restaurants.length === 0}
              className={`flex justify-center items-center py-2 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                (loading || restaurants.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMenuForm;
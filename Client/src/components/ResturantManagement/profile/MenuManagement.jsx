import React, { useState, useEffect } from 'react';
import restaurantService from '../../../services/restaurant-service';

function MenuManagement() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [menus, setMenus] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch restaurants on mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantService.getMyRestaurants();
        const restaurantList = response.data.restaurants;
        setRestaurants(restaurantList);

        if (restaurantList.length > 0) {
          setSelectedRestaurant(restaurantList[0]._id);
        } else {
          setLoading(false);
          setError('No restaurants found. Please create one.');
        }
      } catch (err) {
        setError('Failed to load restaurants.');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Fetch menus when selected restaurant changes
  useEffect(() => {
    if (!selectedRestaurant) return;

    const fetchMenus = async () => {
      setLoading(true);
      try {
        const response = await restaurantService.getMenus(selectedRestaurant);
        setMenus(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load menus.');
        setLoading(false);
      }
    };

    fetchMenus();
  }, [selectedRestaurant]);

  const handleRestaurantChange = (e) => {
    setSelectedRestaurant(e.target.value);
  };

  const getFilteredMenus = () => {
    switch (activeTab) {
      case 'active':
        return menus.filter(menu => menu.status === 'active');
      case 'drafts':
        return menus.filter(menu => menu.status === 'draft');
      default:
        return menus;
    }
  };

  const filteredMenus = getFilteredMenus();

  const allCount = menus.length;
  const activeCount = menus.filter(menu => menu.status === 'active').length;
  const draftCount = menus.filter(menu => menu.status === 'draft').length;

  const selectedRestaurantName = restaurants.find(
    r => r._id === selectedRestaurant
  )?.name;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-1">Manage all your restaurant menus</p>
        </div>

        <button 
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          onClick={() => window.location.href = `/restaurant/menu/create/${selectedRestaurant.id}`}
        >
          <span className="mr-1">+</span> Add New Menu
        </button>
      </div>

      {/* Restaurant Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-full md:w-1/3">
            <label htmlFor="restaurant-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Restaurant
            </label>
            <select
              id="restaurant-select"
              value={selectedRestaurant}
              onChange={handleRestaurantChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={loading || restaurants.length === 0}
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
          </div>

          {selectedRestaurantName && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:flex-1">
              <h3 className="text-blue-800 font-medium">
                Viewing menus for: {selectedRestaurantName}
              </h3>
              <p className="text-blue-600 text-sm">
                {allCount} total menus found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['all', 'active', 'drafts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Menus (
                {tab === 'all'
                  ? allCount
                  : tab === 'active'
                  ? activeCount
                  : draftCount}
              )
            </button>
          ))}
        </nav>
      </div>

      {/* Loading and Error */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}

      {/* Menu List */}
      {!loading && !error && filteredMenus.length === 0 && (
        <div className="text-center text-gray-500 mt-10">No menus found.</div>
      )}

      {!loading && filteredMenus.length > 0 && (
        <div className="grid gap-6">
          {filteredMenus.map(menu => (
            <div key={menu._id} className="bg-white shadow rounded-lg p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{menu.name}</h2>
              <p className="text-gray-600 mb-3">{menu.description}</p>

              {menu.menu_items && menu.menu_items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  {menu.menu_items.map(item => (
                    <div key={item._id} className="border p-4 rounded-md shadow-sm">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-md mb-3"
                      />
                      <h3 className="text-md font-bold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-600">Portion: {item.portion}</p>
                      <p className="text-sm text-gray-600">Category: {item.category}</p>
                      <p className="text-orange-600 font-semibold mt-1">Rs. {item.price}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No items in this menu.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuManagement;

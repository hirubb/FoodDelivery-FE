import { useState, useEffect } from "react";
import restaurantService from '../../../services/restaurant-service';
import offersService from '../../../services/offers-service';

export default function RestaurantOffers() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    description: '',
    validUntil: ''
  });

  // Fetch restaurants on component mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await restaurantService.getMyRestaurants();
        const restaurantList = response.data.restaurants;
        setRestaurants(restaurantList);
        if (restaurantList.length > 0) {
          setSelectedRestaurant(restaurantList[0]._id);
        }
      } catch (err) {
        showNotification("Failed to load restaurants.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Fetch offers when selected restaurant changes
  useEffect(() => {
    if (!selectedRestaurant) return;
    fetchOffers(selectedRestaurant);
  }, [selectedRestaurant]);

  const fetchOffers = async (restaurantId) => {
    setLoading(true);
    try {
      const response = await offersService.getRestaurantOffersById(restaurantId);
      setOffers(response.data.data);
      setError(null);
    } catch (err) {
      showNotification("Failed to load offers.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleRestaurantChange = (e) => {
    setSelectedRestaurant(e.target.value);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      discount: '',
      description: '',
      validUntil: ''
    });
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await offersService.updateRestaurantOffer(formData._id, formData);
        setOffers(offers.map(offer => offer._id === formData._id ? formData : offer));
        showNotification("Offer updated successfully!");
      } else {
        const response = await offersService.createRestaurantOffers({
          type: 'restaurant',
          restaurantId: selectedRestaurant,
          ...formData,
        });
        setOffers([...offers, response.data]);
        showNotification("Offer added successfully!");
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      showNotification("Failed to save offer.", "error");
    }
  };

  const handleEdit = (offer) => {
    // Format date for the input field (YYYY-MM-DD)
    const formattedOffer = {
      ...offer,
      validUntil: offer.validUntil ? new Date(offer.validUntil).toISOString().split('T')[0] : ''
    };
    setFormData(formattedOffer);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await offersService.deleteRestaurantOffer(id);
      setOffers(offers.filter(offer => offer._id !== id));
      showNotification("Offer deleted successfully!");
    } catch (err) {
      showNotification("Failed to delete offer.", "error");
    }
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiration';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const selectedRestaurantName = restaurants.find(r => r._id === selectedRestaurant)?.name;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#FFFFFF08] min-h-screen">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
          notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-[#FC8A06] text-[#03081F]'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="bg-[#ffffff29] rounded-lg shadow-md p-6 mb-6 border border-[#83858E]/20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Restaurant Offers</h1>
            <p className="text-white mt-1">Create and manage special deals for your customers</p>
          </div>

          <button
            className="bg-[#FC8A06] hover:bg-[#FC8A06]/90 text-[#03081F] px-5 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
            onClick={handleAddNew}
            disabled={!selectedRestaurant}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Offer
          </button>
        </div>

        {/* Restaurant Selector */}
        <div className="mb-6">
          <label htmlFor="restaurant-select" className="block text-sm font-medium text-white mb-1">
            Select Restaurant
          </label>
          <select
            id="restaurant-select"
            value={selectedRestaurant}
            onChange={handleRestaurantChange}
            className="w-full md:w-1/2 px-3 py-2 bg-[#ffffff54] border border-[#83858E]/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06] text-white"
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
      </div>

      {/* Offers Display Section */}
      <div className="bg-[#ffffff29] rounded-lg shadow-md p-6 border border-[#83858E]/20">
        {selectedRestaurantName && (
          <div className="mb-6 p-3 bg-[#90e47d77] border-l-4 border-[#03081F] rounded-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#03081F] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-black font-medium">
                Managing offers for: <span className="font-bold">{selectedRestaurantName}</span>
              </span>
            </div>
          </div>
        )}

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">{error}</div>}
        
        {loading ? (
          <div className="text-center py-10">
            <svg className="animate-spin h-10 w-10 text-[#FC8A06] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-[#83858E]">Loading offers...</p>
          </div>
        ) : (
          <>
            {offers.length === 0 ? (
              <div className="text-center py-10 bg-[#83858E]/5 rounded-lg border-2 border-dashed border-[#83858E]/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#83858E] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-[#83858E] font-medium">No offers found for this restaurant</p>
                <button 
                  onClick={handleAddNew}
                  className="mt-3 text-[#FC8A06] hover:text-[#FC8A06]/80 font-medium flex items-center gap-1 mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create your first offer
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map(offer => (
                  <div key={offer._id} className="bg-white border border-[#83858E]/20 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-[#03081F] mb-2">{offer.title}</h2>
                        <span className="bg-[#FC8A06]/10 text-[#FC8A06] text-sm font-medium px-2.5 py-0.5 rounded-full">
                          {offer.discount}% OFF
                        </span>
                      </div>
                      
                      <p className="text-[#83858E] mb-3">{offer.description}</p>
                      
                      <div className="flex items-center text-sm text-[#83858E] mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Valid until: {formatDate(offer.validUntil)}
                      </div>
                      
                      <div className="flex gap-2 pt-3 border-t border-[#83858E]/10">
                        <button
                          className="flex-1 bg-[#03081F]/5 hover:bg-[#03081F]/10 text-[#03081F] py-2 rounded-md text-sm font-medium transition-colors"
                          onClick={() => handleEdit(offer)}
                        >
                          Edit
                        </button>
                        <button
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-md text-sm font-medium transition-colors"
                          onClick={() => handleDelete(offer._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Slide-in Panel */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex justify-end overflow-hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => {
              resetForm();
              setShowForm(false);
            }}
          ></div>

          {/* Sidebar Panel */}
          <div className="relative w-full max-w-md bg-[#03081F] h-full shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editMode ? 'Edit Offer' : 'Create New Offer'}
                </h3>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="text-[#83858E] hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Offer Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Summer Special Discount"
                    className="w-full px-3 py-2 bg-[#03081F] border border-[#83858E]/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Discount Percentage *</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      required
                      min="0"
                      max="100"
                      placeholder="Enter discount percentage"
                      className="w-full pl-3 pr-10 py-2 bg-[#03081F] border border-[#83858E]/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-[#83858E]">%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe your offer details..."
                    className="w-full px-3 py-2 bg-[#03081F] border border-[#83858E]/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Valid Until *</label>
                  <input
                    type="date"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-[#03081F] border border-[#83858E]/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                  />
                  <p className="text-[#83858E] text-xs mt-1">Select the last day the offer will be valid</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#FC8A06] hover:bg-[#FC8A06]/90 text-[#03081F] font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC8A06] transition-colors"
                  >
                    {editMode ? 'Update Offer' : 'Create Offer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                    className="flex-1 bg-transparent border border-[#83858E]/50 hover:bg-[#FFFFFF]/10 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83858E] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
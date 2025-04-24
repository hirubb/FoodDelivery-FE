import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    description: '',
    validUntil: ''
  });

  // Fetch restaurants on component mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantService.getMyRestaurants();
        const restaurantList = response.data.restaurants;
        setRestaurants(restaurantList);
        if (restaurantList.length > 0) {
          setSelectedRestaurant(restaurantList[0]._id);
        }
      } catch (err) {
        setError("Failed to load restaurants.");
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
      setError("Failed to load offers.");
    } finally {
      setLoading(false);
    }
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
        alert("Offer updated successfully!");
      } else {
        const response = await offersService.createRestaurantOffers({
          type: 'restaurant',
          restaurantId: selectedRestaurant,
          ...formData,
        });
        setOffers([...offers, response.data]);
        alert("Offer added successfully!");
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError("Failed to save offer.");
    }
  };

  const handleEdit = (offer) => {
    setFormData(offer);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await offersService.deleteRestaurantOffer(id);
      setOffers(offers.filter(offer => offer._id !== id));
      alert("Offer deleted successfully!");
    } catch (err) {
      setError("Failed to delete offer.");
    }
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const selectedRestaurantName = restaurants.find(r => r._id === selectedRestaurant)?.name;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offer Management</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant offers</p>
        </div>

        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          onClick={handleAddNew}
          disabled={!selectedRestaurant}
        >
          + Add New Offer
        </button>
      </div>

      {/* Restaurant Selector */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <label htmlFor="restaurant-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Restaurant
        </label>
        <select
          id="restaurant-select"
          value={selectedRestaurant}
          onChange={handleRestaurantChange}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
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
        <div className="mb-4 text-blue-800 font-semibold">
          Viewing offers for: {selectedRestaurantName}
        </div>
      )}

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center py-10">Loading offers...</div>
      ) : (
        <>
          {offers.length === 0 ? (
            <p className="text-gray-500">No offers found for this restaurant.</p>
          ) : (
            <div className="grid gap-4">
              {offers.map(offer => (
                <div key={offer._id} className="bg-white shadow p-4 rounded-md">
                  <h2 className="text-xl font-semibold text-gray-800">{offer.title}</h2>
                  <p className="text-gray-600">{offer.description}</p>
                  <p className="text-green-600 font-semibold">Discount: {offer.discount}%</p>
                  <p className="text-sm text-gray-500">Valid Until: {offer.validUntil}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => handleEdit(offer)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => handleDelete(offer._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Form */}
      {showForm && (
  <div className="fixed inset-0 z-40 flex justify-end text-white">
    {/* Overlay */}
    <div
      className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      onClick={() => {
        resetForm();
        setShowForm(false);
      }}
    ></div>

    {/* Sidebar Panel */}
    <div className="relative w-full max-w-md bg-[#03081F] h-full shadow-lg transition-transform transform translate-x-0  duration-1000 ease-in">
      <div className="p-6 overflow-y-auto h-full">
        <h3 className="text-xl font-semibold mb-4">
          {editMode ? 'Edit Offer' : 'Add New Offer'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              required
              min="0"
              max="100"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Valid Until</label>
            <input
              type="date"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="bg-[#FC8A06] text-black px-4 py-2 rounded hover:bg-blue-700"
            >
              {editMode ? 'Update Offer' : 'Create Offer'}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="text-gray-50 hover:underline"
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

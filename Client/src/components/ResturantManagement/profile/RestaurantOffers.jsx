import { useState, useEffect } from "react";
import offersService from '../../../services/offers-service';
import { useParams } from 'react-router-dom';

export default function RestaurantOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { restaurantId } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    description: '',
    validUntil: ''
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await offersService.createRestaurantOffers({
        type: 'restaurant',
        restaurantId: restaurantId,
        ...formData,
      });
      setOffers(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await offersService.updateRestaurantOffer(formData._id, formData);
        setOffers(
          offers.map((offer) =>
            offer._id === formData._id ? formData : offer
          )
        );
        alert("Offer updated successfully!");
      } else {
        const response = await offersService.createRestaurantOffer(formData);
        setOffers([...offers, response.data]);
        alert("Offer added successfully!");
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (offer) => {
    setFormData(offer);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant offer?")) {
      return;
    }

    try {
      const response = await offersService.deleteRestaurantOffer(id);

      if (!response.ok) throw new Error("Failed to delete offer");

      setOffers(offers.filter((offer) => offer.id !== id));
      alert("Offer deleted successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mx-4">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Restaurant Offers</h2>
        <button
          onClick={handleAddNew}
          className="bg-[#FC8A06] hover:bg-[#e67a00] text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 shadow-md"
        >
          <span className="mr-1 font-bold">+</span> Add Offer
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 shadow-sm">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-[#03081F] bg-opacity-5 rounded-lg p-6 mb-6 border border-[#83858E] border-opacity-30 shadow-lg text-[#03081F]">
          <h3 className="text-lg font-semibold mb-4">
            {editMode ? "Edit Offer" : "Add New Offer"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-style"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="input-style"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  required
                  className="input-style"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Valid Until</label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleChange}
                  required
                  className="input-style"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-4 py-2 border border-[#83858E] rounded-md text-[#03081F] hover:bg-[#83858E] hover:bg-opacity-10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#FC8A06] text-white rounded-md hover:bg-[#e67a00]"
              >
                {editMode ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC8A06]"></div>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-[#03081F] bg-opacity-5 rounded-lg p-8 text-center">
          <p className="text-[#83858E]">
            No restaurant offers found. Add your first offer.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-[#03081F]">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Title
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Discount
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Description
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="py-3 px-4 text-right text-sm font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {offers.map((offer) => (
                <tr
                  key={offer.id}
                  className="hover:bg-[#03081F] hover:bg-opacity-5 transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-gray-800">{offer.title}</td>
                  <td className="py-4 px-4 text-sm text-gray-800">{offer.discount}%</td>
                  <td className="py-4 px-4 text-sm text-gray-800">{offer.description}</td>
                  <td className="py-4 px-4 text-sm text-gray-800">{offer.validUntil}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="text-[#FC8A06] hover:text-[#e67a00] font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

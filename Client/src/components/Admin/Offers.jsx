import { useState, useEffect } from "react";
import adminService from "../../services/admin-service";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Modal form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: 0,
    validUntil: "",
    // active: false,
  });
  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getSystemOffers();
      console.log("Response:", response); // Check the structure here
      const data = response.data;
      setOffers(data);
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
      title: "",
      description: "",
      discount: 0,
      validUntil: "",
    });
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        const response = await adminService.updateOffer(formData._id, formData);
        setOffers(
          offers.map((offer) => (offer._id === formData._id ? formData : offer))
        );
        alert("Offer updated successfully!");
      } else {
        const response = await adminService.createSystemOffer(formData);
        const newOffer = response.data;
        setOffers([...offers, newOffer]);
        alert("Offer added successfully!");
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleEdit = (owner) => {
    setFormData(owner);
    setEditMode(true);
    setShowForm(true);
  };
  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this restaurant owner?")
    ) {
      return;
    }

    try {
       await adminService.deleteOffer(id);

      // Update the local state
      setOffers(offers.filter((offer) => offer.id !== id));

      // Show success notification
      alert("offer deleted successfully!");
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
        <h2 className="text-2xl font-bold text-gray-900">System Offers</h2>
        <button
          onClick={handleAddNew}
          className="bg-[#FC8A06] hover:bg-[#e67a00] text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 shadow-md"
        >
          <span className="mr-1 font-bold">+</span> Add Offer
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-[#03081F] bg-opacity-5 rounded-lg p-6 mb-6 border border-[#83858E] border-opacity-30 shadow-lg text-[#03081F]">
          <h3 className="text-lg font-semibold mb-4 text-[#03081F]">
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
                <label className="block text-sm font-medium mb-1">
                  Discount (%)
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Valid Until
                </label>
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
                className="px-4 py-2 border border-[#83858E] rounded-md text-[#03081F] hover:bg-[#83858E] hover:bg-opacity-10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#FC8A06] text-white rounded-md hover:bg-[#e67a00] transition-colors shadow-md"
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
            No system offers found. Add your first offer.
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
                  Code
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
                  <td className="py-4 px-4 text-sm text-gray-800">
                    {offer.title}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-800">
                    {offer.discount}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-800">
                    {offer.description}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-800">
                    {offer.code}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="text-[#FC8A06] hover:text-[#e67a00] transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(offer._id)}
                        className="text-red-600 hover:text-red-800 transition-colors font-medium"
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

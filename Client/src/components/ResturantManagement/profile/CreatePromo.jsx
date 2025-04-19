import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import offersService from '../../../services/offers-service';


function CreatePromo() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    description: '',
    code: '',
    validUntil: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await offersService.createRestaurantOffers({
        type: 'restaurant',
        restaurantId: restaurantId,
        ...formData,
      });

      setSuccess('Offer created successfully!');
      setTimeout(() => navigate('/owner/profile'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create offer');
    }
  };


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Create Restaurant Offer</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Discount</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        

        <div>
          <label className="block font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Promo Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Valid Until</label>
          <input
            type="date"
            name="validUntil"
            value={formData.validUntil}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Create Offer
        </button>
      </form>
    </div>
  );
}

export default CreatePromo;

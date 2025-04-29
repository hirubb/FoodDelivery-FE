import { useState, useEffect } from 'react';
import adminService from '../../services/admin-service';

const ManageRestaurants = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [restaurants, setRestaurants] = useState([]);
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllRestaurants();
      const data = response.data.restaurants.data;

      // Separate active and pending restaurants
      const active = data.filter(res => res.status === 'approved');
      const pending = data.filter(res => res.status === 'pending');

      setRestaurants(active);
      setPendingRestaurants(pending);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleApprove = async (id) => {
    try {
      await adminService.approveRestaurant(id);
      fetchRestaurants(); // Refresh data after approval
    } catch (err) {
      setError('Failed to approve restaurant.');
    }
  };

  const renderTable = (data, isPending = false) => (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-white text-black">
        <thead className="bg-[#03081F]">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase">Name</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase">Cuisine Type</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase">Open Days</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase">Open Hrs</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase">Email</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase">Phone</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase">Street</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase">City</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase">State</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase">Postal Code</th>
            <th className="py-3 px-4 text-right text-sm font-medium text-white uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((owner) => (
            <tr key={owner.id} className="hover:bg-[#03081F] hover:bg-opacity-5">
              <td className="py-4 px-4 text-sm">{owner.name}</td>
              <td className="py-4 px-4 text-sm">{owner.cuisine_type}</td>
              <td className="py-4 px-4 text-sm">{owner.opDays}</td>
              <td className="py-4 px-4 text-sm">{owner.opHrs}</td>
              <td className="py-4 px-4 text-sm">{owner.email}</td>
              <td className="py-4 px-4 text-sm">{owner.phone}</td>
              <td className="py-4 px-4 text-sm">{owner.street}</td>
              <td className="py-4 px-4 text-sm">{owner.city}</td>
              <td className="py-4 px-4 text-sm">{owner.state}</td>
              <td className="py-4 px-4 text-sm">{owner.postal_code}</td>
              <td className="py-4 px-4 text-right">
                  {isPending && (
                <button
                  className="text-green-600 hover:text-green-800"
                  onClick={() => handleApprove(owner._id)}
                >
                  Approve
                </button>
              )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mx-4">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Manage Restaurants</h2>
      </div>

      <div className="flex mb-4 space-x-4">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'active' ? 'bg-[#FC8A06] text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          Active Restaurants
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'pending' ? 'bg-[#FC8A06] text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          Pending Restaurants
        </button>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC8A06]"></div>
        </div>
      ) : (
        <>
          {activeTab === 'active'
  ? (restaurants.length === 0
      ? <p>No active restaurants found.</p>
      : renderTable(restaurants))
  : (pendingRestaurants.length === 0
      ? <p>No pending restaurants found.</p>
      : renderTable(pendingRestaurants, true))}
        </>
      )}
    </div>
  );
};

export default ManageRestaurants;

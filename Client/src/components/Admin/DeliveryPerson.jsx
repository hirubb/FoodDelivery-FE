import { useState, useEffect } from 'react';
import adminService from '../../services/admin-service';

const DeliveryPerson = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeliveryPersons();
  }, []);

  const fetchDeliveryPersons = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllDrivers();
      console.log("response : ", response);
      const users = response.data.drivers.users;
  
      // Flatten each entry to include both user and vehicle details
      const flattened = users.map(entry => ({
        ...entry.user,
        ...entry.vehicle // optional: rename or extract vehicle fields if needed
      }));
  
      setDeliveryPersons(flattened);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery person?')) {
      return;
    }
    
    try {
      const response = await adminService.deleteDeliveryPerson(id);
      
      if (!response.ok) throw new Error('Failed to delete delivery person');
      
      // Update the local state
      setDeliveryPersons(deliveryPersons.filter(person => person.id !== id));
      
      // Show success notification
      alert('Delivery person deleted successfully!');
      
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on_delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mx-4">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Delivery Personnel</h2>
       
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC8A06]"></div>
        </div>
      ) : deliveryPersons.length === 0 ? (
        <div className="bg-[#03081F] bg-opacity-5 rounded-lg p-8 text-center">
          <p className="text-[#83858E]">No delivery personnel found. Add your first delivery person.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-[#03081F]">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">Username</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">Contact</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">Vehicle</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">License</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deliveryPersons.map((person) => (
                <tr key={person} className="hover:bg-[#03081F] hover:bg-opacity-5 transition-colors">
                  <td className="py-4 px-4 text-sm text-gray-800">
                    {person.firstName} {person.lastName}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-800">{person.username}</td>
                  <td className="py-4 px-4 text-sm text-gray-800">
                    <div>{person.email}</div>
                    <div className="text-[#83858E]">{person.phone}</div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-800 capitalize">{person.vehicle_type || 'N/A'}</td>
                  <td className="py-4 px-4 text-sm text-gray-800">{person.license_number || 'N/A'}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(person.status)}`}>
                      {formatStatus(person.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleEdit(person)}
                        className="text-[#FC8A06] hover:text-[#e67a00] transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
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
};

export default DeliveryPerson;
import { useState, useEffect } from 'react';
import adminService from '../../services/admin-service';

const RestaurantOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
 

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const response = await adminService.getRestaurantOwners();
      console.log("restaurant owners : ", response.data.restaurantOwners.users);
      const data = response.data.restaurantOwners.users;
      setOwners(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  

  

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant owner?')) {
      return;
    }
    
    try {
    await adminService.deleteRestaurantOwner(id);
      
      setOwners(owners.filter(owner => owner.id !== id));
      
      // Show success notification
      alert('Owner deleted successfully!');
      
    } catch (err) {
      setError(err.message);
    }
  };

  

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mx-4">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Restaurant Owners</h2>
        
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
      ) : owners.length === 0 ? (
        <div className="bg-[#03081F] bg-opacity-5 rounded-lg p-8 text-center">
          <p className="text-[#83858E]">No restaurant owners found. Add your first owner.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-[#03081F]">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">First Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">Last Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">Username</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white uppercase tracking-wider">Phone</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {owners.map((owner) => (
                <tr key={owner.id} className="hover:bg-[#03081F] hover:bg-opacity-5 transition-colors">
                  <td className="py-4 px-4 text-sm text-gray-800">{owner.first_name}</td>
                  <td className="py-4 px-4 text-sm text-gray-800">{owner.last_name}</td>
                  <td className="py-4 px-4 text-sm text-gray-800">{owner.username}</td>
                  <td className="py-4 px-4 text-sm text-gray-800">{owner.email}</td>
                  <td className="py-4 px-4 text-sm text-gray-800">{owner.phone}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end space-x-3">
                     
                      <button
                        onClick={() => handleDelete(owner._id)}
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

export default RestaurantOwners;
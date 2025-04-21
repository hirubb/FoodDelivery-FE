import { useState, useEffect } from 'react';
import adminService from '../../services/admin-service';

const RestaurantOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      id: '',
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      phone: '',
    });
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        // Update existing owner
        const response = await adminService.updateRestaurantOwner(formData.id, formData);
        
        if (!response.ok) throw new Error('Failed to update restaurant owner');
        
        // Update the local state
        setOwners(owners.map(owner => 
          owner.id === formData.id ? formData : owner
        ));
        
        // Show success notification
        alert('Owner updated successfully!');
      } else {
        // Add new owner
        const response = await adminService.createRestaurantOwner(formData);
        
        if (!response.ok) throw new Error('Failed to add restaurant owner');
        
        const newOwner = response.data;
        
        // Update the local state
        setOwners([...owners, newOwner]);
        
        // Show success notification
        alert('Owner added successfully!');
      }
      
      // Reset form and hide it
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
    if (!window.confirm('Are you sure you want to delete this restaurant owner?')) {
      return;
    }
    
    try {
      const response = await adminService.deleteRestaurantOwner(id);
      
      if (!response.ok) throw new Error('Failed to delete restaurant owner');
      
      // Update the local state
      setOwners(owners.filter(owner => owner.id !== id));
      
      // Show success notification
      alert('Owner deleted successfully!');
      
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
        <h2 className="text-2xl font-bold text-gray-900">Restaurant Owners</h2>
        <button 
          onClick={handleAddNew}
          className="bg-[#FC8A06] hover:bg-[#e67a00] text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 shadow-md"
        >
          <span className="mr-1 font-bold">+</span> Add Owner
        </button>
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

      {showForm && (
        <div className="bg-[#03081F] bg-opacity-5 rounded-lg p-6 mb-6 border border-[#83858E] border-opacity-30 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-[#03081F]">{editMode ? 'Edit Owner' : 'Add New Owner'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#03081F] mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full border border-[#83858E] border-opacity-50 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#03081F] mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full border border-[#83858E] border-opacity-50 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#03081F] mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-[#83858E] border-opacity-50 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#03081F] mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-[#83858E] border-opacity-50 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#03081F] mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-[#83858E] border-opacity-50 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-transparent"
                  required
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
                {editMode ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
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
                        onClick={() => handleEdit(owner)}
                        className="text-[#FC8A06] hover:text-[#e67a00] transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(owner.id)}
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
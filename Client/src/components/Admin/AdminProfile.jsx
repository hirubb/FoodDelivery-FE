import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/admin-service';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    gender: "",
    age: "",
  });

  const openEditModal = () => {
    setFormData({
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      username: admin.username,
      phone: admin.phone,
      password: "",
      gender: admin.gender || "",
      age: admin.age || "",
    });
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await adminService.updateAdmin(admin._id, formData);
      setAdmin(response.data.admin);
      setShowEditModal(false);
    } catch (err) {
      setError('Update failed. Try again.');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await adminService.getAdminProfile();
        setAdmin(response.data.admin);
      } catch (err) {
        setError("Failed to load admin profile.");
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!admin) {
    return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gray-900 text-white p-6 flex items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-500">
            <img
              src={admin.profile_image || "/api/placeholder/200/200"}
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="ml-6 ">
          <h1 className="text-2xl font-bold">{admin.first_name} {admin.last_name}</h1>
          <p className="text-gray-300">Admin ID: {admin._id}</p>
          <div className="flex items-center mt-2">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Active</span>
          </div>
          <button 
            className="mt-4 px-4 py-2 flex items-center bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
            onClick={openEditModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-black ">
        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">First Name</p>
              <p className="font-medium">{admin.first_name}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Last Name</p>
              <p className="font-medium">{admin.last_name}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{admin.email}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-medium">{admin.phone}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Additional Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">Username</p>
              <p className="font-medium">@{admin.username}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Password</p>
              <p className="font-medium">••••••••••</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <p className="font-medium">{admin.role || "Admin"}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Admin Access</p>
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex items-center">
                  <div className="p-1 bg-blue-100 rounded-md mr-3">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Access Level: {admin.access_level || "Full"}</p>
                    <p className="text-sm text-blue-500">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold text-orange-500 mb-4">Edit Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">First Name</label>
                <input
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Last Name</label>
                <input
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Username</label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
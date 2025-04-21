import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/admin-service';
 // Replace with a proper fallback if needed

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
  });

  const openEditModal = () => {
    setFormData({
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      username: admin.username,
      phone: admin.phone,
      password: "",
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
    <div className="max-w-xl w-full mx-auto mt-20 mb-16 px-6 py-8 bg-white shadow-lg rounded-2xl">
      <h1 className="text-center text-3xl font-extrabold text-[#FC8A06] mb-8">
        Admin Profile
      </h1>

      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FC8A06]">
          <img
            src={admin.profile_image}
            alt="Admin"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          {admin.first_name} {admin.last_name}
        </h2>
        <p className="text-[#FC8A06] text-md mb-4">@{admin.username}</p>

        <div className="text-gray-700 w-full mt-4">
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">Email:</span>
            <span>{admin.email}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">Phone:</span>
            <span>{admin.phone}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">Role:</span>
            <span>{admin.role || "Admin"}</span>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            className="px-6 py-2 bg-[#FC8A06] text-white font-semibold rounded-md hover:bg-[#e27600] transition"
            onClick={openEditModal}
          >
            Edit Profile
          </button>
          <button
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
            onClick={() => {
              // Add your logout logic here
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-lg shadow-xl">
            <h2 className="text-xl font-bold text-[#FC8A06] mb-4">Edit Profile</h2>

            <div className="space-y-3">
              {["first_name", "last_name", "email", "username", "phone", "password"].map((field) => (
                <input
                  key={field}
                  name={field}
                  type={field === "password" ? "password" : "text"}
                  placeholder={field.replace("_", " ").toUpperCase()}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
                />
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#FC8A06] text-white rounded-md hover:bg-[#e27600]"
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

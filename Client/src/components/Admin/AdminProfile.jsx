import React, { useEffect, useState } from 'react';
import adminService from '../../services/admin-service';

function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // Optional
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await adminService.getAdminProfile();
        const adminData = data.data.admin;
        console.log("Admin data: ", adminData);
        setAdmin(adminData);
      } catch (err) {
        console.error("Error fetching admin profile:", err);
        setError('Failed to load admin profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading admin profile...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!admin) {
    return <div className="text-center mt-10 text-gray-500">No admin data found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Admin Profile</h2>
      <div className="space-y-2 text-gray-700">
        <img 
  src={admin.profile_image} 
  alt={admin.name} 
  className="w-32 h-32 rounded-full object-cover mx-auto" 
/>

        <p><span className="font-semibold">Name:</span> {admin.first_name} {admin.last_name}</p>
        <p><span className="font-semibold">Username:</span> {admin.username}</p>
        <p><span className="font-semibold">Email:</span> {admin.email}</p>
        <p><span className="font-semibold">Phone:</span> {admin.phone}</p>
        <p><span className="font-semibold">Role:</span> {admin.role || 'Admin'}</p>
      </div>
    </div>
  );
}

export default AdminProfile;

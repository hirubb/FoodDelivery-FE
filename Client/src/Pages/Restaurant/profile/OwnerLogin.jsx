import React, { useState } from "react";
import restaurantService from '../../../services/restaurant-service';
import { useNavigate } from "react-router-dom";

const OwnerLogin = () => {

  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with", formData);
    restaurantService.login(formData).then((response) => {
        console.log(response);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role);

        //if Admin navigate to /adminDashbaord
        if(response.data.user.role === 'Admin'){
          setTimeout(() => {
            navigate("/admin-dashboard"); // Redirect to homepage (or another page of your choice)
          }, 1000);
        }
        if(response.data.user.role === 'Restaurant Owner'){
          setTimeout(() => {
            navigate("/owner/profile"); // Redirect to homepage (or another page of your choice)
          }, 1000);
        }
    })
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account? <a href="#" className="text-indigo-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default OwnerLogin;

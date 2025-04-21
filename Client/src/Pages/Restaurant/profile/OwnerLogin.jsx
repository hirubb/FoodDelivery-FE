import React, { useState } from "react";
import restaurantService from '../../../services/restaurant-service';

const OwnerLogin = () => {
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
    })
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
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
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
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
            className="w-full px-4 py-2 font-semibold text-white transition bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-500">
          Don’t have an account? <a href="#" className="text-indigo-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default OwnerLogin;

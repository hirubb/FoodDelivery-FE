import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateMenuForm from '../../../components/ResturantManagement/profile/CreateMenuForm';
import CreateMenuItems from '../../../components/ResturantManagement/profile/CreateMenuItems';

function CreateMenu() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  bg-[#03081F] text-white">
      {/* Background image container with overlay */}
      <div className="here relative bg-[url('/images/restaurant-bg.jpg')] bg-cover bg-center bg-no-repeat">
        {/* Overlay to darken background for readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

        {/* Foreground content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-[#FF8A00] text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              ← Back
            </button>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Restaurant Menu Management
            </h1>
            <p className="text-lg text-gray-400">
              Create and manage your restaurant menus and menu items
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-[#0C1A39] p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold text-[#FF8A00] mb-4">Select Restaurant</h2>
              <CreateMenuForm onRestaurantSelect={setSelectedRestaurantId} />
            </div>

            <div className="lg:col-span-2 bg-[#0C1A39] p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold text-[#FF8A00] mb-4">Menu Items</h2>
              <CreateMenuItems restaurantId={selectedRestaurantId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateMenu;

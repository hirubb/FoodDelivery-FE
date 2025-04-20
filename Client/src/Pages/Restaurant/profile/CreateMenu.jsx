import React, { useState } from 'react';
import CreateMenuForm from '../../../components/ResturantManagement/profile/CreateMenuForm';
import CreateMenuItems from '../../../components/ResturantManagement/profile/CreateMenuItems';

function CreateMenu() {
    const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Restaurant Menu Management
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Create and manage your restaurant menus and menu items
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CreateMenuForm onRestaurantSelect={setSelectedRestaurantId} />
          </div>
          <div className="lg:col-span-2">
            <CreateMenuItems restaurantId={selectedRestaurantId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateMenu;
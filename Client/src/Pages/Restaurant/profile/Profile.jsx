import React from 'react';
import OwnerProfileData from '../../../components/ResturantManagement/profile/OwnerProfile';
import RestaurantDetails from '../../../components/ResturantManagement/profile/RestaurantDetails';
import RestaurantOrders from '../../../components/ResturantManagement/profile/RestaurantOrders';

function Profile() {
  return (
    <div className="w-full p-5 my-40">
        <h1 className="text-center text-5xl font-bold mb-8">My Profile</h1>
      <div className="flex gap-5">
   
        <div className="flex w-1/4  bg-[#ffffff72] p-5 rounded-lg shadow-lg">
          <OwnerProfileData />
        </div>
        <div className="flex-1 bg-[#ffffffd0] p-5 rounded-lg shadow-lg">
          <RestaurantDetails />
        </div>
        <div className="flex w-1/6 bg-[#ffffffd0] p-5 rounded-lg shadow-lg">
          <RestaurantOrders />
        </div>
      </div>
    </div>
  );
}

export default Profile;

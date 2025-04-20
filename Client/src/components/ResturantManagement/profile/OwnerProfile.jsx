import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import restaurantService from "../../../services/restaurant-service";
import logo from "../../../assets/ai-generated-8733795_1280.png";

const OwnerProfileData = () => {
  const [ownerData, setOwnerData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await restaurantService.getRestaurantOwner();
        console.log("response in profile: ", response.data);
        setOwnerData(response.data.owner);
      } catch (error) {
        setError("Failed to load profile data.");
      }
    };
    fetchOwnerData();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!ownerData) {
    return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;
  }

  return (
    <div className="max-w-xl w-full mx-auto mt-20 mb-16 px-6 py-8 bg-white shadow-lg rounded-2xl">
      <h1 className="text-center text-3xl font-extrabold text-[#FC8A06] mb-8">My Profile</h1>

      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FC8A06]">
          <img
            src={ownerData.profile_image || logo}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          {ownerData.first_name} {ownerData.last_name}
        </h2>
        <p className="text-[#FC8A06] text-md mb-4">@{ownerData.username}</p>

        <div className="text-gray-700 w-full mt-4">
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">Email:</span>
            <span>{ownerData.email}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">Phone:</span>
            <span>{ownerData.phone}</span>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            className="px-6 py-2 bg-[#FC8A06] text-white font-semibold rounded-md hover:bg-[#e27600] transition"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
          <button
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
            onClick={() => {
              // Add logout logic here
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfileData;

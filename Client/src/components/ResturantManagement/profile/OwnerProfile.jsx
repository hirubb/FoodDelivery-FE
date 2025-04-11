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
        console.log("response : ", response.data)
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
    <div className=" flex-col  mt-100 mb-20 p-8">
      <h1 className="text-center text-2xl font-bold mb-8 text-[#FC8A06]">My Data</h1>

      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#FC8A06]">
        <img
          src={ownerData.profile_image || logo}
        
          className="w-full h-full object-cover"
        />
      </div>

      {/* Owner Information */}
      <h2 className="text-3xl font-bold text-[#FC8A06] mt-4">
        {ownerData.first_name} {ownerData.last_name}
      </h2>
      <p className="text-[#FC8A06] text-lg">@{ownerData.username}</p>

      <div className="mt-6 ">
        <p className="">
          <strong>Email:</strong> {ownerData.email}
        </p>
        <p className="">
          <strong>Phone:</strong> {ownerData.phone}
        </p>
      </div>

      {/* Edit Profile Button */}
      <button
        className="mt-6 px-6 py-2 bg-[#FC8A06] text-white font-bold rounded-md hover:bg-[#E67E22] transition"
        onClick={() => navigate("/edit-profile")}
      >
        Edit Profile
      </button>
      <br></br>
      <button
        className="mt-6 px-6 py-2 bg-red-800 text-white font-bold rounded-md hover:bg-[#E67E22] transition"
        onClick={() => navigate("/edit-profile")}
      >
        Logout
      </button>
    </div>
  );
};

export default OwnerProfileData;

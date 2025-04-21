import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import restaurantService from "../../../services/restaurant-service";
import logo from "../../../assets/ai-generated-8733795_1280.png";

const OwnerProfileData = () => {
  const [ownerData, setOwnerData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
    password: "", // optional
  });

  const openEditModal = () => {
    setFormData({
      first_name: ownerData.first_name,
      last_name: ownerData.last_name,
      email: ownerData.email,
      username: ownerData.username,
      phone: ownerData.phone,
      password: "",
    });
    setShowEditModal(true);
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleUpdate = async () => {
    try {
      console.log("owner id : ", ownerData.id);
      const response = await restaurantService.updateRestaurantOwner(
        ownerData.id,
        formData
      );
      setOwnerData(response.data.owner);
      setShowEditModal(false);
    } catch (error) {
      setError("Update failed. Try again.");
    }
  };

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
    return (
      <p className="text-center mt-10 text-gray-600">Loading profile...</p>
    );
  }

  return (
    <div className="max-w-xl w-full mx-auto mt-20 mb-16 px-6 py-8 bg-white shadow-lg rounded-2xl">
      <h1 className="text-center text-3xl font-extrabold text-[#FC8A06] mb-8">
        My Profile
      </h1>

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
            onClick={openEditModal}
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

export default OwnerProfileData;

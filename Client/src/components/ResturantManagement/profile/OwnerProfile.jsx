import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import restaurantService from "../../../services/restaurant-service";
import logo from "../../../assets/ai-generated-8733795_1280.png";

const OwnerProfileData = () => {
  const [ownerData, setOwnerData] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImg, setProfileImg] = useState(logo);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await restaurantService.getRestaurantOwner();
        const data = response.data.owner;
        setOwnerData(data);
        setProfileImg(data.profile_image || logo);
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          username: data.username,
          phone: data.phone,
          password: "",
        });
      } catch (error) {
        setError("Failed to load profile data.");
      }
    };
    fetchOwnerData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImg(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await restaurantService.updateRestaurantOwner(
        ownerData.id,
        formData
      );
      setOwnerData(response.data.owner);
      setProfileImg(response.data.owner.profile_image || logo);
      setEditMode(false);
    } catch (error) {
      setError("Update failed. Try again.");
    }
  };

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!ownerData) return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-[#0C1A39] to-[#1D2D50] text-white p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row items-center relative z-10">
            <div className="relative mb-6 sm:mb-0 sm:mr-8">
              <div className="h-36 w-36 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 p-1 shadow-2xl">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover border-4 border-white"
                />
              </div>
              {editMode && (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 bg-orange-500 text-white p-2.5 rounded-full hover:bg-orange-600 transition-all shadow-lg"
                  title="Change profile photo"
                >
                  <FaCamera size={18} />
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">
                {ownerData.first_name} {ownerData.last_name}
              </h1>
              <p className="text-gray-300 text-sm mt-1">@{ownerData.username}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {editMode ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="flex items-center px-6 py-2.5 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-all"
                    >
                      <FaSave className="mr-2" /> Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex items-center px-6 py-2.5 bg-white bg-opacity-20 text-white rounded-full text-sm font-semibold hover:bg-opacity-30 transition-all"
                    >
                      <FaTimes className="mr-2" /> Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center px-6 py-2.5 bg-white bg-opacity-20 text-white rounded-full text-sm font-semibold hover:bg-opacity-30 transition-all"
                  >
                    <FaEdit className="mr-2" /> Edit Profile
                  </button>
                )}
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center px-6 py-2.5 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["first_name", "last_name", "email", "username", "phone", "password"].map((field) => (
              <div key={field}>
                <label className="text-gray-700 font-semibold capitalize">
                  {field.replace("_", " ")}
                </label>
                {editMode ? (
                  <input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-600">
                    {field === "password" ? "••••••••" : formData[field]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfileData;

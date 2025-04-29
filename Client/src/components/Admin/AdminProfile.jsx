import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import adminService from "../../services/admin-service";
import defaultProfile from "../../assets/profile_icon.png"; // Use your own default image path

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImg, setProfileImg] = useState(defaultProfile);
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
    const fetchAdmin = async () => {
      try {
        const response = await adminService.getAdminProfile();
        const adminData = response.data.admin;
        console.log("admin  : ", adminData)
        setAdmin(adminData);
        setProfileImg(adminData.profile_image || defaultProfile);

        setFormData({
          first_name: adminData.first_name || "",
          last_name: adminData.last_name || "",
          email: adminData.email || "",
          username: adminData.username || "",
          phone: adminData.phone || "",
          password: "",
        });
      } catch {
        setError("Failed to load admin profile.");
      }
    };
    fetchAdmin();
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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
     
      const response = await adminService.updateAdmin(admin.id, formData);
      setAdmin(response.data.admin);
      setEditMode(false);
    } catch {
      setError("Update failed. Try again.");
    }
  };

  if (error)
    return <p className="text-red-500 text-center mt-10">{error}</p>;

  if (!admin)
    return (
      <p className="text-center mt-10 text-gray-600">Loading profile...</p>
    );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="relative bg-gradient-to-r from-[#0C1A39] to-[#1D2D50] text-white p-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-20 -mb-20" />

          <div className="flex flex-col sm:flex-row items-center relative z-10">
            <div className="relative mb-6 sm:mb-0 sm:mr-8">
              <div className="h-36 w-36 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 p-1 shadow-2xl">
                <img
                  src={profileImg}
                  alt="Admin"
                  className="h-full w-full rounded-full object-cover border-4 border-white"
                />
              </div>
              {editMode && (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 bg-orange-500 text-white p-2.5 rounded-full hover:bg-orange-600 transition"
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
                {admin.first_name} {admin.last_name}
              </h1>
              <p className="text-gray-300 text-sm mt-1">@{admin.username}</p>

              <div className="mt-6 flex flex-wrap gap-4">
                {editMode ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="flex items-center px-6 py-2.5 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 shadow-md"
                    >
                      <FaSave className="mr-2" /> Save
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex items-center px-6 py-2.5 bg-gray-400 text-white rounded-full text-sm font-semibold hover:bg-gray-500 shadow-md"
                    >
                      <FaTimes className="mr-2" /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center px-6 py-2.5 bg-green-500 text-white rounded-full text-sm font-semibold hover:bg-green-600 shadow-md"
                    >
                      <FaEdit className="mr-2" /> Edit Profile
                    </button>
                    <button
                      onClick={() => navigate("/login")}
                      className="flex items-center px-6 py-2.5 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 shadow-md"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["first_name", "last_name", "email", "username", "phone", "password"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {field.replace("_", " ").toUpperCase()}
                </label>
                {editMode ? (
                  <input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field.replace("_", " ").toUpperCase()}
                    className="w-full border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  />
                ) : (
                  <div className="text-gray-800 border-b py-2">
                    {field === "password" ? "********" : admin[field]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

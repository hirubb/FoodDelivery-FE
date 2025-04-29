import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/ai-generated-8733795_1280.png";
import logo1 from "../../../assets/Customer/c1.png";
import customerService from "../../../services/customer-service";

const CustomerProfile = ({ setCustomerData: setDashboardCustomerData }) => {
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
    password: "", // optional
    delivery_address: "",
    city: "",
    postal_code: "",
  });

  const openEditModal = () => {
    setFormData({
      first_name: customerData.first_name || "",
      last_name: customerData.last_name || "",
      email: customerData.email || "",
      username: customerData.username || "",
      phone: customerData.phone || "",
      password: "",
      delivery_address: customerData.delivery_address || "",
      city: customerData.city || "",
      postal_code: customerData.postal_code || "",
    });
    setShowEditModal(true);
    setUpdateSuccess(false);
    setError(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError(null);

    try {
      // Create a clean update object with only the properties that have values
      const updateData = {};
      Object.keys(formData).forEach(key => {
        // Include all fields except empty password
        if (key === 'password' && !formData[key]) {
          return; // Skip empty password
        }
        updateData[key] = formData[key];
      });

      const response = await customerService.updateCustomerProfile(updateData);

      if (response.data && response.data.customer) {
        setCustomerData(response.data.customer);
        if (setDashboardCustomerData) {
          setDashboardCustomerData(response.data.customer);
        }
        setUpdateSuccess(true);
        setTimeout(() => {
          setShowEditModal(false);
          setUpdateSuccess(false);
        }, 1500);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await customerService.getCustomerProfile();

        if (response.data && response.data.customer) {
          setCustomerData(response.data.customer);
          if (setDashboardCustomerData) {
            setDashboardCustomerData(response.data.customer);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load profile data. Please refresh the page.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [navigate, setDashboardCustomerData]);

  if (error && !showEditModal) {
    return <p className="mt-10 text-center text-red-500">{error}</p>;
  }

  if (loading || !customerData) {
    return (
      <p className="mt-10 text-center text-gray-600">Loading profile...</p>
    );
  }

  return (
    <div className="w-full max-w-xl px-6 py-8 mx-auto mt-10 mb-16 bg-white shadow-lg rounded-2xl">
      <h1 className="mb-8 text-3xl font-extrabold text-center text-[#FC8A06]">
        My Profile
      </h1>
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 overflow-hidden border-4 rounded-full border-[#FC8A06]">
          <img
            src={customerData.profile_image || logo1}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          {customerData.first_name} {customerData.last_name}
        </h2>
        <p className="mb-4 text-md text-[#FC8A06]">@{customerData.username}</p>
        <div className="w-full mt-4 text-gray-700">
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Email:</span>
            <span>{customerData.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Phone:</span>
            <span>{customerData.phone}</span>
          </div>
          {customerData.delivery_address && (
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Default Address:</span>
              <span>{customerData.delivery_address}</span>
            </div>
          )}
          {customerData.city && (
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">City:</span>
              <span>{customerData.city}</span>
            </div>
          )}
          {customerData.postal_code && (
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Postal Code:</span>
              <span>{customerData.postal_code}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Member Since:</span>
            <span>{new Date(customerData.createdAt || customerData.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button
            className="px-6 py-2 font-semibold text-white transition rounded-md bg-[#FC8A06] hover:bg-[#e27600]"
            onClick={openEditModal}
          >
            Edit Profile
          </button>
          <button
            className="px-6 py-2 font-semibold text-white transition bg-red-600 rounded-md hover:bg-red-700"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white shadow-xl rounded-2xl w-[90%] max-w-lg">
            <h2 className="mb-4 text-xl font-bold text-[#FC8A06]">Edit Profile</h2>

            {updateSuccess && (
              <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-md">
                Profile updated successfully!
              </div>
            )}

            {error && (
              <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdate}>
              <div className="space-y-3">
                <input
                  name="first_name"
                  type="text"
                  placeholder="FIRST NAME"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
                  required
                />
                <input
                  name="last_name"
                  type="text"
                  placeholder="LAST NAME"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="EMAIL"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
                  required
                />
                <input
                  name="username"
                  type="text"
                  placeholder="USERNAME"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
                  required
                />
                <input
                  name="phone"
                  type="text"
                  placeholder="PHONE"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="PASSWORD (Leave blank to keep unchanged)"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  onClick={() => setShowEditModal(false)}
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-md bg-[#FC8A06] hover:bg-[#e27600] disabled:bg-orange-300"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
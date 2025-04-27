import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaSave } from "react-icons/fa";
import restaurantService from "../../../services/restaurant-service";
import {
  Star,
  MapPin,
  Mail,
  Phone,
  Utensils,
  Edit,
  Trash2,
  Clock,
  Calendar,
  ChevronRight,
  Plus,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { Switch } from "@headlessui/react";

function RestaurantDetails() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editedRestaurant, setEditedRestaurant] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getMyRestaurants();
      setRestaurants(response.data.restaurants || []);
    } catch (err) {
      setError("Failed to fetch restaurant details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (restaurant) => {
    setEditId(restaurant._id);
    setEditedRestaurant({ ...restaurant });
  };

  const cancelEditing = () => {
    setEditId(null);
    setEditedRestaurant({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const saveRestaurant = async () => {
    try {
      await restaurantService.updateRestaurant(editId, editedRestaurant);
      setRestaurants((prev) =>
        prev.map((rest) => (rest._id === editId ? editedRestaurant : rest))
      );
      setEditId(null);
      setEditedRestaurant({});
    } catch (err) {
      console.error("Failed to save restaurant", err);
      alert("Failed to save changes");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-[#83858E]/20 text-[#83858E]";
    }
  };
  const toggleAvailability = async (restaurantId, currentStatus) => {
    try {
      const updatedAvailability = currentStatus === "available" ? false : true; // Toggle between true and false
      const response = await restaurantService.updateAvailability(restaurantId, updatedAvailability);
      setRestaurants((prev) =>
        prev.map((rest) =>
          rest._id === restaurantId ? { ...rest, availability: updatedAvailability } : rest
        )
      );
      console.log(response.data.message); // Optional: Show a success message
    } catch (error) {
      console.error("Failed to update availability", error);
      alert("Failed to update availability");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-[#FC8A06] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-lg flex items-center justify-center gap-3 max-w-2xl mx-auto mt-10">
        <AlertTriangle size={24} />
        <span className="text-lg">{error}</span>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="bg-[#FFFFFF10] rounded-xl border border-[#83858E]/20 p-12 text-center max-w-2xl mx-auto mt-10">
        <div className="bg-[#FFFFFF08] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Utensils size={32} className="text-[#FC8A06]" />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-white">No Restaurants Yet</h3>
        <p className="text-[#83858E] mb-8">
          You haven't added any restaurants to your profile. Get started by
          adding your first restaurant.
        </p>
        <button
          onClick={() => navigate("/restaurant-register")}
          className="bg-[#FC8A06] hover:bg-[#FC8A06]/90 text-white font-medium px-6 py-3 rounded-lg shadow-lg shadow-[#FC8A06]/20 transition-all flex items-center gap-2 mx-auto"
        >
          <Plus size={20} />
          Add Your First Restaurant
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#03081F] min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-col sm:flex-row gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">My Restaurants</h2>
            <p className="text-[#83858E]">
              Manage and monitor all your restaurants in one place
            </p>
          </div>
          <button
            onClick={() => navigate("/restaurant-register")}
            className="bg-[#FC8A06] hover:bg-[#FC8A06]/90 text-white font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-[#FC8A06]/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Restaurant
          </button>
        </div>
        

        <div className="grid grid-cols-1 gap-8">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-[#FFFFFF08] rounded-xl border border-[#83858E]/20 overflow-hidden transition-all hover:border-[#FC8A06]/50 hover:shadow-lg"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#03081F]/80"></div>
                <img
                  src={
                    restaurant.banner_image ||
                    "https://via.placeholder.com/800x300?text=Restaurant+Banner"
                  }
                  alt="Banner"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {editId === restaurant._id ? (
                    <button
                      className="bg-green-500 hover:bg-green-600 p-2 rounded-lg backdrop-blur-sm transition-all"
                      onClick={saveRestaurant}
                    >
                      <FaSave size={18} className="text-white" />
                    </button>
                  ) : (
                    <button
                      className="bg-[#FFFFFF20] hover:bg-[#FFFFFF30] p-2 rounded-lg backdrop-blur-sm transition-all"
                      onClick={() => startEditing(restaurant)}
                    >
                      <FaEdit size={18} className="text-white" />
                    </button>
                  )}
                </div>
                
                <div className="absolute -bottom-10 left-6 rounded-xl overflow-hidden border-4 border-[#03081F] shadow-xl">
                  <img
                    src={
                      restaurant.logo || "https://via.placeholder.com/100?text=Logo"
                    }
                    alt="Logo"
                    className="w-20 h-20 object-cover bg-[#FFFFFF08]"
                  />
                </div>
              </div>
              

              <div className="px-6 pt-14 pb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {editId === restaurant._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editedRestaurant.name}
                          onChange={handleInputChange}
                          className="text-2xl font-bold bg-transparent border-b border-[#FC8A06] text-white outline-none"
                        />
                      ) : (
                        <h3 className="text-2xl font-bold text-white">
                          {restaurant.name}
                        </h3>
                      )}
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(
                          restaurant.status
                        )}`}
                      >
                        {restaurant.status || "Unknown"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-[#83858E] text-sm">
                      <MapPin size={14} />
                      <span>
                        {restaurant.address}, {restaurant.city}, {restaurant.country}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#FFFFFF10] px-3 py-1.5 rounded-lg">
                    <Star size={18} className="text-[#FC8A06]" fill="#FC8A06" />
                    <span className="font-bold text-lg">
                      {restaurant.averageRating || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                <Switch
  checked={restaurant.availability}
  onChange={() =>
    toggleAvailability(restaurant._id, restaurant.availability ? "available" : "unavailable")
  }
  className={`${
    restaurant.availability ? "bg-green-500" : "bg-red-500"
  } relative inline-flex items-center h-6 rounded-full w-11`}
>
  <span className="sr-only">Availability</span>
  <span
    className={`${
      restaurant.availability ? "translate-x-6" : "translate-x-1"
    } inline-block w-4 h-4 transform bg-white rounded-full`}
  />
</Switch>
                  </div>
                

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {editId === restaurant._id ? (
                    <>
                      <EditableDetail
                        label="Cuisine Type"
                        name="cuisine_type"
                        value={editedRestaurant.cuisine_type}
                        onChange={handleInputChange}
                      />
                      <EditableDetail
                        label="Phone"
                        name="phone"
                        value={editedRestaurant.phone}
                        onChange={handleInputChange}
                      />
                      <EditableDetail
                        label="Email"
                        name="email"
                        value={editedRestaurant.email}
                        onChange={handleInputChange}
                      />
                    </>
                  ) : (
                    <>
                      <DetailCard icon={<Utensils />} label="Cuisine Type" value={restaurant.cuisine_type} />
                      <DetailCard icon={<Phone />} label="Contact Phone" value={restaurant.phone} />
                      <DetailCard icon={<Mail />} label="Email Address" value={restaurant.email} />
                    </>
                  )}
                </div>
                

                <div className="bg-[#FFFFFF08] rounded-lg p-5">
                  <h4 className="font-medium text-white text-lg mb-2">
                    Additional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#CCCCCC]">
                    <div>
                      <strong>Operating Hours:</strong>{" "}
                      {restaurant.opHrs || "Not specified"}
                    </div>
                    <div>
                      <strong>Operating Days:</strong>{" "}
                      {restaurant.opDays || "Not specified"}
                    </div>
                    <div>
                      <strong>License:</strong> {restaurant.license || "N/A"}
                    </div>
                    <div>
                      <strong>Postal Code:</strong> {restaurant.postal_code || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reusable Card component
const DetailCard = ({ icon, label, value }) => (
  <div className="bg-[#FFFFFF08] rounded-lg p-4 hover:bg-[#FFFFFF10] transition-colors">
    <div className="flex items-start gap-3">
      <div className="bg-[#FC8A06]/20 p-2 rounded-lg text-[#FC8A06]">{icon}</div>
      <div>
        <div className="text-[#83858E] text-sm mb-1">{label}</div>
        <div className="font-medium text-white">{value || "Not specified"}</div>
      </div>
    </div>
  </div>
);

// Editable fields while editing
const EditableDetail = ({ label, name, value, onChange }) => (
  <div className="bg-[#FFFFFF08] rounded-lg p-4 hover:bg-[#FFFFFF10] transition-colors">
    <div className="flex flex-col">
      <div className="text-[#83858E] text-sm mb-1">{label}</div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="bg-transparent border-b border-[#FC8A06] text-white outline-none"
      />
    </div>
  </div>
);

export default RestaurantDetails;

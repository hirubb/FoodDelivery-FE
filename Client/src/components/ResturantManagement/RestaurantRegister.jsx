import { useState } from "react";
import restaurantService from "../../services/restaurant-service";
import logo from "../../assets/ai-generated-8983262_1280.jpg";
import { useNavigate } from "react-router-dom";

const RestaurantRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Sri Lanka",
    license: "",
    opHrs: "",
    cuisine_type: [],
    logo: null,
    banner_image: null,
    opDays:""
  });
  const sriLankanProvinces = [
    "Central Province",
    "Eastern Province",
    "Northern Province",
    "Southern Province",
    "Western Province",
    "North Western Province",
    "North Central Province",
    "Uva Province",
    "Sabaragamuwa Province",
  ];
  const DateRanges = [
    "Mon - Fri",
    "Sat - Sun",
    "Mon - Sun",
    "Mon - Sat",
    "Sun - Fri",
    "24 x 7 except Poya Days",
  ];
  const provinceCityMap = {
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Eastern Province": ["Trincomalee", "Batticaloa", "Ampara"],
    "Northern Province": [
      "Jaffna",
      "Kilinochchi",
      "Mullaitivu",
      "Mannar",
      "Vavuniya",
    ],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Sabaragamuwa Province": ["Ratnapura", "Kegalle"],
  };

  const [cityList, setCityList] = useState([]);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  

  const cuisineOptions = [
    "Italian",
    "Chinese",
    "Indian",
    "Mexican",
    "French",
    "Korean",
    "American",
    "Japanese",
    "Srilankan",
    "Cafe",
    "Seafood",
    "Others",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "state") {
      const selectedProvince = e.target.value;
      setCityList(provinceCityMap[selectedProvince] || []);
      setFormData({ ...formData, state: selectedProvince, city: "" }); // Reset city
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  

  const handleCuisineChange = (e) => {
    const selected = formData.cuisine_type.includes(e.target.value)
      ? formData.cuisine_type.filter((c) => c !== e.target.value)
      : [...formData.cuisine_type, e.target.value];
    setFormData({ ...formData, cuisine_type: selected });
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: file,
    }));

    if (e.target.name === "logo") {
      setPreviewLogo(URL.createObjectURL(file));
    } else if (e.target.name === "banner_image") {
      setPreviewBanner(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "cuisine_type") {
          formData.cuisine_type.forEach((item) => {
            formDataToSend.append("cuisine_type", item);
          });
        } else if (key === "logo" || key === "banner_image") {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await restaurantService.registerRestaurant(
        formDataToSend
      );

      if (response.status === 201) {
        setSuccess("Restaurant registered successfully!");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (err.response?.data?.message) message = err.response.data.message;
      else if (err.message) message = err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto max-w-6xl mx-auto shadow-lg rounded-lg mt-32 mb-20 bg-white overflow-hidden">
      {/* Left Side Image Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#0B0E22]">
        <img
          src={logo}
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 bg-[#6b6e81]">
        <h2 className="text-3xl text-[#FC8A06] font-bold text-center mb-6">
          Register Your Restaurant
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl text-white font-semibold">
            Restaurant Details
          </h3>
          <input
            type="text"
            name="name"
            placeholder="Restaurant Name"
            onChange={handleChange}
            value={formData.name}
            required
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            value={formData.phone}
            required
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
          />
          <input
            type="text"
            name="license"
            placeholder="License Number"
            onChange={handleChange}
            value={formData.license}
            required
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
          />
          <select
            name="opDays"
            value={formData.opDays}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
          >
            <option value="">Select Open Days</option>
            {DateRanges.map((opDays) => (
              <option key={opDays} value={opDays}>
                {opDays}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="opHrs"
            placeholder="Opening Hours (e.g. 9 AM - 9 PM)"
            onChange={handleChange}
            value={formData.opHrs}
            required
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
          />

          <h3 className="text-xl text-white font-semibold mt-6">
            Address Details
          </h3>

          <input
            type="text"
            name="country"
            placeholder="Country"
            onChange={handleChange}
            value={formData.country}
            readOnly
            required
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
          />

          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
          >
            <option value="">Select Province</option>
            {sriLankanProvinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
          >
            <option value="">Select City</option>
            {cityList.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="street"
            placeholder="Street"
            onChange={handleChange}
            value={formData.street}
            required
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
          />

          <input
            type="text"
            name="postal_code"
            placeholder="Postal Code"
            onChange={handleChange}
            value={formData.postal_code}
            required
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
          />

          <label className="block text-white font-medium mt-4">
            Cuisine Type
          </label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {cuisineOptions.map((cuisine) => (
              <label key={cuisine} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={cuisine}
                  checked={formData.cuisine_type.includes(cuisine)}
                  onChange={handleCuisineChange}
                  className="form-checkbox h-4 w-4 text-[#FC8A06] mr-2"
                />
                <span className="text-white">{cuisine}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="text-white">Logo</label>
            <input
              type="file"
              accept="image/*"
              name="logo"
              onChange={handleFileChange}
              className="w-full p-2 border rounded bg-[#565b6f94]"
            />
            {previewLogo && (
              <img
                src={previewLogo}
                alt="Logo Preview"
                className="w-20 h-20 rounded-full mx-auto mt-2"
              />
            )}
          </div>

          <div>
            <label className="text-white">Banner Image</label>
            <input
              type="file"
              accept="image/*"
              name="banner_image"
              onChange={handleFileChange}
              className="w-full p-2 border rounded bg-[#565b6f94]"
            />
            {previewBanner && (
              <img
                src={previewBanner}
                alt="Banner Preview"
                className="w-full h-32 object-cover mt-2"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#FC8A06] text-white font-bold p-3 rounded-md hover:bg-[#E67E22]"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register ➜"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantRegister;

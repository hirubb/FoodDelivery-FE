import { useState } from "react";
import restaurantService from "../../services/restaurant-service";
import logo from "../../assets/ai-generated-8983262_1280.jpg";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const RestaurantRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    cuisine_type: "",
    logo: null,
    banner_image: null,
  });
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);  
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: file,
      }));
      if (e.target.name === "logo") {
        setPreviewLogo(URL.createObjectURL(file));
      } else {
        setPreviewBanner(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {
      const formDataToSend = new FormData();
  
      // Loop through the formData object and append each field
      Object.keys(formData).forEach((key) => {
        if (key === 'logo' || key === 'banner_image') {
          // Append the file fields if they exist
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else {
          // Append the other fields
          formDataToSend.append(key, formData[key]);
        }
      });
  
      // Send the form data to the backend
      const response = await restaurantService.registerRestaurant(formDataToSend);
  
      if (response.status === 201) {
        setError(null);
        setSuccess("Restaurant registered successfully");
  
        // Redirect to another page after successful registration
        setTimeout(() => {
          navigate("/"); // Redirect to homepage (or another page of your choice)
        }, 1000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
    }
  };
  

  return (
    <div className="flex h-auto w-[50%] mx-auto shadow-lg rounded-lg mt-44 mb-40">
      <div className="w-1/2 hidden lg:flex items-center justify-center bg-[#0B0E22]">
        <img src={logo} alt="Restaurant" className="w-full h-full object-cover" />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center p-12 bg-[#6b6e81]">
        <h2 className="text-3xl text-[#FC8A06] font-bold text-center mb-4">
          Register Your Restaurant
        </h2>

        {error && <p className="text-red-500 text-center mb-6">{error}</p>}
        {success && <p className="text-green-500 text-center mb-6">{success}</p>}

        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Restaurant Name"
            className="w-full p-3 border rounded bg-gray-100"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded bg-gray-100"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="w-full p-3 border rounded bg-gray-100"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="w-full p-3 border rounded bg-gray-100"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            className="w-full p-3 border rounded bg-gray-100"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            className="w-full p-3 border rounded bg-gray-100"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="cuisine_type"
            placeholder="Cuisine Type"
            className="w-full p-3 border rounded bg-gray-100"
            onChange={handleChange}
            required
          />

          <label>Logo</label>
          <input
            type="file"
            accept="image/*"
            name="logo"
            onChange={handleFileChange}
            className="w-full p-2 border rounded bg-[#565b6f94]"
          />
          {previewLogo && (
            <img src={previewLogo} alt="Logo Preview" className="w-20 h-20 rounded-full mx-auto mt-2" />
          )}

          <label>Banner Image</label>
          <input
            type="file"
            accept="image/*"
            name="banner_image"
            onChange={handleFileChange}
            className="w-full p-2 border rounded bg-[#565b6f94]"
          />
          {previewBanner && (
            <img src={previewBanner} alt="Banner Preview" className="w-full h-32 object-cover mt-2" />
          )}

          <button
            type="submit"
            className="w-full bg-[#FC8A06] text-white font-bold p-3 rounded-md hover:bg-[#E67E22] flex items-center justify-center gap-2"
          >
            <span>Register</span>
            ➜
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantRegister;

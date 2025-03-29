import { useState } from "react";
import restaurantService from "../../services/restaurant-service";
import logo from "../../assets/logo-color.png";

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
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await restaurantService.registerRestaurant(formDataToSend);
      if (response.status === 201) {
        setError(null);
        setSuccess("Restaurant registered successfully");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 hidden lg:block">
        <img src={logo} alt="Restaurant" className="w-full h-full object-cover" />
      </div>

      <div className="w-full lg:w-1/2 flex justify-center items-center p-8 bg-[#565b6f94] backdrop-blur-lg">
        <div className="max-w-md w-full bg-[#03081F] p-6 shadow-md rounded-lg">
          <h2 className="text-2xl text-[#FC8A06] font-semibold text-center">
            Register Your Restaurant
          </h2>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {success && <p className="text-green-500 text-center mt-2">{success}</p>}

          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Restaurant Name" className="w-full p-2 border rounded bg-[#565b6f94]" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded bg-[#565b6f94]" onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone" className="w-full p-2 border rounded bg-[#565b6f94]" onChange={handleChange} required />
            <input type="text" name="address" placeholder="Address" className="w-full p-2 border rounded bg-[#565b6f94]" onChange={handleChange} required />
            <input type="text" name="city" placeholder="City" className="w-full p-2 border rounded bg-[#565b6f94]" onChange={handleChange} required />
            <input type="text" name="country" placeholder="Country" className="w-full p-2 border rounded bg-[#565b6f94]" onChange={handleChange} required />
            <input type="text" name="cuisine_type" placeholder="Cuisine Type (e.g., Italian, Chinese)" className="w-full p-2 border rounded bg-[#565b6f94]" onChange={handleChange} required />

            <label>Logo</label>
            <input type="file" accept="image/*" name="logo" onChange={handleFileChange} className="w-full p-2 border rounded bg-[#565b6f94]" />
            {previewLogo && <img src={previewLogo} alt="Logo Preview" className="w-20 h-20 rounded-full mx-auto mt-2" />}

            <label>Banner Image</label>
            <input type="file" accept="image/*" name="banner_image" onChange={handleFileChange} className="w-full p-2 border rounded bg-[#565b6f94]" />
            {previewBanner && <img src={previewBanner} alt="Banner Preview" className="w-full h-32 object-cover mt-2" />}

            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegister;

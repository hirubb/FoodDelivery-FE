import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import restaurantService from "../../services/restaurant-service";
import logo from "../../assets/ai-generated-8733795_1280.png";


const OwnerRegister = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    profile_image: null,
    nic:""
  });

  const [preview, setPreview] = useState(null);
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
        profile_image: file,
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {
      const formDataToSend = new FormData();
  
      // Append all fields, including profile_image
      Object.keys(formData).forEach((key) => {
        // Check if it's the profile image field
        if (key === 'profile_image' && formData[key]) {
          formDataToSend.append(key, formData[key], formData[key].name); 
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
  
      const response = await restaurantService.registerRestaurantOwner(formDataToSend);
  
      if (response.status === 201) {
        setError(null);
        setSuccess("Registration successful");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Error during registration:", error);
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
          SIGN UP
        </h2>
        <p className="text-white text-center mb-6">
          Note that you must be over 18 years old.
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}


          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
          <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="w-full p-3 border rounded bg-gray-100 text-[#03081F]"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="w-full p-3 border rounded bg-gray-100 text-[#03081F]"
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded bg-gray-100 text-[#03081F]"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-3 border rounded bg-gray-100 text-[#03081F]"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded bg-gray-100 text-[#03081F]"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="nic"
            placeholder="NIC / Passport Number"
            className="w-full p-3 border rounded bg-gray-100 text-[#03081F]"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Mobile Number"
            className="w-full p-3 border rounded bg-gray-100 text-[#03081F]"
            onChange={handleChange}
            required
          />

            <label>Profile Image</label>
            <input type="file" accept="image/*" name="profile_image" onChange={handleFileChange} className="w-full p-2 border rounded bg-[#565b6f94]" />
            {preview && <img src={preview} alt="Profile Preview" className="w-20 h-20 rounded-full mx-auto mt-2" />}

            {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#FC8A06] text-white font-bold p-3 rounded-md hover:bg-[#E67E22] flex items-center justify-center gap-2"
          >
            <span>Next Step</span>
            ➜
          </button>
          </form>
        </div>
     </div>
  );
};


export default OwnerRegister;




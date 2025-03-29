import { useState } from "react";
import restaurantOwnerService from "../../services/restaurantOwner-service";
import logo from "../../assets/logo-color.png";

const OwnerRegister = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    profile_image: null,
  });
  const [preview, setPreview] = useState(null);
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
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      console.log("form data : ", formData);

      const response = await restaurantOwnerService.registerRestaurantOwner(formDataToSend);

      if (response.status === 201) {
        setError(null);
        setSuccess("Registration successful");
        console.log("response:", response);
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
            Register as a Restaurant Owner
          </h2>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {success && <p className="text-green-500 text-center mt-2">{success}</p>}

          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <input type="text" name="first_name" placeholder="First Name" className="w-full p-2 border rounded bg-[#565b6f94]" onChange={handleChange} required />
            <input type="text" name="last_name" placeholder="Last Name" className="w-full p-2 border rounded bg-[#565b6f94]" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded bg-[#565b6f94]" onChange={handleChange} required />
            <input type="text" name="username" placeholder="Username" className="w-full p-2 border rounded bg-[#565b6f94]" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded bg-[#565b6f94]" onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone" className="w-full p-2 border rounded bg-[#565b6f94]" onChange={handleChange} required />

            <label>Logo</label>
            <input type="file" accept="image/*" name="profile_image" onChange={handleFileChange} className="w-full p-2 border rounded bg-[#565b6f94]" />
            {preview && <img src={preview} alt="Profile Preview" className="w-20 h-20 rounded-full mx-auto mt-2" />}

            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnerRegister;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { FaMale, FaFemale, FaArrowRight } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { motion } from 'framer-motion';
import DeliveryRiderService from "../../services/DeliveryRider-service";


function DeliverySignUp() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        mobile: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {

            DeliveryRiderService.RegisterDeliveryRider(formData).then((response) => {

                console.log("Registration successful:", response.data);
                localStorage.setItem('token', response.data.token);

            });

            navigate('/DeliveryPersonnel-OptionsSignUp');
        } catch (err) {
            console.error("Registration error:", err);
            setError(
                err.response?.data?.message ||
                err.response?.data?.errors?.[0]?.msg ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800 font-sans">
            {/* Left Section (Illustration) */}
            <div className="md:w-1/2 w-full flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-[#0A1128] to-[#1D2D50] overflow-hidden">
                <div className="max-w-xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Join Our Delivery Team</h1>
                    <div className="w-20 h-1.5 bg-orange-500 rounded-full mb-4"></div>
                    <p className="text-gray-200 text-base md:text-lg mb-6 leading-relaxed">
                        Be part of our growing network of delivery professionals and enjoy flexible hours and competitive pay.
                    </p>



                    {/* Animated Image (Only apply motion here) */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <div className="absolute top-1/4 -left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                        <div className="absolute bottom-1/4 -right-10 w-32 h-32 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                        <img
                            src="/src/assets/DeliveryPerson/DeliverySignUp.png"
                            alt="Delivery professionals"
                            className="w-full max-w-md mx-auto rounded-xl relative z-10"
                        />
                    </motion.div>
                </div>
            </div>




            {/* Right Section (Form) */}
            <div className="md:w-1/2 w-full bg-white text-gray-800 flex flex-col h-screen">
                {/* Top Bar */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 text-center">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-wide">CREATE YOUR ACCOUNT</h2>
                        <p className="text-orange-100 mt-1 text-sm">Complete the form below to start your delivery journey</p>
                    </div>
                </div>

                {/* Scrollable Form Area */}
                <div className="flex-grow overflow-y-auto px-6 md:px-10 py-6">
                    <form className="space-y-5 max-w-2xl mx-auto" onSubmit={handleSubmit}>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-md">
                            <p className="text-sm text-blue-800 font-medium">
                                <span className="font-bold">Note:</span> You must be at least 18 years old to register.
                            </p>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter Your First Name"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter Your Last Name"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* Age & Gender */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-gray-700">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Enter Your Age"
                                    min="18"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-gray-700">Gender</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`flex items-center justify-center gap-2 border ${formData.gender === 'Male' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700'} px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50`}>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Male"
                                            checked={formData.gender === "Male"}
                                            onChange={handleChange}
                                            className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <FaMale className={formData.gender === 'Male' ? 'text-blue-600' : 'text-gray-500'} />
                                        <span className="font-medium">Male</span>
                                    </label>
                                    <label className={`flex items-center justify-center gap-2 border ${formData.gender === 'Female' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700'} px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50`}>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Female"
                                            checked={formData.gender === "Female"}
                                            onChange={handleChange}
                                            className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <FaFemale className={formData.gender === 'Female' ? 'text-blue-600' : 'text-gray-500'} />
                                        <span className="font-medium">Female</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-gray-700">Mobile Number</label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="Enter your mobile number"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email address"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-gray-700">Create Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <AiFillEyeInvisible size={18} /> : <AiFillEye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs font-medium text-gray-500 mt-1.5">Password must be at least 8 characters long</p>
                        </div>

                        <motion.button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg shadow-md inline-flex items-center justify-center gap-2 transition-all duration-200"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            ) : null}
                            Next <FaArrowRight size={16} />
                        </motion.button>

                        <p className="text-sm font-medium text-gray-600 mt-3 text-center">
                            Already have an account?{' '}
                            <a href="/login" className="text-orange-600 hover:text-orange-700 hover:underline font-semibold">Sign in</a>
                        </p>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default DeliverySignUp;

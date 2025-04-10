import React, { useState } from "react";
import { FaMale, FaFemale } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa";

function DeliverySignUp() {
    const [showPassword, setShowPassword] = useState(false);
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
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Form submission logic here
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white text-gray-800 font-sans">
            {/* Left Section (Illustration) */}
            <div className="md:w-1/2 w-full flex items-center justify-center p-10 bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="max-w-xl">
                    <h1 className="text-4xl font-bold text-white mb-6">Join Our Delivery Team</h1>
                    <p className="text-white text-lg mb-8">Be part of our growing network of delivery professionals and enjoy flexible hours, competitive pay, and career growth opportunities.</p>
                    <img
                        src="/src/assets/DeliverySignUp.png"
                        alt="Delivery professionals"
                        className="w-full max-w-lg rounded-lg shadow-2xl"
                    />
                </div>
            </div>

            {/* Right Section (Form) */}
            <div className="md:w-1/2 w-full bg-white text-gray-800 p-0 flex flex-col justify-start shadow-xl">
                {/* Top Bar */}
                <div className="bg-blue-700 text-white text-center py-5">
                    <h2 className="text-2xl font-semibold tracking-wide">CREATE YOUR ACCOUNT</h2>
                    <p className="text-blue-100 mt-1">Start your delivery journey in minutes</p>
                </div>

                <form className="space-y-5 px-10 pt-8 pb-10" onSubmit={handleSubmit}>
                    <p className="text-center text-sm text-gray-600 py-2 mb-2 bg-blue-50 rounded-md">
                        <span className="font-bold text-blue-700">Note:</span> You must be at least 18 years old to register.
                    </p>

                    {/* Name Fields */}
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex-1">
                            <label className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter Your First Name"
                                className="w-full px-4 py-2.5 rounded-md border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter Your Last Name"
                                className="w-full px-4 py-2.5 rounded-md border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Age & Gender */}
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex-1">
                            <label className="block mb-1 text-sm font-medium text-gray-700">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter Your Age"
                                min="18"
                                className="w-full px-4 py-2.5 rounded-md border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 text-sm font-medium text-gray-700">Gender</label>
                            <div className="flex gap-4 mt-1">
                                <label className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-md cursor-pointer hover:bg-gray-50 transition w-full justify-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.gender === "male"}
                                        onChange={handleChange}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <FaMale className="text-blue-600" />
                                    <span>Male</span>
                                </label>
                                <label className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-md cursor-pointer hover:bg-gray-50 transition w-full justify-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.gender === "female"}
                                        onChange={handleChange}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <FaFemale className="text-blue-600" />
                                    <span>Female</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Mobile Number</label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Enter your mobile number"
                            className="w-full px-4 py-2.5 rounded-md border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            className="w-full px-4 py-2.5 rounded-md border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Create Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                className="w-full px-4 py-2.5 pr-10 rounded-md border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                    </div>

                    {/* Terms and Privacy */}
                    <div className="mt-4">
                        <label className="flex items-center">
                            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" required />
                            <span className="ml-2 text-sm text-gray-700">
                                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                            </span>
                        </label>
                    </div>

                    {/* Sign In Link */}
                    <div className="text-center mt-6">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md shadow-md inline-flex items-center justify-center gap-2 transition-colors">
                            Create Account <FaArrowRight size={14} />
                        </button>

                        <p className="text-sm text-gray-600 mt-4">
                            Already have an account?{' '}
                            <a href="#" className="text-blue-600 hover:underline font-medium">Sign in</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DeliverySignUp;

import { useState, useRef } from 'react';
import { FaCamera, FaEdit, FaSave, FaTimes, FaLock, FaIdCard, FaUserCircle, FaExclamationTriangle } from 'react-icons/fa';
import React from 'react';

function ProfileContent() {
    const [editMode, setEditMode] = useState(false);
    const [profileImg, setProfileImg] = useState('https://randomuser.me/api/portraits/men/32.jpg');
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        firstName: 'John',
        lastName: 'Driver',
        age: 30,
        gender: "Male",
        phone: '(555) 123-4567',
        email: 'john.driver@example.com',
        password: 'password123',
        isVerified: true,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImg(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                {/* Profile Header - Enhanced with gradient background */}
                <div className="relative bg-gradient-to-r from-[#0C1A39] to-[#1D2D50] text-white p-8 sm:p-12">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-20 -mb-20"></div>

                    <div className="flex flex-col sm:flex-row items-center relative z-10">
                        <div className="relative mb-6 sm:mb-0 sm:mr-8">
                            <div className="h-36 w-36 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 p-1 shadow-2xl">
                                <img
                                    src={profileImg}
                                    alt="Profile"
                                    className="h-full w-full rounded-full object-cover border-4 border-white"
                                />
                            </div>
                            {editMode && (
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-1 right-1 bg-orange-500 text-white p-2.5 rounded-full hover:bg-orange-600 transition-all shadow-lg"
                                    title="Change profile photo"
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
                                {formData.firstName} {formData.lastName}
                            </h1>
                            <p className="text-gray-300 text-sm mt-1">Driver ID: DRV-2025-1234</p>
                            <div className="flex items-center justify-center sm:justify-start mt-2">
                                <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                                <span className="font-medium">Active</span>
                            </div>
                            <div className="mt-6">
                                {editMode ? (
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setEditMode(false)}
                                            className="flex items-center px-6 py-2.5 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-all shadow-md"
                                        >
                                            <FaSave className="mr-2" /> Save Changes
                                        </button>
                                        <button
                                            onClick={() => setEditMode(false)}
                                            className="flex items-center px-6 py-2.5 bg-white bg-opacity-20 text-white rounded-full text-sm font-semibold hover:bg-opacity-30 transition-all"
                                        >
                                            <FaTimes className="mr-2" /> Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="flex items-center px-6 py-2.5 bg-white bg-opacity-20 text-white rounded-full text-sm font-semibold hover:bg-opacity-30 transition-all"
                                    >
                                        <FaEdit className="mr-2" /> Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details - Enhanced layout and styling */}
                <div className="p-6 sm:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <FaUserCircle className="text-orange-500 mr-3" /> Personal Information
                            </h2>
                            <div className="space-y-5">
                                <div className="transition-all duration-200">
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">First Name</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                            placeholder="Enter your first name"
                                        />
                                    ) : (
                                        <p className="text-gray-800 border-b border-gray-200 pb-1">{formData.firstName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Last Name</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                            placeholder="Enter your last name"
                                        />
                                    ) : (
                                        <p className="text-gray-800 border-b border-gray-200 pb-1">{formData.lastName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
                                    {editMode ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                            placeholder="Enter your email address"
                                        />
                                    ) : (
                                        <p className="text-gray-800 border-b border-gray-200 pb-1">{formData.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone</label>
                                    {editMode ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                            placeholder="Enter your phone number"
                                        />
                                    ) : (
                                        <p className="text-gray-800 border-b border-gray-200 pb-1">{formData.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <FaIdCard className="text-orange-500 mr-3" /> Additional Information
                            </h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Gender</label>
                                    {editMode ? (
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-800 border-b border-gray-200 pb-1">{formData.gender}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
                                    {editMode ? (
                                        <div className="relative">
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                                placeholder="Enter new password"
                                            />
                                            <FaLock className="absolute right-3 top-3 text-gray-400" />
                                        </div>
                                    ) : (
                                        <p className="text-gray-800 border-b border-gray-200 pb-1">••••••••••</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Age</label>
                                    {editMode ? (
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            min="18"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                                            placeholder="Enter your age"
                                        />
                                    ) : (
                                        <p className="text-gray-800 border-b border-gray-200 pb-1">{formData.age}</p>
                                    )}
                                </div>

                                {/* License Information with Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Driver's License</label>
                                    <div className="flex items-center p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                        {formData.isVerified ? (
                                            <>
                                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                                    <FaIdCard className="text-blue-700" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-blue-800 font-medium text-sm">ID: DL-12345678</p>
                                                    <p className="text-blue-600 text-xs">Verified</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="bg-red-100 p-2 rounded-full mr-3">
                                                    <FaExclamationTriangle className="text-red-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-red-600 font-medium text-sm">ID: DL-12345678</p>
                                                    <p className="text-red-600 text-xs">Unverified</p>
                                                </div>
                                            </>
                                        )}
                                        {editMode && (
                                            <label className="cursor-pointer bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors shadow-sm">
                                                Update
                                                <input type="file" className="hidden" accept="image/*" />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileContent;

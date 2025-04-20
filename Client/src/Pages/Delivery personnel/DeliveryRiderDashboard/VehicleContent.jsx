import React, { useState, useRef } from 'react';
import { FaEdit, FaSave, FaTimes, FaCamera, FaInfoCircle, FaLock, FaIdCard } from 'react-icons/fa';

function VehicleContent() {
    const [editMode, setEditMode] = useState(false);
    const [vehicleData, setVehicleData] = useState({
        model: 'Honda CBR 150',
        type: 'Motorbike',
        year: '2022',
        licensePlate: 'ABC 123',
        insuranceExpiry: '2024-09-30',
        revenueLicenseExpiry: '2025-10-15',
        driverLicenseExpiry: '2025-04-16',
        emissionTestExpiry: '2025-08-15'
    });

    const [vehicleImages, setVehicleImages] = useState({
        front: '/vehicle-front.jpg',
        side: '/vehicle-side.jpg'
    });

    const frontInputRef = useRef(null);
    const sideInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (position, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setVehicleImages(prev => ({
                    ...prev,
                    [position]: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const isExpiringSoon = (dateString) => {
        const expiryDate = new Date(dateString);
        const today = new Date();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
        return expiryDate - today < thirtyDays && expiryDate >= today;
    };

    const isExpired = (dateString) => {
        const expiryDate = new Date(dateString);
        const today = new Date();
        return expiryDate < today;
    };

    const formatExpiryDate = (dateString) => {
        const expiryDate = new Date(dateString);
        const formattedDate = expiryDate.toLocaleDateString();

        if (isExpired(dateString)) {
            return (
                <div className="flex items-center">
                    <span className="text-red-600 font-medium">{formattedDate}</span>
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">Expired</span>
                </div>
            );
        } else if (isExpiringSoon(dateString)) {
            return (
                <div className="flex items-center">
                    <span className="text-orange-600 font-medium">{formattedDate}</span>
                    <span className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded">Expiring soon</span>
                </div>
            );
        } else {
            return <span className="text-gray-800">{formattedDate}</span>;
        }
    };

    // Read-only field for expiry dates
    const ExpiryDateField = ({ label, value, name }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {editMode ? (
                <div className="relative">
                    <input
                        type="date"
                        name={name}
                        value={value}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                    </div>
                </div>
            ) : (
                formatExpiryDate(value)
            )}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white shadow rounded-lg">
                {/* Vehicle Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{vehicleData.model}</h1>
                        <p className="text-gray-500">{vehicleData.type} • {vehicleData.year} • {vehicleData.color}</p>
                    </div>
                    <div>
                        {editMode ? (
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
                                >
                                    <FaSave className="mr-2" /> Save Changes
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    <FaTimes className="mr-2" /> Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setEditMode(prev => !prev)}
                                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                            >
                                <FaEdit className="mr-2" /> Edit Vehicle
                            </button>
                        )}
                    </div>
                </div>

                {/* Vehicle Images */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-wrap -mx-2">
                        <div className="w-full md:w-1/2 px-2 mb-4">
                            <div className="relative">
                                <img
                                    src={vehicleImages.front}
                                    alt="Vehicle Front"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                {editMode && (
                                    <button
                                        onClick={() => frontInputRef.current.click()}
                                        className="absolute bottom-3 right-3 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
                                    >
                                        <FaCamera size={16} />
                                    </button>
                                )}
                                <input
                                    type="file"
                                    ref={frontInputRef}
                                    onChange={(e) => handleImageChange('front', e)}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1 text-center">Front View</p>
                        </div>
                        <div className="w-full md:w-1/2 px-2 mb-4">
                            <div className="relative">
                                <img
                                    src={vehicleImages.side}
                                    alt="Vehicle Side"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                {editMode && (
                                    <button
                                        onClick={() => sideInputRef.current.click()}
                                        className="absolute bottom-3 right-3 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
                                    >
                                        <FaCamera size={16} />
                                    </button>
                                )}
                                <input
                                    type="file"
                                    ref={sideInputRef}
                                    onChange={(e) => handleImageChange('side', e)}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1 text-center">Side View</p>
                        </div>
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">Vehicle Information</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="model"
                                    value={vehicleData.model}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            ) : (
                                <p className="text-gray-800">{vehicleData.model}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            {editMode ? (
                                <select
                                    name="type"
                                    value={vehicleData.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option>Motorbike</option>
                                    <option>Car</option>
                                    <option>Van</option>
                                    <option>Tuk/auto</option>
                                </select>
                            ) : (
                                <p className="text-gray-800">{vehicleData.type}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="year"
                                    value={vehicleData.year}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            ) : (
                                <p className="text-gray-800">{vehicleData.year}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="licensePlate"
                                    value={vehicleData.licensePlate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            ) : (
                                <p className="text-gray-800">{vehicleData.licensePlate}</p>
                            )}
                        </div>


                    </div>

                    {/* Vehicle Documents */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">Maintenance & Documentation</h2>
                            {editMode && (
                                <div className="flex items-center text-sm text-gray-500">
                                    <FaInfoCircle className="mr-1" />
                                    <span>Expiry dates cannot be edited</span>
                                </div>
                            )}
                        </div>

                        {/* Notice about expired documents */}
                        {(isExpired(vehicleData.insuranceExpiry) ||
                            isExpired(vehicleData.revenueLicenseExpiry) ||
                            isExpired(vehicleData.driverLicenseExpiry) ||
                            isExpired(vehicleData.emissionTestExpiry)) && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <FaInfoCircle className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                Document(s) Expired
                                            </h3>
                                            <p className="text-sm text-red-700 mt-1">
                                                One or more of your documents have expired. Please upload updated documentation as soon as possible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* Expiry date fields - all are non-editable */}
                        <ExpiryDateField
                            label="Insurance Expiry"
                            value={vehicleData.insuranceExpiry}
                            name="insuranceExpiry"
                        />

                        <ExpiryDateField
                            label="Vehicle Revenue License Expiry"
                            value={vehicleData.revenueLicenseExpiry}
                            name="revenueLicenseExpiry"
                        />

                        <ExpiryDateField
                            label="Driver License Expiry"
                            value={vehicleData.driverLicenseExpiry}
                            name="driverLicenseExpiry"
                        />

                        <ExpiryDateField
                            label="Vehicle Emission Test Expiry"
                            value={vehicleData.emissionTestExpiry}
                            name="emissionTestExpiry"
                        />



                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehicleContent;

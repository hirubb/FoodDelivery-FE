import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaIdCard, FaTimes, FaCheck, FaUpload, FaFileAlt, FaCarAlt, FaCertificate, FaCamera } from "react-icons/fa";
import { motion } from 'framer-motion';
import DeliveryRiderService from "../../services/DeliveryRider-service";

function VehicleDetailsForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        vehicleModel: "",
        manufactureYear: "",
        licensePlate: "",
        vehicleFrontView: null,
        vehicleSideView: null,
        insurance: null,
        revenueLicense: null,
        driverLicenseFront: null,
        driverLicenseBack: null,
        emissionCertificate: null
    });

    const [uploadStatus, setUploadStatus] = useState({
        vehicleFrontView: null,
        vehicleSideView: null,
        insurance: null,
        revenueLicense: null,
        driverLicenseFront: null,
        driverLicenseBack: null,
        emissionCertificate: null
    });

    const [vehiclePreviews, setVehiclePreviews] = useState({
        frontView: null,
        sideView: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (documentType, e) => {
        const file = e.target.files[0];
        if (file) {
            // Show loading status
            setUploadStatus(prev => ({
                ...prev,
                [documentType]: 'uploading'
            }));

            // Create preview URLs for vehicle images
            if (documentType === 'vehicleFrontView' || documentType === 'vehicleSideView') {
                const previewUrl = URL.createObjectURL(file);
                setVehiclePreviews(prev => ({
                    ...prev,
                    [documentType === 'vehicleFrontView' ? 'frontView' : 'sideView']: previewUrl
                }));
            }

            setTimeout(() => {
                setFormData(prev => ({
                    ...prev,
                    [documentType]: file
                }));

                setUploadStatus(prev => ({
                    ...prev,
                    [documentType]: 'success'
                }));
            }, 800);
        }
    };

    const removeFile = (documentType) => {

        if (documentType === 'vehicleFrontView' || documentType === 'vehicleSideView') {
            const viewType = documentType === 'vehicleFrontView' ? 'frontView' : 'sideView';
            if (vehiclePreviews[viewType]) {
                URL.revokeObjectURL(vehiclePreviews[viewType]);
            }
            setVehiclePreviews(prev => ({
                ...prev,
                [viewType]: null
            }));
        }

        setFormData(prev => ({
            ...prev,
            [documentType]: null
        }));

        setUploadStatus(prev => ({
            ...prev,
            [documentType]: null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const vehicleFormData = new FormData();
            vehicleFormData.append('vehicleModel', formData.vehicleModel);
            vehicleFormData.append('manufactureYear', formData.manufactureYear);
            vehicleFormData.append('licensePlate', formData.licensePlate);

            if (formData.vehicleFrontView) {
                vehicleFormData.append('frontViewImage', formData.vehicleFrontView);
            }

            if (formData.vehicleSideView) {
                vehicleFormData.append('sideViewImage', formData.vehicleSideView);
            }

            if (formData.insurance) {
                vehicleFormData.append('insuranceFile', formData.insurance);
            }

            if (formData.revenueLicense) {
                vehicleFormData.append('revenueLicenseFile', formData.revenueLicense);
            }

            if (formData.driverLicenseFront) {
                vehicleFormData.append('driverLicenseFrontFile', formData.driverLicenseFront);
            }

            if (formData.driverLicenseBack) {
                vehicleFormData.append('driverLicenseBackFile', formData.driverLicenseBack);
            }

            if (formData.emissionCertificate) {
                vehicleFormData.append('emissionCertificateFile', formData.emissionCertificate);
            }

            const response = await DeliveryRiderService.RegisterVehicleDetails(vehicleFormData);
            console.log("Vehicle Details Registration successful:", response.data);


            navigate('/');
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

    const VehicleImageUpload = ({ title, documentType, viewType }) => (
        <div className="border rounded-lg overflow-hidden">
            {!formData[documentType] ? (
                <label className="flex flex-col items-center justify-center p-4 h-48 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded transition-colors">
                    <FaCamera size={30} className="text-gray-400 mb-3" />
                    <span className="text-sm font-medium">{title}</span>
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(documentType, e)}
                        className="hidden"
                        accept="image/*"
                    />
                    <span className="text-xs text-gray-500 mt-2">
                        <FaUpload size={8} className="inline mr-1" /> Click to upload
                    </span>
                </label>
            ) : (
                <div className="relative h-48">
                    <img
                        src={vehiclePreviews[viewType]}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={() => removeFile(documentType)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                            <FaTimes size={16} />
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 flex justify-between items-center">
                        <span className="text-sm truncate">{formData[documentType].name}</span>
                        {uploadStatus[documentType] === 'uploading' ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <FaCheck className="text-green-500" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const DocumentUpload = ({ title, documentType, icon }) => (
        <div className="border rounded-md overflow-hidden">
            {!formData[documentType] ? (
                <label className="flex flex-col items-center justify-center p-3 h-20 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded transition-colors">
                    {icon}
                    <span className="text-sm font-medium">{title}</span>
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(documentType, e)}
                        className="hidden"
                        accept="image/*,.pdf"
                    />
                    <span className="text-xs text-gray-500">
                        <FaUpload size={8} className="inline mr-1" /> Click to upload
                    </span>
                </label>
            ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 border-l-4 border-green-500">
                    <div className="flex items-center">
                        {icon}
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">{title}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                {formData[documentType].name || 'Document uploaded successfully'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {uploadStatus[documentType] === 'uploading' ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <FaCheck className="text-green-500 mr-2" />
                                <button
                                    type="button"
                                    onClick={() => removeFile(documentType)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="h-screen flex flex-col md:flex-row overflow-hidden">
            {/* Left Side - Dark Blue Background with Larger Image */}
            <div className="md:w-1/2 w-full bg-[#0C1A39] text-white p-4 md:p-6 lg:p-8 flex items-center h-[40vh] md:h-screen relative">
                {/* Content container */}
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="text-center md:text-left md:max-w-lg lg:max-w-xl mx-auto">
                        {/* Text content - visible on larger screens */}
                        <div className="hidden md:block mb-6">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Join Our Delivery Team</h1>
                            <div className="w-16 md:w-24 h-1 bg-[#FF8A00] mb-3 md:mb-4"></div>
                            <p className="text-sm md:text-base lg:text-lg">
                                Be part of our growing network of delivery professionals and enjoy flexible hours and competitive pay.
                            </p>
                        </div>

                        {/* Enlarged Image */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="w-full flex items-center justify-center"
                        >
                            <motion.img
                                src="/src/assets/DeliveryPerson/Frame.png"
                                alt="Delivery service illustration"
                                className="w-full md:w-[90%] lg:w-[85%] max-w-3xl object-contain"
                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    duration: 4,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))" }}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-1/2 w-full flex flex-col h-[60vh] md:h-screen overflow-hidden bg-white">
                {/* Orange Header */}
                <div className="bg-[#FF8A00] text-white text-center py-4">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">CREATE YOUR ACCOUNT</h2>
                    <p className="text-xs md:text-sm mt-1">Complete the form to start your delivery journey</p>
                </div>

                {/* Form Content - Scrollable */}
                <div className="flex-grow overflow-y-auto p-4 md:p-6">
                    <div className="max-w-md mx-auto w-full">
                        <h3 className="text-lg md:text-xl font-semibold text-center mb-4 text-gray-800">
                            Please fill the vehicle details below
                        </h3>

                        {/* Error message display */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Vehicle Model */}
                            <div>
                                <label className="block text-gray-700 font-medium text-sm mb-1">Vehicle Model</label>
                                <input
                                    type="text"
                                    name="vehicleModel"
                                    value={formData.vehicleModel}
                                    onChange={handleChange}
                                    placeholder="Enter Your vehicle Model"
                                    className="text-black w-full px-3 py-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Year of Manufacture */}
                            <div>
                                <label className="block text-gray-700 font-medium text-sm mb-1">Year of Manufacture</label>
                                <input
                                    type="text"
                                    name="manufactureYear"
                                    value={formData.manufactureYear}
                                    onChange={handleChange}
                                    placeholder="Enter Your Year of Manufacture"
                                    className="text-black w-full px-3 py-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* License Plate */}
                            <div>
                                <label className="block text-gray-700 font-medium text-sm mb-1">License Plate Number</label>
                                <input
                                    type="text"
                                    name="licensePlate"
                                    value={formData.licensePlate}
                                    onChange={handleChange}
                                    placeholder="Enter Your License Plate Number"
                                    className="text-black  w-full px-3 py-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Vehicle Photos Section */}
                            <div className="pt-2">
                                <h4 className="font-medium text-gray-700 mb-2">Vehicle Photos</h4>
                                <p className="text-xs text-gray-500 mb-3">
                                    Please upload clear photos of your vehicle from front and side views
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <VehicleImageUpload
                                            title="Front View"
                                            documentType="vehicleFrontView"
                                            viewType="frontView"
                                        />
                                    </div>
                                    <div>
                                        <VehicleImageUpload
                                            title="Side View"
                                            documentType="vehicleSideView"
                                            viewType="sideView"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Document Upload Section Header */}
                            <div className="pt-4">
                                <h4 className="font-medium text-gray-700 mb-2">Required Documents</h4>
                                <p className="text-xs text-gray-500 mb-3">
                                    Please upload clear images of all required documents
                                </p>
                            </div>

                            {/* Insurance Certificate */}
                            <div>
                                <label className="block text-gray-700 font-medium text-sm mb-1">Insurance Certificate</label>
                                <DocumentUpload
                                    title="Insurance Certificate"
                                    documentType="insurance"
                                    icon={<FaFileAlt size={18} className="text-blue-500 mr-2" />}
                                />
                            </div>

                            {/* Vehicle Revenue License */}
                            <div>
                                <label className="block text-gray-700 font-medium text-sm mb-1">Vehicle Revenue License</label>
                                <DocumentUpload
                                    title="Revenue License"
                                    documentType="revenueLicense"
                                    icon={<FaCarAlt size={18} className="text-green-600 mr-2" />}
                                />
                            </div>

                            {/* Driver License Upload - Both Sides */}
                            <div>
                                <label className="block text-gray-700 font-medium text-sm mb-1">Driver License (Front & Back)</label>
                                <div className="space-y-2">
                                    <DocumentUpload
                                        title="Driver License - Front"
                                        documentType="driverLicenseFront"
                                        icon={<FaIdCard size={18} className="text-orange-500 mr-2" />}
                                    />
                                    <DocumentUpload
                                        title="Driver License - Back"
                                        documentType="driverLicenseBack"
                                        icon={<FaIdCard size={18} className="text-orange-500 mr-2" />}
                                    />
                                </div>
                            </div>

                            {/* Emission Test Certificate */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium text-sm mb-1">Emission Test Certificate</label>
                                <DocumentUpload
                                    title="Emission Certificate"
                                    documentType="emissionCertificate"
                                    icon={<FaCertificate size={18} className="text-purple-500 mr-2" />}
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Fixed Button Area */}
                <div className="p-4 border-t border-gray-200">
                    <div className="max-w-md mx-auto">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#FF8A00] hover:bg-opacity-90'} text-white font-bold py-2.5 md:py-3 px-4 rounded flex items-center justify-center`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    <span className="mr-2">Create Account</span>
                                    <span className="bg-white rounded-full p-1 flex items-center justify-center">
                                        <FaArrowRight size={10} className="text-[#FF8A00]" />
                                    </span>
                                </>
                            )}
                        </button>

                        <div className="text-center mt-2">
                            <p className="text-xs md:text-sm text-gray-600">
                                Already have an account? <a href="#" className="text-[#FF8A00] font-medium hover:underline">Sign in</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehicleDetailsForm;

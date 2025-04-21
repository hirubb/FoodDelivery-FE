import React, { useState } from "react";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DeliveryRiderService from "../../services/DeliveryRider-service";


const vehicleOptions = [
    {
        title: "Rides and/or delivery with motorbike",
        vehicleType: "motorbike",
        age: "18+",
        vehicle: "Registered; 1997 or newer",
        license: "Full local license",
        icon: "🏍️"
    },
    {
        title: "Rides with car & Van",
        vehicleType: "car/van",
        age: "18+",
        vehicle: "Registered; 2000 or newer",
        license: "Full local license",
        icon: "🚗"
    },
    {
        title: "Rides with Tuk/auto",
        vehicleType: "tuk/auto",
        age: "18+",
        vehicle: "Registered; 1997 or newer",
        license: "Full local license",
        icon: "🛺"
    }
];

function VehicleSignUp() {
    const [selected, setSelected] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleNext = async () => {
        setLoading(true);
        const selectedVehicleType = vehicleOptions[selected].vehicleType;

        try {
            const response = await DeliveryRiderService.ChooseVehicleType({
                vehicleType: selectedVehicleType,
            });

            console.log("Vehicle Type Registered Successfully:", response.data);

            navigate('/deliveryPersonnel/VehicleDetails-SignUp');
        } catch (err) {
            console.error("Error registering vehicle type:", err);
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
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            {/* Left Illustration - Professional Dark Background */}
            <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-br from-[#0A1128] to-[#1D2D50] p-8 md:p-12">
                <div className="relative w-full max-w-lg">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="relative">
                        {/* Image with Framer Motion Animation */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                                scale: 0.95
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1
                            }}
                            transition={{
                                duration: 0.8,
                                ease: "easeOut"
                            }}
                        >
                            <motion.img
                                src="/src/assets/DeliveryPerson/Frame.png"
                                alt="Sign up illustration"
                                className="w-full max-w-2xl object-contain drop-shadow-2xl"
                                animate={{
                                    y: [0, -8, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            />
                        </motion.div>
                        <div className="mt-6 text-white text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-3">Join Our Delivery Network</h2>
                            <p className="text-gray-300 max-w-md mx-auto">Flexible schedules, competitive earnings, and opportunities to grow with AMBULA.LK</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Professional Layout */}
            <div className="md:w-1/2 w-full bg-white text-gray-800 flex flex-col justify-start shadow-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold tracking-wide text-center">SIGN UP</h2>
                        <div className="w-16 h-1 bg-white mx-auto mt-2 rounded-full"></div>
                    </div>
                </div>

                <div className="px-8 md:px-16 py-6">
                    <h3 className="text-xl md:text-2xl font-semibold text-center mb-8">
                        Choose how you want to earn with AMBULA.LK
                    </h3>

                    {/* Option Cards - With Vertically Stacked Requirements */}
                    <div className="space-y-5">
                        {vehicleOptions.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => setSelected(index)}
                                className={`relative p-5 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md 
                                        ${selected === index
                                        ? "bg-orange-50"
                                        : "bg-white hover:border-gray-300"
                                    }`}
                                style={{
                                    boxShadow: selected === index ? '0 0 0 2px #f97316' : '0 0 0 1px #e5e7eb',
                                    height: 'auto',
                                    minHeight: '140px'
                                }}
                            >
                                <div className="flex h-full">
                                    <div className="text-3xl mr-4 mt-1">{option.icon}</div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold mb-2">{option.title}</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><span className="font-medium">Age:</span> {option.age}</p>
                                            <p><span className="font-medium">Vehicle:</span> {option.vehicle}</p>
                                            <p><span className="font-medium">License:</span> {option.license}</p>
                                        </div>
                                    </div>
                                    {selected === index && (
                                        <div className="text-orange-500 text-xl absolute right-5 top-5">
                                            <FaCheckCircle />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons - Next Step */}
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={handleNext}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md inline-flex items-center gap-2 transition-all duration-300 hover:translate-x-1"
                            aria-label="Proceed to next step"
                        >
                            Next Step <FaArrowRight size={14} />
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default VehicleSignUp;

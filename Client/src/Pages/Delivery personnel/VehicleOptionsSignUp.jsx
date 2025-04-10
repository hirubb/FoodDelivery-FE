import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const vehicleOptions = [
    {
        title: "Rides and/or delivery with motorbike",
        age: "18+",
        vehicle: "Registered ; 1997 or newer",
        license: "Full local license"
    },
    {
        title: "Rides with car & Van",
        age: "18+",
        vehicle: "Registered ; 2000 or newer",
        license: "Full local license"
    },
    {
        title: "Rides with Tuk/auto",
        age: "18+",
        vehicle: "Registered ; 1997 or newer",
        license: "Full local license"
    }
];

function VehicleSignUp() {
    const [selected, setSelected] = useState(1);

    return (


        <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-white font-sans">
            {/* Left Illustration */}
            <div className="md:w-1/2 w-full flex items-center justify-center bg-[#0C1A39] p-10">
                <img
                    src="/src/assets/Frame.png"
                    alt="Sign up illustration"
                    className="w-full max-w-2xl "
                />
            </div>

            {/* Right Panel */}
            <div className="md:w-1/2 w-full bg-[#83858E] text-gray-900 flex flex-col justify-start">
                {/* Header */}
                <div className="bg-orange-500 text-white text-center py-4">
                    <h2 className="text-3xl font-bold tracking-wide">SIGN UP</h2>
                </div>

                <div className="px-6 md:px-12 py-6">
                    <h3 className="text-lg md:text-xl font-semibold text-center mb-6">
                        Choose how you want to earn with OrderLk
                    </h3>

                    {/* Option Cards */}
                    <div className="space-y-4">
                        {vehicleOptions.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => setSelected(index)}
                                className={`p-4 rounded-lg cursor-pointer border  bg-white hover:shadow-md ${selected === index ? "border-2 border-orange-500" : "border border-gray-700"
                                    }`}
                            >
                                <h4 className="text-base md:text-lg font-semibold mb-1">{option.title}</h4>
                                <p className="text-sm">Age: {option.age}</p>
                                <p className="text-sm">Vehicle: {option.vehicle}</p>
                                <p className="text-sm">Licence: {option.license}</p>
                            </div>
                        ))}
                    </div>

                    {/* Button */}
                    <div className="text-center mt-10">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md shadow-md inline-flex items-center gap-2">
                            <FaArrowRight /> Next Step
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehicleSignUp;
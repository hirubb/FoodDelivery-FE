import React from 'react';
import { motion } from 'framer-motion';
import { FaRoute, FaMapMarkerAlt, FaMotorcycle, FaArrowRight } from 'react-icons/fa';

const HowItWorksSection = () => {
    const steps = [
        {
            id: 1,
            icon: <FaRoute className="text-[#FC8A06] text-3xl" />,
            title: "Apply Online",
            description: "Complete our simple application form with your details and upload required documents."
        },
        {
            id: 2,
            icon: <FaMapMarkerAlt className="text-[#FC8A06] text-3xl" />,
            title: "Get Verified",
            description: "Our team reviews your application and verifies your documents, usually within 24-48 hours."
        },
        {
            id: 3,
            icon: <FaMotorcycle className="text-[#FC8A06] text-3xl" />,
            title: "Start Delivering",
            description: "Download the app, set your availability, and start accepting delivery requests."
        }
    ];

    return (
        <section id="how-it-works" className="py-20 md:py-28 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <motion.span
                        className="text-[#FC8A06] font-semibold uppercase tracking-wider mb-2 inline-block"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Getting Started
                    </motion.span>
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        How It Works
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Getting started as a delivery rider is quick and simple
                    </motion.p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Connection line */}
                    <div className="absolute top-32 left-0 right-0 h-1 bg-gray-200 hidden md:block">
                        <div className="absolute left-0 right-0 top-0 h-full bg-gradient-to-r from-[#FC8A06] to-[#FC8A06]/0 w-1/3"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="relative"
                            >
                                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all h-full flex flex-col items-center text-center relative z-10">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-[#FC8A06]/20 rounded-full blur-md"></div>
                                        <div className="bg-white relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-md border-4 border-white">
                                            <div className="bg-[#FC8A06]/10 w-16 h-16 rounded-full flex items-center justify-center">
                                                {step.icon}
                                            </div>
                                        </div>
                                        <div className="absolute -top-2 -right-2 bg-[#FC8A06] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                                            {step.id}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                                    <p className="text-gray-600 flex-grow">{step.description}</p>

                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute -right-5 top-1/2 transform -translate-y-1/2 z-20">
                                            <FaArrowRight className="text-[#FC8A06] text-2xl" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <button className="bg-[#FC8A06] hover:bg-[#e67e00] text-white px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20">
                        Apply Now
                    </button>
                    <p className="text-sm text-gray-500 mt-4">
                        Takes less than 5 minutes to complete your application
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorksSection;

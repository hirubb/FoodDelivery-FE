import React, { useState, useEffect } from 'react';
import { FaMotorcycle, FaClock, FaMoneyBillWave, FaCalendarAlt, FaRoute, FaCarSide, FaPhoneAlt, FaMapMarkerAlt, FaAngleDown, FaArrowRight, FaFacebook, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';
import { motion } from 'framer-motion';



const DownloadAppSection = () => {
    return (
        <section className="py-16 md:py-24 bg-[#0C1A39] text-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="w-full md:w-1/2 mb-8 md:mb-0">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold mb-4"
                        >
                            Download the Rider App
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-lg text-gray-300 mb-8 max-w-lg"
                        >
                            Get instant access to delivery requests, track your earnings, and navigate efficiently with our intuitive rider app.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <button className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all">
                                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.7,16.6c1.1-0.6,1.9-1.7,1.9-2.9c0-1.2-0.8-2.3-1.9-2.9l-3-1.7l-3,1.7c-1.1,0.6-1.9,1.7-1.9,2.9c0,1.2,0.8,2.3,1.9,2.9l3,1.7L17.7,16.6z M8.8,19.4C8.3,19.7,7.7,19.9,7,19.9C5.3,19.9,4,18.6,4,17V7c0-1.6,1.3-2.9,2.9-2.9c0.7,0,1.3,0.2,1.8,0.5L12,6.8v10.3L8.8,19.4z M20,17c0,1.6-1.3,2.9-2.9,2.9c-0.7,0-1.3-0.2-1.8-0.5L12,17.1V6.8l3.2-2.3c0.5-0.3,1.1-0.5,1.8-0.5c1.6,0,2.9,1.3,2.9,2.9V17z" />
                                </svg>
                                App Store
                            </button>
                            <button className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all">
                                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3,20.5V3.5C3,2.1,4.1,1,5.5,1h13C19.9,1,21,2.1,21,3.5v17c0,1.4-1.1,2.5-2.5,2.5h-13C4.1,23,3,21.9,3,20.5z M12,7h8v10h-8V7z M12,18h8v1.5c0,0.3-0.2,0.5-0.5,0.5h-7.5V18z M12,6h7.5C19.8,6,20,5.8,20,5.5V3.5C20,3.2,19.8,3,19.5,3H12V6z M4,5.5C4,5.8,4.2,6,4.5,6H11V3H4.5C4.2,3,4,3.2,4,3.5V5.5z M4,7v10h7V7H4z M4,18v1.5C4,19.8,4.2,20,4.5,20H11v-2H4z" />
                                </svg>
                                Google Play
                            </button>
                        </motion.div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <img
                                src="/rider-app-mockup.png"
                                alt="Rider App Mockup"
                                className="mx-auto max-w-full md:max-w-md"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/300x600/FF8A00/FFFFFF?text=Rider+App"
                                }}
                            />
                            <div className="absolute -bottom-5 -right-5 bg-[#FF8A00] rounded-lg shadow-xl p-4 text-center">
                                <div className="font-bold">Easy to use</div>
                                <div className="text-sm">Simple navigation</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default DownloadAppSection;
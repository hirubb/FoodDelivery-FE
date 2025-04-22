import React from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaStar, FaShieldAlt } from 'react-icons/fa';
import riderHeroImage from '../../../assets/DeliveryPerson/DeliveryRider.jpg';

const HeroSection = () => {
    return (
        <section id="hero" className="pt-28 pb-20 md:pt-36 md:pb-24 bg-gradient-to-br from-[#03081F] to-[#1E2A4A] text-white overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#FC8A06] opacity-20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-blue-600 opacity-10 rounded-full blur-[120px]"></div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[url('/src/assets/DeliveryRider.jpg')] bg-repeat opacity-5"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Hero Content */}
                    <motion.div
                        className="w-full lg:w-1/2 text-center lg:text-left"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                            Earn Money As An
                            <span className="text-[#FC8A06] block sm:inline"> AMBULA.LK </span>
                            Delivery Rider
                        </h1>

                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                            Join thousands of riders enjoying flexible hours, competitive pay, and the freedom to be your own boss.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <motion.button
                                className="bg-[#FC8A06] hover:bg-[#e67e00] text-white px-8 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 shadow-xl shadow-orange-900/20"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Apply Now
                            </motion.button>

                            <motion.button
                                className="border-2 border-white hover:bg-white hover:text-[#03081F] text-white px-8 py-3.5 rounded-lg font-bold transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Learn More
                            </motion.button>
                        </div>

                        <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                            <div className="flex flex-col items-center lg:items-start">
                                <div className="flex items-center gap-1 mb-1">
                                    <FaMoneyBillWave className="text-[#FC8A06]" />
                                    <span className="font-bold text-xl">$1250</span>
                                </div>
                                <p className="text-xs text-gray-400">Weekly Potential</p>
                            </div>

                            <div className="flex flex-col items-center lg:items-start">
                                <div className="flex items-center gap-1 mb-1">
                                    <FaStar className="text-[#FC8A06]" />
                                    <span className="font-bold text-xl">4.8/5</span>
                                </div>
                                <p className="text-xs text-gray-400">Rider Satisfaction</p>
                            </div>

                            <div className="flex flex-col items-center lg:items-start">
                                <div className="flex items-center gap-1 mb-1">
                                    <FaShieldAlt className="text-[#FC8A06]" />
                                    <span className="font-bold text-xl">100%</span>
                                </div>
                                <p className="text-xs text-gray-400">Secure Payments</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div
                        className="w-full lg:w-1/2 relative"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#FC8A06] to-orange-600 rounded-xl blur-lg opacity-30"></div>
                            <img
                                src={riderHeroImage}
                                alt="Delivery rider on motorcycle"
                                className="relative w-full h-auto rounded-xl shadow-2xl border border-gray-800"
                            />

                            {/* Floating cards */}
                            <motion.div
                                className="absolute -left-6 -bottom-6 bg-white text-black p-4 rounded-lg shadow-xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2.5 rounded-full">
                                        <FaMoneyBillWave className="text-green-600 text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-bold">Earn up to</p>
                                        <p className="text-gray-800 text-lg font-bold">$35/hour</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute -right-4 top-10 bg-white text-black py-2 px-4 rounded-full shadow-xl"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 1 }}
                            >
                                <p className="font-semibold text-sm flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                    500+ Active Riders
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Wave divider */}
            <div className="absolute left-0 right-0 bottom-0 h-16 overflow-hidden">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="white"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="white"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="white"></path>
                </svg>
            </div>
        </section>
    );
};

export default HeroSection;

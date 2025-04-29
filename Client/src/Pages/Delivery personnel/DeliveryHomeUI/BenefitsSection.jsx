import React from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaClock, FaCarSide, FaLocationArrow, FaTachometerAlt, FaShieldAlt } from 'react-icons/fa';
import benefitImage from '../../../assets/DeliveryPerson/DeliveryRider.jpg';

const BenefitsSection = () => {
    const benefits = [
        {
            id: 1,
            icon: <FaMoneyBillWave className="text-[#FC8A06] text-3xl" />,
            title: "Competitive Earnings",
            description: "Earn competitive pay with tips and performance bonuses. Get paid weekly directly to your account."
        },
        {
            id: 2,
            icon: <FaClock className="text-[#FC8A06] text-3xl" />,
            title: "Flexible Schedule",
            description: "Work when you want. No minimum hours or fixed schedules. Perfect for students or as a side gig."
        },
        {
            id: 3,
            icon: <FaCarSide className="text-[#FC8A06] text-3xl" />,
            title: "Your Vehicle, Your Way",
            description: "Use your motorcycle, car, or even bicycle in some areas. Just bring your smartphone and go."
        },
        {
            id: 4,
            icon: <FaLocationArrow className="text-[#FC8A06] text-3xl" />,
            title: "Efficient Navigation",
            description: "Our app provides the most efficient routes to maximize your earnings and minimize travel time."
        },
        {
            id: 5,
            icon: <FaTachometerAlt className="text-[#FC8A06] text-3xl" />,
            title: "Quick Onboarding",
            description: "Get approved and start delivering quickly with our streamlined verification process."
        },
        {
            id: 6,
            icon: <FaShieldAlt className="text-[#FC8A06] text-3xl" />,
            title: "Rider Support",
            description: "24/7 support team to help with any issues. You're never alone on the road."
        }
    ];

    return (
        <section id="benefits" className="py-20 md:py-28 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <motion.span
                        className="text-[#FC8A06] font-semibold uppercase tracking-wider mb-2 inline-block"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Benefits
                    </motion.span>
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Why Join AMBULA.LK Riders
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <span className="font-semibold">Be your own boss.</span> Set your own <span className="font-semibold">schedule.</span> Get <span className="font-semibold">paid weekly.</span>
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Benefits cards */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.id}
                                className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-[#FC8A06]/30 border border-transparent"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(252, 138, 6, 0.1)' }}
                            >
                                <div className="bg-[#FC8A06]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        className="relative order-first lg:order-last mb-10 lg:mb-0"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FC8A06]/20 to-blue-600/10 rounded-xl blur-xl transform -rotate-3 scale-105"></div>
                        <div className="relative">
                            <div className="rounded-xl overflow-hidden shadow-2xl">
                                <img
                                    src={benefitImage}
                                    alt="Delivery rider benefits"
                                    className="w-full h-auto object-cover"
                                    style={{ maxHeight: '600px' }}
                                />
                            </div>

                            {/* Stats overlay */}
                            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-xl p-6 text-center max-w-xs">
                                <div className="font-bold text-3xl text-[#FC8A06] mb-1">94%</div>
                                <p className="text-gray-700">of our riders recommend working with AMBULA.LK</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="text-center mt-16">
                    <motion.button
                        className="bg-[#FC8A06] hover:bg-[#e67e00] text-white px-8 py-3.5 rounded-lg font-bold transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Start Earning Today
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;

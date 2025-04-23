import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalculator, FaClock, FaMotorcycle } from 'react-icons/fa';

const EarningsCalculatorSection = () => {
    const [hoursPerWeek, setHoursPerWeek] = useState(20);
    const [deliveriesPerHour, setDeliveriesPerHour] = useState(3);

    // Calculate potential earnings
    const baseRate = 5; // Base rate per delivery
    const averageTip = 2; // Average tip per delivery
    const weeklyEarnings = hoursPerWeek * deliveriesPerHour * (baseRate + averageTip);
    const monthlyEarnings = weeklyEarnings * 4;

    return (
        <section className="py-20 md:py-28 bg-[#03081F] text-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-14">
                    <motion.span
                        className="text-[#FC8A06] font-semibold uppercase tracking-wider mb-2 inline-block"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Earning Potential
                    </motion.span>
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Calculate Your Earnings
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-300 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        See how much you could earn as an AMBULA.LK delivery rider
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center max-w-6xl mx-auto">
                    {/* Calculator inputs */}
                    <motion.div
                        className="lg:col-span-2 bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm shadow-xl"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-[#FC8A06]/20 rounded-full">
                                <FaCalculator className="text-[#FC8A06] text-xl" />
                            </div>
                            <h3 className="text-xl font-bold">Earnings Calculator</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-medium">
                                    Hours per week
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="5"
                                        max="40"
                                        value={hoursPerWeek}
                                        onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#FC8A06]"
                                    />
                                    <span className="bg-gray-700 px-3 py-1 rounded-lg w-16 text-center">
                                        {hoursPerWeek}h
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-medium">
                                    Deliveries per hour
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        step="0.5"
                                        value={deliveriesPerHour}
                                        onChange={(e) => setDeliveriesPerHour(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#FC8A06]"
                                    />
                                    <span className="bg-gray-700 px-3 py-1 rounded-lg w-16 text-center">
                                        {deliveriesPerHour}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-700/50 grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-700/50 rounded-xl">
                                <p className="text-sm text-gray-400">Weekly</p>
                                <p className="text-2xl font-bold text-[#FC8A06]">${weeklyEarnings}</p>
                            </div>
                            <div className="p-4 bg-gray-700/50 rounded-xl">
                                <p className="text-sm text-gray-400">Monthly</p>
                                <p className="text-2xl font-bold text-[#FC8A06]">${monthlyEarnings}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Benefits/info */}
                    <motion.div
                        className="lg:col-span-3"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 rounded-xl shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#FC8A06]/20 rounded-full">
                                        <FaClock className="text-[#FC8A06]" />
                                    </div>
                                    <h4 className="font-bold">Flexible Hours</h4>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Work whenever suits you best. Choose peak hours to maximize your earnings or fit deliveries around your existing schedule.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 rounded-xl shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#FC8A06]/20 rounded-full">
                                        <FaMotorcycle className="text-[#FC8A06]" />
                                    </div>
                                    <h4 className="font-bold">Efficient Deliveries</h4>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Our algorithm optimizes routes to help you complete more deliveries per hour, increasing your overall earnings.
                                </p>
                            </div>

                            <div className="sm:col-span-2 bg-gradient-to-r from-[#FC8A06]/20 to-blue-500/10 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                                <h4 className="font-bold text-xl mb-3">Payment Breakdown</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Base delivery fee:</span>
                                        <span className="font-semibold">${baseRate} per delivery</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Average customer tip:</span>
                                        <span className="font-semibold">${averageTip} per delivery</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Peak hour bonus:</span>
                                        <span className="font-semibold">+15% during busy times</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-700/50">
                                        <span className="text-gray-300">Weekly direct deposits:</span>
                                        <span className="font-semibold text-green-400">Every Monday</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pl-4 border-l-4 border-[#FC8A06]">
                            <p className="text-sm text-gray-400">
                                * Actual earnings may vary based on location, demand, time of day, and other factors. This calculator provides estimates only.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default EarningsCalculatorSection;

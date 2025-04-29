import React, { useState, useEffect } from 'react';
import { FaMotorcycle, FaClock, FaMoneyBillWave, FaCalendarAlt, FaRoute, FaCarSide, FaPhoneAlt, FaMapMarkerAlt, FaAngleDown, FaArrowRight, FaFacebook, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';
import { motion } from 'framer-motion';



const TestimonialsSection = () => {
    const testimonials = [
        {
            id: 1,
            name: "John D.",
            role: "Rider since 2022",
            image: "/testimonial1.jpg",
            quote: "I love the flexibility. I can work around my college schedule and earn enough to pay my bills and save some too."
        },
        {
            id: 2,
            name: "Sarah M.",
            role: "Full-time Rider",
            image: "/testimonial2.jpg",
            quote: "The earnings are great, especially during peak hours! The app is easy to use and support is always there when I need it."
        },
        {
            id: 3,
            name: "Michael K.",
            role: "Weekend Rider",
            image: "/testimonial3.jpg",
            quote: "I deliver on weekends for extra cash, and it's become a reliable side hustle. The process is smooth and customers are friendly."
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Hear From Our Riders</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join thousands of satisfied delivery partners who are earning on their own terms
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-3">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=random`
                                        }}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                            <div className="text-gray-600">
                                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
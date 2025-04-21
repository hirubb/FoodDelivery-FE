import React, { useState, useEffect } from 'react';



import Herosection from '../../Pages/Delivery personnel/DeliveryHomeUI/HeroSection';
import BenefitsSection from '../../Pages/Delivery personnel/DeliveryHomeUI/BenefitsSection';
import HowItWorksSection from '../../Pages/Delivery personnel/DeliveryHomeUI/HowItWorksSection';
import FAQSection from '../../Pages/Delivery personnel/DeliveryHomeUI/FAQSection';
import TestimonialsSection from '../../Pages/Delivery personnel/DeliveryHomeUI/TestimonialsSection';
import DownloadAppSection from '../../Pages/Delivery personnel/DeliveryHomeUI/DownloadAppSection';
import Footer from '../../layouts/Footer';
import Header from '../../layouts/Header';

const DeliveryRiderHome = () => {
    return (
        <div className="font-sans bg-gray-50 text-gray-900">
            {/* <NavBar /> */}


            <Herosection />
            <BenefitsSection />
            <HowItWorksSection />

            <TestimonialsSection />
            <DownloadAppSection />

        </div>
    );
};




export default DeliveryRiderHome;

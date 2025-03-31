import React, { useState, useEffect } from 'react';
import Login from '../../components/Auth/Login';
import bannerImage1 from '../../assets/Login&Register/logo5.png';
import bannerImage2 from '../../assets/Login&Register/logo3.png';
import bannerImage3 from '../../assets/Login&Register/logo6.png';

export default function LoginPage() {
    const [currentImage, setCurrentImage] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(100);
    const images = [
        `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerImage1})`,
        `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerImage2})`,
        `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerImage3})`
    ];

    useEffect(() => {
        const imageInterval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
            setZoomLevel(100);
        }, 5000);

        const zoomInterval = setInterval(() => {
            setZoomLevel(prev => {
                if (prev >= 120) return 100;
                return prev + 1;
            });
        }, 50);

        return () => {
            clearInterval(imageInterval);
            clearInterval(zoomInterval);
        };
    }, [images.length]);

    return (
        <div className="flex min-h-screen">
            <div 
                className="flex items-center justify-center flex-1 p-8 bg-center bg-cover"
                style={{ 
                    backgroundImage: images[currentImage],
                    backgroundSize: `${zoomLevel}%`,
                    transition: 'background-image 1s ease-in-out, background-size 5s linear',
                    willChange: 'background-image, background-size' 
                }}
            >
                <div className="relative z-10 max-w-md text-center text-white transition-all duration-300 transform hover:scale-105">
                    <h1 className="mb-2 text-4xl font-bold transition-all duration-300 hover:text-[#FC8A06]">Welcome Back!</h1>
                    <h2 className="mb-6 text-2xl font-semibold transition-all duration-300 hover:text-[#FC8A06]">Delicious food, delivered to your doorstep</h2>
                    <p className="text-lg transition-all duration-300 opacity-90 hover:opacity-100">Order from your favorite restaurants with just a few clicks</p>
                </div>
            </div>

            <div className="flex items-center justify-center flex-1 p-8 bg-black ">
                <Login />
            </div>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import Register from '../../components/Auth/Register';
import bannerImage from '../../assets/Login&Register/logo1.png';

export default function RegisterPage() {
    const [text, setText] = useState('');
    const [subtext, setSubtext] = useState('');
    const fullText = "Join our food delivery community";
    const fullSubtext = "Create an account to start ordering your favorite meals";

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < fullText.length) {
                setText(fullText.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
                let subIndex = 0;
                const subInterval = setInterval(() => {
                    if (subIndex < fullSubtext.length) {
                        setSubtext(fullSubtext.slice(0, subIndex + 1));
                        subIndex++;
                    } else {
                        clearInterval(subInterval);
                    }
                }, 50);
            }
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex min-h-screen">
            {/* Banner Section */}
            <div 
                className="flex items-center justify-center flex-1 p-8 bg-center bg-cover"
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerImage})` }}
            >
                <div className="relative z-10 max-w-md text-center text-white">
                    <h1 className="mb-4 text-4xl font-bold">{text}</h1>
                    <p className="text-xl">{subtext}</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="flex items-center justify-center flex-1 p-8 bg-black">
                <Register />
            </div>
        </div>
    );
}
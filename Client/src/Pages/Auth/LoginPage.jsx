import React, { useState, useEffect } from 'react';
import customerService from '../../services/customer-service';
import { useNavigate } from 'react-router-dom';
import bannerImage1 from '../../assets/Login&Register/logo5.png';
import bannerImage2 from '../../assets/Login&Register/logo3.png';
import bannerImage3 from '../../assets/Login&Register/logo6.png';

export default function CustomerLoginPage() {
    const [currentImage, setCurrentImage] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);

        customerService.login(formData).then((response) => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.user.role);

            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Redirect based on the role
            switch (response.data.user.role) {
                case 'Customer':
                    navigate("/customer/profile");
                    break;
                default:
                    navigate("/login");
            }
        }).catch((err) => {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        }).finally(() => {
            setLoading(false);
        });
    };

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
                    <h2 className="mb-6 text-2xl font-semibold transition-all duration-300 hover:text-[#FC8A06]">Browse and order your favorite meals</h2>
                    <p className="text-lg transition-all duration-300 opacity-90 hover:opacity-100">Log in to access your account and track orders.</p>
                </div>
            </div>

            <div className="flex items-center justify-center flex-1 p-8 bg-black ">
                <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                    {error && (
                        <div className="flex items-center p-3 mb-6 text-red-600 rounded-md bg-red-50">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                                <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <a href="/forgot-password" className="text-sm text-red-600 hover:text-red-500">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FC8A06] hover:bg-[#e67a00] text-white font-semibold py-2 px-4 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <svg className="w-5 h-5 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-sm text-center text-gray-600">
                        <p>
                            Don’t have an account?{' '}
                            <a href="/register" className="font-medium text-[#FC8A06]">
                                Create Account
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

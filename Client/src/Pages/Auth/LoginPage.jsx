import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/AuthService';

import bannerImage1 from '../../assets/Login&Register/logo5.png';
import bannerImage2 from '../../assets/Login&Register/logo3.png';
import bannerImage3 from '../../assets/Login&Register/logo6.png';
import googleIcon from '../../assets/Login&Register/google.png'; // Add this Google icon to your assets

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(100);
    const navigate = useNavigate();
    const location = useLocation();

    const images = [
        `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerImage1})`,
        `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerImage2})`,
        `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerImage3})`
    ];

    useEffect(() => {
        // Handle Google OAuth callback if code is present in URL
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (code) {
            setGoogleLoading(true);
            authService.handleGoogleCallback(code)
                .then(response => {
                    console.log("Google auth response:", response.data);
                    if (response && response.data) {
                        // Store authentication data including token
                        if (response.data.token) {
                            authService.setAuthData(response.data);
                        }
                        const userRole = getUserRoleFromResponse(response.data);
                        console.log("Determined role from Google auth:", userRole);
                        routeBasedOnRole(userRole);
                    } else {
                        throw new Error('Invalid response from server');
                    }
                })
                .catch(err => {
                    console.error("Google auth error:", err);
                    setError('Google authentication failed. Please try again.');
                })
                .finally(() => setGoogleLoading(false));
        }

        const rememberedEmail = localStorage.getItem('rememberedEmail');

        if (rememberedEmail) {
            setFormData(prev => ({
                ...prev,
                email: rememberedEmail
            }));
            setRememberMe(true);
        }
    }, [location.search]);

    useEffect(() => {
        const imageInterval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
            setZoomLevel(100);
        }, 5000);

        const zoomInterval = setInterval(() => {
            setZoomLevel(prev => (prev >= 120 ? 100 : prev + 1));
        }, 50);

        return () => {
            clearInterval(imageInterval);
            clearInterval(zoomInterval);
        };
    }, [images.length]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // Login with email and password only
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            });

            // Check if we have a valid response
            if (!response || !response.data) {
                throw new Error('Invalid response from server');
            }

            // Log the full response for debugging
            console.log("Auth response:", response.data);

            // Store authentication data including token
            if (response.data.token) {
                authService.setAuthData(response.data);
            }

            // Handle "remember me" functionality
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Get user role from response - check all possible locations
            // IMPORTANT: The role could be in different places depending on user type
            let userRole = null;

            // Check direct role property
            if (response.data.role) {
                userRole = response.data.role;
            }
            // Check user object if it exists
            else if (response.data.user && response.data.user.role) {
                userRole = response.data.user.role;
            }
            // Check customer object if it exists (specific to customer login)
            else if (response.data.customer && response.data.customer.role) {
                userRole = response.data.customer.role;
            }
            // Check restaurant owner object if it exists
            else if (response.data.restaurantOwner && response.data.restaurantOwner.role) {
                userRole = response.data.restaurantOwner.role;
            }
            // Check admin object if it exists
            else if (response.data.admin && response.data.admin.role) {
                userRole = response.data.admin.role;
            }

            // Normalize role format if needed
            userRole = normalizeRoleName(userRole);

            console.log("Detected user role:", userRole);

            // Route based on role
            if (userRole === 'Admin') {
                navigate('/admin-dashboard');
            } else if (userRole === 'RestaurantOwner') {
                navigate('/owner/profile');
            } else if (userRole === 'Customer') {
                navigate('/customer-dashboard');
            } else if (userRole === 'DeliveryPerson') {
                navigate('/deliveryPersonnel/DriverDashboard');


            } else {
                // Default fallback - should rarely happen if the backend is properly configured
                console.warn("Unknown or missing role:", userRole);
                setError('Login successful but user role is unknown. Please contact support.');
            }
        } catch (err) {
            console.error("Login error:", err);

            // Extract error message from the response with fallback messages
            const errorMessage = err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                'Login failed. Please check your credentials and try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setGoogleLoading(true);
        try {
            authService.googleLogin();
        } catch (err) {
            console.error("Google login error:", err);
            setError('Failed to initiate Google login. Please try again.');
            setGoogleLoading(false);
        }
    };

    // Helper function to extract role from response - Improved version
    const getUserRoleFromResponse = (data) => {
        if (!data) return null;

        // Direct debug log of the full response structure
        console.log("Full auth data structure:", JSON.stringify(data));

        let userRole = null;

        // Check direct role property
        if (data.role) {
            userRole = data.role;
        }
        // Check user object if it exists
        else if (data.user && data.user.role) {
            userRole = data.user.role;
        }
        // Check customer object if it exists (specific to customer login)
        else if (data.customer && data.customer.role) {
            userRole = data.customer.role;
            console.log("Found role in data.customer.role:", userRole);
        }
        // Check restaurant owner object if it exists
        else if (data.restaurantOwner && data.restaurantOwner.role) {
            userRole = data.restaurantOwner.role;
            console.log("Found role in data.restaurantOwner.role:", userRole);
        }
        // Check if the direct userData or user object contains the role
        else if (data.userData && data.userData.role) {
            userRole = data.userData.role;
            console.log("Found role in data.userData.role:", userRole);
        }
        // Check admin object if it exists
        else if (data.admin && data.admin.role) {
            userRole = data.admin.role;
            console.log("Found role in data.admin.role:", userRole);
        }
        // If role is still not found, attempt to parse the user type from available data
        else {
            // Check if restaurantOwner object exists at all (even without role property)
            if (data.restaurantOwner) {
                userRole = 'Restaurant Owner';
                console.log("Inferred role from restaurantOwner object presence");
            }
            // Check if customer object exists at all
            else if (data.customer) {
                userRole = 'Customer';
                console.log("Inferred role from customer object presence");
            }
            // Check if admin object exists at all
            else if (data.admin) {
                userRole = 'Admin';
                console.log("Inferred role from admin object presence");
            }
            // Check if user object exists and has a type property
            else if (data.user && data.user.type) {
                userRole = data.user.type;
                console.log("Found role in data.user.type:", userRole);
            }
        }

        // Normalize role format if needed
        const normalizedRole = normalizeRoleName(userRole);
        console.log("Final normalized role:", normalizedRole);
        return normalizedRole;
    };

    // Helper function to route based on role - Improved version with additional safeguards
    const routeBasedOnRole = (userRole) => {
        console.log("Routing based on role:", userRole);

        if (userRole === 'Admin') {
            navigate('/admin-dashboard');
        } else if (userRole === 'RestaurantOwner') {
            navigate('/owner/profile');
        } else if (userRole === 'Customer') {
            navigate('/customer-dashboard');
        } else {
            // Default fallback - should rarely happen if the backend is properly configured
            console.warn("Unknown or missing role:", userRole);
            setError('Login successful but user role is unknown. Please contact support.');
        }
    };

    // Helper function to normalize role names - Improved version
    const normalizeRoleName = (role) => {
        if (!role) return null;

        // Convert to string in case it's not
        const roleStr = String(role);

        // Handle different formats of the same role
        if (roleStr.toLowerCase() === 'restaurantowner' ||
            roleStr.toLowerCase() === 'restaurant owner' ||
            roleStr.toLowerCase() === 'restaurant_owner') {
            return 'RestaurantOwner';
        }

        if (roleStr.toLowerCase() === 'admin' ||
            roleStr.toLowerCase() === 'administrator') {
            return 'Admin';
        }

        if (roleStr.toLowerCase() === 'customer' ||
            roleStr.toLowerCase() === 'user') {
            return 'Customer';
        }

        if (roleStr.toLowerCase() === 'delivery person') {
            return 'DeliveryPerson';
        }


        // If no mapping found, return the original
        return roleStr;
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
                    <h2 className="mb-6 text-2xl font-semibold transition-all duration-300 hover:text-[#FC8A06]">Delicious food, delivered to your doorstep</h2>
                    <p className="text-lg transition-all duration-300 opacity-90 hover:opacity-100">Order from your favorite restaurants with just a few clicks</p>
                </div>
            </div>

            <div className="flex items-center justify-center flex-1 p-8 bg-[#03081F]">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
                        <p className="text-gray-600">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="flex items-center p-3 mb-6 text-red-600 rounded-md bg-red-50">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Google Sign-in button */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={googleLoading}
                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
                        >
                            {googleLoading ? (
                                <>
                                    <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in with Google...
                                </>
                            ) : (
                                <>
                                    <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />
                                    Sign in with Google
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center mb-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="px-3 text-sm text-gray-500">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
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
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                                <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">Remember me</label>
                            </div>
                            <a href="/forgot-password" className="text-sm text-red-600 hover:text-red-500">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#FC8A06] rounded-md hover:bg-[#e67a00] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-center text-gray-600">
                        Don't have an account?{' '}
                        <a href="/register" className="font-medium text-[#FC8A06] hover:underline">Create Account</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
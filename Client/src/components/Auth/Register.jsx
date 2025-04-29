import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerService from '../../services/customer-service';

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const goToNextStep = () => {
        if (step === 1) {
            if (!formData.first_name || !formData.last_name || !formData.email) {
                setError('Please fill in all required fields');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setError('Please enter a valid email address');
                return;
            }
            
            setError('');
            setStep(2);
        }
    };

    const goToPreviousStep = () => {
        setStep(1);
        setError('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }
        
        if (!formData.username) {
            setError('Username is required');
            return;
        }
        
        setLoading(true);
        
        try {
            const userData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                phone: formData.phone
            };
            
            const response = await CustomerService.registerCustomer(userData);
            
            // Store token if returned from backend
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', response.data.customer.role);
                localStorage.setItem('userId', response.data.customer._id || response.data.customer.id);
                localStorage.setItem('username', `${response.data.customer.first_name} ${response.data.customer.last_name}`);
            }
            
            navigate('/login', { 
                state: { 
                    successMessage: 'Registration successful! Please log in.' 
                } 
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Create an Account</h2>
                    <p className="text-gray-700">Join our food delivery platform</p>
                </div>
                
                {error && (
                    <div className="flex items-center p-3 mb-6 text-[#FC8A06] bg-[#FFF5EB] rounded-md">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}
                
                {/* Step Indicator */}
                <div className="relative flex items-center justify-between mb-8">
                    <div className={`flex flex-col items-center ${step === 1 ? 'text-[#FC8A06]' : 'text-green-600'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-[#FC8A06] text-white' : 'bg-green-100'}`}>
                            {step === 1 ? '1' : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <span className="mt-1 text-xs text-gray-900">Personal Info</span>
                    </div>
                    
                    <div className="flex-1 mx-2">
                        <div className="h-1 overflow-hidden bg-gray-200 rounded-full">
                            <div className={`h-full ${step === 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                        </div>
                    </div>
                    
                    <div className={`flex flex-col items-center ${step === 2 ? 'text-[#FC8A06]' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-[#FC8A06] text-white' : 'bg-gray-100'}`}>
                            2
                        </div>
                        <span className="mt-1 text-xs text-gray-900">Account Details</span>
                    </div>
                </div>
                
                <form onSubmit={(e) => {
                    e.preventDefault(); // Prevent default form submission
                    if (step === 1) {
                        goToNextStep();
                    } else {
                        handleRegister(e);
                    }
                    }}>
                    {step === 1 ? (
                        <>
                            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                                <div>
                                    <label htmlFor="first_name" className="block mb-1 text-sm font-medium text-gray-900">
                                        First Name
                                    </label>
                                    <input
                                        id="first_name"
                                        type="text"
                                        name="first_name"
                                        placeholder="Enter first name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="last_name" className="block mb-1 text-sm font-medium text-gray-900">
                                        Last Name
                                    </label>
                                    <input
                                        id="last_name"
                                        type="text"
                                        name="last_name"
                                        placeholder="Enter last name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-900">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-900">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                                    />
                                </div>
                            </div>
                            
                            <button
                                type="button"
                                onClick={goToNextStep}
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-[#FC8A06] border border-[#FC8A06] rounded-md shadow-sm hover:bg-[#e67a00] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC8A06]"
                            >
                                Continue
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-900">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        placeholder="Create a username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                            </div>
                            
                            <div className="mb-6">
                                <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-900">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full py-2 pl-10 pr-3 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={goToPreviousStep}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-[#FC8A06] bg-white border border-[#FC8A06] rounded-md shadow-sm hover:bg-[#FC8A06] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC8A06]"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#FC8A06] border border-transparent rounded-md shadow-sm hover:bg-[#e67a00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC8A06] disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="inline w-5 h-5 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </>
                                    ) : 'Create Account'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
                
                <div className="mt-6 text-sm text-center text-gray-600">
                    <p>
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-[#FC8A06] hover:text-[#e67a00]">
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
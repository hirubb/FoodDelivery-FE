import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/AuthService';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    // Initialize form data from localStorage if "Remember me" was checked
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setFormData(prev => ({ ...prev, email: rememberedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await login(formData.email, formData.password);
            localStorage.setItem('token', response.token);

            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            // Redirect based on role
            switch(response.role) {
                case 'CUSTOMER': navigate('/customer/dashboard'); break;
                case 'Restaurant Owner': navigate('/owner/profile'); break;
                case 'DELIVERY_PERSONNEL': navigate('/delivery/orders'); break;
                case 'Admin': navigate('/admin-dashboard'); break;
                default: navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
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
                
                <form onSubmit={handleLogin}>
                    <div className="mb-6">
                        <label htmlFor="login-email" className="block mb-1 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                        />
                    </div>
                    
                    <div className="mb-6">
                    <label htmlFor="login-password" className="block mb-1 text-sm font-medium text-gray-900">
                        Password
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        className="block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
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
                        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#FC8A06] border border-[#FC8A06] rounded-md shadow-sm hover:bg-[#e67a00] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg className="w-5 h-5 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </>
                        ) : 'Sign In'}
                    </button>
                </form>
                
                <div className="mt-6 text-sm text-center text-gray-600">
                    <p>
                        Don't have an account?{' '}
                        <a href="/register" className="font-medium text-[#FC8A06]">
                            Create Account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
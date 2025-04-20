import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; // Adjust to your backend URL

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// export const logout = () => {
//     localStorage.removeItem('token');
//     // Optionally call backend logout endpoint
// };

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const getUserRole = () => {
    // Decode token or retrieve from localStorage
    // This is a simplified example
    return localStorage.getItem('userRole');
};
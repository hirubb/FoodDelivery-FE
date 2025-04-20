import axios from 'axios';
import { baseURL , adminURL } from '../config/setting';
import { getAuthToken } from '../utils/auth';


console.log("Base URL:", import.meta.env.VITE_API_URL);
console.log("Admin URL:", import.meta.env.VITE_ADMIN_URL);

export const HTTP = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
      },
});

export const AdminHTTP = axios.create({
  baseURL: adminURL,
  headers: {
      "Content-Type": "application/json",
    },
});

// Add an interceptor to include the token in every request
HTTP.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  AdminHTTP.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
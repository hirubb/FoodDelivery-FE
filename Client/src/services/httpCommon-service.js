import axios from 'axios';
import { baseURL } from '../config/setting';
import { getAuthToken } from '../utils/auth';

console.log("base url : ", baseURL);
export const HTTP = axios.create({
  baseURL: baseURL,
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
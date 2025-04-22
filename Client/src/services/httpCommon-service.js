import axios from 'axios';
import { baseURL, adminURL, authURL, DeliveryRider_BaseURL } from '../config/setting';
import { getAuthToken } from '../utils/auth';


console.log("Base URL:", baseURL);
console.log("Admin URL:", adminURL);
console.log("Delivery URL:", authURL);



export const HTTP = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const DeliveryRiderHTTP = axios.create({
  baseURL: DeliveryRider_BaseURL,
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



export const AuthHTTP = axios.create({
  baseURL: authURL,
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

DeliveryRiderHTTP.interceptors.request.use(
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


AuthHTTP.interceptors.request.use(
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
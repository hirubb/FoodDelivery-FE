import axios from 'axios';
import { baseURL , adminURL , authURL , customerURL , paymentURL} from '../config/setting';
import { getAuthToken } from '../utils/auth';


console.log("Base URL:", import.meta.env.VITE_API_URL);
console.log("Admin URL:", import.meta.env.VITE_ADMIN_URL);
console.log("Customer URL:", import.meta.env.VITE_CUSTOMER_URL);
console.log("Payment URL:", import.meta.env.VITE_CUSTOMER_URL);

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

export const AuthHTTP = axios.create({
  baseURL: authURL,
  headers: {
      "Content-Type": "application/json",
    },
});

export const CustomerHTTP = axios.create({
  baseURL: customerURL,
  headers: {
      "Content-Type": "application/json",
    },
});

export const PaymentHTTP = axios.create({
  baseURL: paymentURL,
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

  CustomerHTTP.interceptors.request.use(
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

  PaymentHTTP.interceptors.request.use(
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
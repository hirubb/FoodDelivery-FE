// order-service.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_Order_URL + '/orders';

// Create a request interceptor function to add the auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const orderService = {
  // Place an order - now authenticates with token instead of requiring customerId
  placeOrder: (orderData) => {
    return axios.post(API_URL, orderData, {
      headers: getAuthHeader()
    });
  },
  
  // Get order status
  getOrderStatus: (orderId) => {
    return axios.get(`${API_URL}/${orderId}/status`, {
      headers: getAuthHeader()
    });
  },
  
  // Get customer orders - no longer needs customerId parameter
  // getCustomerOrders: () => {
  //   // The customer ID will be extracted from the token on the server side
  //   return axios.get(`${API_URL}/customer`, {
  //     headers: getAuthHeader()
  //   });
  // }
    // Get customer orders
    getCustomerOrders: (customerId) => {
      return axios.get(`${API_URL}/customer/${customerId}`);
    }
};

export default orderService;
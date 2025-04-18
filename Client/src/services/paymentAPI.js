import axios from 'axios';
import { baseURL } from '../config/setting';

const API_URL = `${baseURL}/api/payments`;

// Get order summary for payment
export const getOrderSummary = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/order-summary/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order summary:', error);
    throw error;
  }
};

// Process card payment
export const processCardPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/process-card`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error processing card payment:', error);
    throw error;
  }
};

// Initiate PayPal payment
export const initiatePaypalPayment = async (orderId) => {
  try {
    const response = await axios.post(`${API_URL}/initiate-paypal`, { orderId });
    return response.data;
  } catch (error) {
    console.error('Error initiating PayPal payment:', error);
    throw error;
  }
};

// Capture PayPal payment after user approval
export const capturePaypalPayment = async (paypalOrderId) => {
  try {
    const response = await axios.post(`${API_URL}/capture-paypal`, { paypalOrderId });
    return response.data;
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    throw error;
  }
};

// Get payment status
export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await axios.get(`${API_URL}/status/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment status:', error);
    throw error;
  }
};

// Get payment by order ID
export const getPaymentByOrderId = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment by order:', error);
    throw error;
  }
};

// Request refund
export const requestRefund = async (paymentId, reason) => {
  try {
    const response = await axios.post(`${API_URL}/refund/${paymentId}`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error requesting refund:', error);
    throw error;
  }
};
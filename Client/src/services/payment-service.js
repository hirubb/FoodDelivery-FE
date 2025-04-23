// services/payment-service.js
import { PaymentHTTP } from './httpCommon-service';
import { paymentURL } from '../config/setting';

// Update to use paymentURL instead of baseURL
const API_URL = `${paymentURL}/payments`;

class PaymentService {
  // Initialize payment
  initializePayment(paymentData) {
    // Ensure all required fields are included
    const requiredFields = [
      'orderId', 'customerId', 'restaurantId', 'amount', 'items', 
      'customerDetails'
    ];
    
    for (const field of requiredFields) {
      if (!paymentData[field]) {
        console.error(`Missing required field: ${field}`);
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Using PaymentHTTP instance which already handles auth token
    return PaymentHTTP.post(`/payments/initialize`, paymentData);
  }

  // Get payment status by order ID - updated to use PaymentHTTP
  getPaymentStatus(orderId) {
    return PaymentHTTP.get(`/payments/status/${orderId}`);
  }

  // Get all payments for the authenticated customer - updated to use PaymentHTTP
  getCustomerPayments() {
    // HTTP interceptor will automatically add the token
    return PaymentHTTP.get(`/payments/customer`);
  }

  // Regenerate customer coordinates for an order - updated to use PaymentHTTP
  regenerateCoordinates(orderId) {
    return PaymentHTTP.post(`/payments/customer/order/${orderId}/regenerate-coordinates`, {});
  }
}

export default new PaymentService();
// services/payment-service.js
import { PaymentHTTP } from './httpCommon-service';

class PaymentService {
  initializePayment(paymentData) {
    const requiredFields = [
      'orderId', 'customerId', 'restaurantId', 'amount', 'items', 'customerDetails'
    ];
    for (const field of requiredFields) {
      if (!paymentData[field]) {
        console.error(`Missing required field: ${field}`);
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const requiredCustomerFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    for (const field of requiredCustomerFields) {
      if (!paymentData.customerDetails[field]) {
        console.error(`Missing required customer detail: ${field}`);
        throw new Error(`Missing required customer detail: ${field}`);
      }
    }

    const formattedItems = paymentData.items.map(item => ({
      menuItemId: item.menuItemId || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    const finalPaymentData = { ...paymentData, items: formattedItems };

    return PaymentHTTP.post('/payments/initialize', finalPaymentData);
  }

  getPaymentStatus(orderId) {
    if (!orderId) throw new Error('Order ID is required');
    return PaymentHTTP.get(`/payments/status/${orderId}`);
  }

  getCustomerPayments() {
    return PaymentHTTP.get('/payments/customer');
  }

  regenerateCoordinates(orderId) {
    if (!orderId) throw new Error('Order ID is required');
    return PaymentHTTP.post(`/payments/customer/order/${orderId}/regenerate-coordinates`);
  }
}

export default new PaymentService();

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentCheckout = ({ order, customer, onBack, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (order && customer) {
      initializePayment();
    }
  }, [order, customer]);
  
  const initializePayment = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token'); // Assuming token storage
      
      const response = await axios.post(
        'http://localhost:5003/api/payments/initialize',
        {
          orderId: order._id,
          customerId: customer._id,
          amount: order.totalAmount,
          items: 'Food Order',
          customerDetails: {
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email,
            phone: customer.phone,
            address: order.deliveryAddress?.street || '',
            city: order.deliveryAddress?.city || '',
            country: 'Sri Lanka'
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setPaymentData(response.data);
    } catch (err) {
      console.error('Payment initialization failed:', err);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitPayment = () => {
    if (!paymentData) return;
    
    // Create a form for PayHere
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://sandbox.payhere.lk/pay/checkout'; // Sandbox URL
    form.style.display = 'none';
    
    // Add payment data as hidden fields
    for (const [key, value] of Object.entries(paymentData.paymentData)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }
    
    // Add form to body and submit
    document.body.appendChild(form);
    form.submit();
  };
  
  const checkPaymentStatus = async () => {
    try {
      if (!paymentData?.paymentId) return;
      
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5003/api/payments/status/${paymentData.paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.status === 'COMPLETED') {
        onComplete && onComplete(response.data);
        navigate('/payment/success');
      }
    } catch (err) {
      console.error('Failed to check payment status:', err);
    }
  };
  
  // Check if order or customer is undefined/null before rendering order details
  if (!order || !customer) {
    return (
      <div className="p-6 border border-yellow-200 rounded-lg bg-yellow-50">
        <h3 className="text-lg font-medium text-yellow-700">Missing Information</h3>
        <p className="text-yellow-600">Order or customer information is missing.</p>
        <button 
          onClick={onBack}
          className="px-4 py-2 mt-4 text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Cart
        </button>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="spinner"></div>
        <p className="mt-4">Initializing payment...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 border border-red-200 rounded-lg bg-red-50">
        <h3 className="text-lg font-medium text-red-700">Payment Error</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => initializePayment()}
          className="px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
        >
          Try Again
        </button>
        <button 
          onClick={onBack}
          className="px-4 py-2 mt-4 ml-2 text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Cart
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold">Payment Details</h2>
      
      <div className="p-4 mb-6 rounded-lg bg-gray-50">
        <h3 className="mb-2 text-lg font-medium">Order Summary</h3>
        <div className="flex justify-between mb-2">
          <span>Order ID:</span>
          <span className="font-medium">{order._id}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Items:</span>
          <span className="font-medium">{order.items?.length || 0} items</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span className="font-medium">LKR {(order.subtotal || 0).toFixed(2)}</span>
        </div>
        {(order.deliveryFee > 0) && (
          <div className="flex justify-between mb-2">
            <span>Delivery Fee:</span>
            <span className="font-medium">LKR {(order.deliveryFee || 0).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 mt-2 font-bold border-t border-gray-200">
          <span>Total:</span>
          <span>LKR {(order.totalAmount || 0).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium">Payment Method</h3>
        <div className="flex items-center p-3 border rounded-lg">
          <input 
            type="radio" 
            id="payhere" 
            name="payment-method" 
            checked 
            readOnly 
            className="mr-2"
          />
          <label htmlFor="payhere" className="flex items-center">
            <span className="ml-2">PayHere</span>
            <img 
              src="/payhere-logo.png" 
              alt="PayHere" 
              className="h-6 ml-auto" 
            />
          </label>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          You will be redirected to PayHere secure payment gateway to complete your payment
        </p>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <button
          onClick={handleSubmitPayment}
          disabled={!paymentData}
          className="px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentCheckout;
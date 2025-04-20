import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract order details from location state
  const orderDetails = location.state?.orderDetails;
  
  useEffect(() => {
    // Redirect back to checkout if no order details are available
    if (!orderDetails) {
      navigate('/payment/paymentPage');
      return;
    }
    
    const initiatePayment = async () => {
      try {
        setLoading(true);
        
        // Extract customer info from order details
        const paymentData = {
          orderId: orderDetails.orderId || `ORDER-${Date.now()}`,
          amount: orderDetails.total,
          customer: {
            name: `${orderDetails.firstName} ${orderDetails.lastName}`,
            email: orderDetails.email,
            phone: orderDetails.phone
          }
        };
        
        // Call the backend to initiate payment
        const response = await axios.post(
          'http://localhost:5000/api/payments/initiate', 
          paymentData
        );
        
        if (response.data.status === 'success') {
          // Create a form to submit to PayHere
          submitToPayHere(response.data.payload);
        } else {
          setError('Failed to initialize payment');
        }
        
      } catch (err) {
        console.error('Payment initiation error:', err);
        setError('An error occurred while processing your payment');
      } finally {
        setLoading(false);
      }
    };
    
    initiatePayment();
  }, [orderDetails, navigate]);
  
  // Function to create and submit form to PayHere
  const submitToPayHere = (paymentData) => {
    // Create a form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://sandbox.payhere.lk/pay/checkout';
    
    // Add all payment data as hidden fields
    Object.entries(paymentData).forEach(([key, value]) => {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = value;
      form.appendChild(hiddenField);
    });
    
    // Append form to body and submit
    document.body.appendChild(form);
    form.submit();
  };
  
  const handleCancel = () => {
    navigate('/checkout');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] p-8 bg-gray-900 text-white">
        <div className="w-full max-w-md p-8 text-center bg-gray-800 rounded-lg shadow-lg">
          <div className="w-12 h-12 mx-auto mb-6 border-4 border-gray-600 rounded-full border-t-amber-500 animate-spin"></div>
          <h2 className="mb-4 text-xl font-bold">Connecting to payment gateway...</h2>
          <p className="text-gray-400">Please wait while we redirect you to the secure payment page.</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] p-8 bg-gray-900 text-white">
        <div className="w-full max-w-md p-8 text-center bg-gray-800 border-l-4 border-red-500 rounded-lg shadow-lg">
          <h2 className="mb-4 text-xl font-bold">Payment Error</h2>
          <p className="mb-6 text-gray-400">{error}</p>
          <button 
            className="px-4 py-2 text-gray-400 transition duration-300 border border-gray-500 rounded hover:bg-gray-700"
            onClick={handleCancel}
          >
            Return to Checkout
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center min-h-[70vh] p-8 bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 text-center bg-gray-800 rounded-lg shadow-lg">
        <div className="w-12 h-12 mx-auto mb-6 border-4 border-gray-600 rounded-full border-t-amber-500 animate-spin"></div>
        <h2 className="mb-4 text-xl font-bold">Redirecting to PayHere...</h2>
        <p className="text-gray-400">Please wait while we connect you to our secure payment provider.</p>
      </div>
    </div>
  );
};

export default PaymentPage;
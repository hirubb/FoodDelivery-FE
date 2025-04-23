import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Commented out UI components that might be missing
// import { Spinner, Alert } from '../components/ui';

const PaymentCancel = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract orderId from URL query params
  const orderId = new URLSearchParams(location.search).get('orderId');
  
  const handleRetryPayment = () => {
    // Navigate to checkout page with appropriate path
    // Based on your routes in App.js, it seems the path should be /payment/Payment-checkout
    if (orderId) {
      // This assumes your checkout page can handle order ID in query params
      navigate(`/payment/Payment-checkout?orderId=${orderId}`);
    } else {
      navigate('/cart');
    }
  };
  
  const handleBackToHome = () => {
    navigate('/');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
        <div className="mb-4 text-yellow-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="mb-4 text-2xl font-bold">Payment Canceled</h2>
        <p className="mb-6 text-gray-600">
          Your payment for order #{orderId || 'Unknown'} has been canceled.
          Your cart items are still saved, and you can try again when you're ready.
        </p>
        <div className="flex flex-col space-y-3">
          <button
            className="w-full px-4 py-2 font-bold text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={handleRetryPayment}
          >
            Retry Payment
          </button>
          <button
            className="w-full px-4 py-2 font-bold text-gray-800 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={handleBackToHome}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
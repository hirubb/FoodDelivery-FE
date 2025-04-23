import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentService from '../../services/payment-service';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const orderId = location.state?.orderId || new URLSearchParams(window.location.search).get('order_id');
    
    if (!orderId) {
      setError('Order ID not found. Unable to fetch payment details.');
      setLoading(false);
      return;
    }

    // Fetch payment status
    const fetchPaymentStatus = async () => {
      try {
        const response = await PaymentService.getPaymentStatus(orderId);
        setPaymentDetails(response.data);
      } catch (err) {
        console.error('Error fetching payment status:', err);
        setError('Unable to fetch payment details. Please check your order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [location]);

  return (
    <div className="container p-4 mx-auto">
      <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md">
        <div className="mb-6 text-center">
          <div className="inline-block p-3 mb-4 bg-green-100 rounded-full">
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
          <p className="mt-2 text-gray-600">Thank you for your order.</p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <svg className="w-8 h-8 text-green-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        ) : paymentDetails && (
          <div className="pt-4 mt-6 border-t">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">Order ID:</div>
              <div className="font-medium">{paymentDetails.orderId}</div>
              
              <div className="text-gray-600">Amount:</div>
              <div className="font-medium">LKR {paymentDetails.amount?.toFixed(2)}</div>
              
              <div className="text-gray-600">Status:</div>
              <div className="font-medium">
                <span className="inline-block px-2 py-1 text-xs text-green-800 bg-green-100 rounded">
                  {paymentDetails.status}
                </span>
              </div>
              
              <div className="text-gray-600">Payment ID:</div>
              <div className="font-medium">{paymentDetails.paymentId || 'N/A'}</div>
              
              <div className="text-gray-600">Payment Method:</div>
              <div className="font-medium">{paymentDetails.paymentMethod || 'N/A'}</div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-2 font-medium text-white transition duration-300 bg-blue-500 rounded-md hover:bg-blue-600"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
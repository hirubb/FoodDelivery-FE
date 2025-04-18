import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPaymentStatus } from '../../services/paymentAPI';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);

  // Get payment details from location state
  const paymentId = location.state?.paymentId;
  const orderId = location.state?.orderId;

  useEffect(() => {
    async function fetchPaymentDetails() {
      if (!paymentId) {
        setError('Payment information not found');
        setLoading(false);
        return;
      }

      try {
        const result = await getPaymentStatus(paymentId);
        
        if (result.success) {
          setPayment(result.payment);
        } else {
          setError('Could not verify payment status');
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setError('Failed to load payment details');
      } finally {
        setLoading(false);
      }
    }

    fetchPaymentDetails();
  }, [paymentId]);

  const handleGoToOrders = () => {
    navigate('/orders');
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="max-w-2xl p-6 mx-auto my-8 bg-white shadow-md rounded-xl">
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-5 space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 text-red-500 bg-red-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Payment Verification Issue</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/payment/method')}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="p-5 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 text-green-500 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
          <p className="text-gray-600">Your order has been confirmed and is now being processed.</p>
          
          <div className="p-4 text-left border border-gray-200 rounded-lg bg-gray-50">
            <div className="mb-3 text-lg font-medium text-gray-800">Payment Details</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Order ID:</div>
              <div className="font-medium text-gray-800">{payment.orderId}</div>
              
              <div className="text-gray-600">Payment ID:</div>
              <div className="font-medium text-gray-800">{payment.id}</div>
              
              <div className="text-gray-600">Amount:</div>
              <div className="font-medium text-gray-800">LKR {payment.amount.toFixed(2)}</div>
              
              <div className="text-gray-600">Payment Method:</div>
              <div className="font-medium text-gray-800">
                {payment.method === 'card' ? 'Credit/Debit Card' : 'PayPal'}
              </div>
              
              <div className="text-gray-600">Date:</div>
              <div className="font-medium text-gray-800">{formatDate(payment.createdAt)}</div>
              
              <div className="text-gray-600">Status:</div>
              <div className="font-medium text-green-600">Completed</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              onClick={handleGoToOrders}
              className="w-full px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
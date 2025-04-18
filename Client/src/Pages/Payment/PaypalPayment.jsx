import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOrderSummary, initiatePaypalPayment, capturePaypalPayment } from '../../services/paymentAPI';
import OrderSummary from '../../components/Payment/OrderSummary';

export default function PaypalPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [error, setError] = useState(null);
  const [paypalData, setPaypalData] = useState(null);

  // Get orderId from location state or URL params
  const orderId = location.state?.orderId || new URLSearchParams(location.search).get('orderId');

  useEffect(() => {
    async function fetchOrderSummary() {
      if (!orderId) {
        setError('No order ID found. Please return to payment selection.');
        return;
      }

      try {
        setLoading(true);
        const summary = await getOrderSummary(orderId);
        setOrderSummary(summary);
      } catch (error) {
        console.error('Failed to fetch order summary:', error);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrderSummary();
  }, [orderId]);

  const handleInitiatePaypal = async () => {
    if (!orderId) {
      setError('Order ID is missing');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      
      const result = await initiatePaypalPayment(orderId);
      
      if (result.success && result.approvalUrl) {
        setPaypalData(result);
        // In a real application, you would redirect to PayPal or open in a popup
        window.open(result.approvalUrl, '_blank');
      } else {
        setError(result.message || 'Failed to initiate PayPal payment');
      }
    } catch (error) {
      console.error('PayPal initiation error:', error);
      setError(error.response?.data?.message || 'Failed to set up PayPal payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCapturePayment = async () => {
    if (!paypalData?.paypalOrderId) {
      setError('PayPal order information is missing');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      
      const result = await capturePaypalPayment(paypalData.paypalOrderId);
      
      if (result.success) {
        navigate('/payment/success', { 
          state: { 
            paymentId: result.paymentId,
            orderId: orderId
          }
        });
      } else {
        setError(result.message || 'Payment processing failed');
      }
    } catch (error) {
      console.error('PayPal capture error:', error);
      setError(error.response?.data?.message || 'Failed to complete PayPal payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto my-8 bg-white shadow-md rounded-xl">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">PayPal Payment</h2>
      
      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6 space-y-6 border border-gray-200 rounded-lg">
          <div className="flex justify-center">
            <img src="/paypal-logo.svg" alt="PayPal" className="h-12" />
          </div>
          
          {!paypalData ? (
            <div className="space-y-4">
              <p className="text-center text-gray-700">
                You will be redirected to PayPal to complete your payment securely.
              </p>
              
              <button
                onClick={handleInitiatePaypal}
                disabled={processing || loading || !orderSummary}
                className="w-full py-3 font-medium text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {processing ? 'Processing...' : 'Continue to PayPal'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-700">
                Once you've completed payment on PayPal, click below to complete your order.
              </p>
              
              <button
                onClick={handleCapturePayment}
                disabled={processing}
                className="w-full py-3 font-medium text-white transition duration-200 bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {processing ? 'Processing...' : 'I\'ve completed payment on PayPal'}
              </button>
            </div>
          )}
        </div>
        
        <div className="p-5 border border-gray-200 rounded-lg bg-gray-50 h-fit">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : orderSummary ? (
            <OrderSummary data={orderSummary} />
          ) : (
            <p className="py-4 text-center text-gray-500">Unable to load order summary</p>
          )}
        </div>
      </div>
      
      <button
        onClick={() => navigate('/payment/method')}
        className="block mt-6 text-sm text-blue-600 hover:text-blue-800"
      >
        ← Back to payment methods
      </button>
    </div>
  );
}
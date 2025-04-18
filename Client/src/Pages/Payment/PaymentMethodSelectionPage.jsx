import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentMethodSelector from '../../components/Payment/PaymentMethodSelector';
import OrderSummary from '../../components/Payment/OrderSummary';
import { getOrderSummary } from '../../services/paymentAPI';

export default function PaymentMethodSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderSummary, setOrderSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get orderId from state, URL params or localStorage
  const getOrderId = () => {
    // Check if orderId is in location state
    if (location.state && location.state.orderId) {
      return location.state.orderId;
    }
    
    // Check URL search params
    const searchParams = new URLSearchParams(location.search);
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      return orderIdParam;
    }
    
    // Check localStorage as fallback
    return localStorage.getItem('currentOrderId');
  };

  useEffect(() => {
    async function fetchOrderSummary() {
      try {
        setLoading(true);
        setError(null);
        
        const orderId = getOrderId();
        
        if (!orderId) {
          setError('No order ID found. Please return to your cart.');
          setLoading(false);
          return;
        }
        
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
  }, [location]);

  const handleProceed = () => {
    const orderId = getOrderId();
    
    if (paymentMethod === 'card') {
      navigate('/payment/checkoutcard', { state: { orderId } });
    } else if (paymentMethod === 'paypal') {
      navigate('/payment/paypal', { state: { orderId } });
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto my-8 bg-white shadow-md rounded-xl">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Choose Payment Method</h2>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-8">
        <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />
      </div>

      <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
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

      <button
        onClick={handleProceed}
        disabled={loading || !orderSummary}
        className="w-full py-3 mt-6 font-medium text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        Continue to Payment
      </button>
    </div>
  );
}
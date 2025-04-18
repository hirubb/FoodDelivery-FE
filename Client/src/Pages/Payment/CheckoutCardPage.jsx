import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOrderSummary, processCardPayment } from '../../services/paymentAPI';
import OrderSummary from '../../components/Payment/OrderSummary';

export default function CheckoutCardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [error, setError] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!orderId) {
      setError('Order ID is missing');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      
      // In a real implementation, you would generate a secure token from the card details
      // using a payment provider's SDK (like Stripe.js) before sending to your server
      const mockToken = `tok_${Date.now()}`; // This is just for demonstration
      
      const result = await processCardPayment({
        orderId,
        paymentToken: mockToken
      });
      
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
      console.error('Payment processing error:', error);
      setError(error.response?.data?.message || 'Failed to process payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto my-8 bg-white shadow-md rounded-xl">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Card Payment</h2>
      
      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Card Holder Name</label>
              <input
                type="text"
                name="cardHolder"
                value={cardDetails.cardHolder}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={processing || loading || !orderSummary}
              className="w-full py-3 font-medium text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {processing ? 'Processing...' : `Pay LKR ${orderSummary?.total?.toFixed(2) || '0.00'}`}
            </button>
          </form>
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
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderInfo, setOrderInfo] = useState(null);
  
  useEffect(() => {
    // Parse URL parameters from PayHere
    const urlParams = new URLSearchParams(location.search);
    const orderId = urlParams.get('order_id');
    const paymentId = urlParams.get('payment_id');
    
    if (orderId) {
      setOrderInfo({
        orderId,
        paymentId: paymentId || 'N/A'
      });
      
      // In a production app, you would verify the payment status with your backend here
    }
  }, [location]);
  
  const handleGoToOrders = () => {
    navigate('/orders');
  };
  
  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-900 text-white p-6">
      <div className="w-full max-w-md p-8 text-center bg-gray-800 rounded-lg shadow-lg">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-5xl text-green-500 border-2 border-green-500 rounded-full bg-green-900/20">
          ✓
        </div>
        
        <h1 className="mb-6 text-2xl font-bold">Payment Successful!</h1>
        
        {orderInfo && (
          <div className="p-4 mb-6 rounded-lg bg-gray-700/30">
            <p className="mb-2">Your order <strong>#{orderInfo.orderId}</strong> has been placed successfully.</p>
            <p>Payment ID: {orderInfo.paymentId}</p>
          </div>
        )}
        
        <p className="mb-8 text-gray-400">
          A confirmation has been sent to your email address. 
          You will receive updates about your order status.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            className="py-3 font-medium transition duration-300 rounded bg-amber-500 hover:bg-amber-600"
            onClick={handleGoToOrders}
          >
            View My Orders
          </button>
          
          <button 
            className="py-3 text-gray-300 transition duration-300 bg-transparent border border-gray-600 rounded hover:bg-gray-700"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
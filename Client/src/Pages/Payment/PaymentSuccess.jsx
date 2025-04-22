import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Get order_id from URL parameters
        const params = new URLSearchParams(location.search);
        const orderId = params.get('order_id');
        
        if (!orderId) {
          setError("Order ID not found in URL parameters");
          setLoading(false);
          return;
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }
        
        const response = await axios.get(
          `http://localhost:5002/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        setError("Failed to fetch order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [location]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="spinner"></div>
        <p className="mt-4">Loading order details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-md p-6 mx-auto my-10 bg-white rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
        
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md p-6 mx-auto my-10 bg-white rounded-lg shadow-lg">
      <div className="mb-6 text-center">
        <div className="flex justify-center">
          <div className="p-3 bg-green-100 rounded-full">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">Payment Successful!</h2>
        <p className="mt-2 text-gray-600">Your order has been placed successfully</p>
      </div>
      
      {orderDetails && (
        <div className="pt-4 mt-6 border-t">
          <h3 className="mb-2 text-lg font-medium">Order Details</h3>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order ID:</span>
            <span>{orderDetails._id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order Date:</span>
            <span>{orderDetails.createdAt ? new Date(orderDetails.createdAt).toLocaleString() : 'N/A'}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-medium">LKR {(orderDetails.totalAmount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Status:</span>
            <span className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded">
              {orderDetails.status || 'Processing'}
            </span>
          </div>
        </div>
      )}
      
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate('/orders')}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          View My Orders
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 ml-3 text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
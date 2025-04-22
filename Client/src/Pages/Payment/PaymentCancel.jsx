import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-md p-6 mx-auto my-10 bg-white rounded-lg shadow-lg">
      <div className="mb-6 text-center">
        <div className="flex justify-center">
          <div className="p-3 bg-red-100 rounded-full">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">Payment Cancelled</h2>
        <p className="mt-2 text-gray-600">Your payment was cancelled. No charges were made.</p>
      </div>
      
      <div className="pt-4 mt-6 border-t">
        <p className="text-gray-700">
          You can retry the payment or choose a different payment method.
        </p>
      </div>
      
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate('/checkout')}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
        <button
          onClick={() => navigate('/cart')}
          className="px-4 py-2 ml-3 text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
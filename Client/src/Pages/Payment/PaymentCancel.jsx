import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-900 text-white p-6">
      <div className="w-full max-w-md p-8 text-center bg-gray-800 rounded-lg shadow-lg">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-5xl text-red-500 border-2 border-red-500 rounded-full bg-red-900/20">
          ×
        </div>
        
        <h1 className="mb-6 text-2xl font-bold">Payment Cancelled</h1>
        
        <p className="mb-8 text-gray-400">
          Your payment process was cancelled. No charges have been made to your account.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            className="py-3 font-medium transition duration-300 rounded bg-amber-500 hover:bg-amber-600"
            onClick={() => navigate('/checkout')}
          >
            Return to Checkout
          </button>
          
          <button 
            className="py-3 text-gray-300 transition duration-300 bg-transparent border border-gray-600 rounded hover:bg-gray-700"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export { PaymentCancel };
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 text-center bg-white shadow-lg rounded-xl">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h2 className="mb-3 text-3xl font-bold text-gray-800">Payment Failed</h2>
        <p className="mb-6 text-gray-600">We couldn't process your payment. Please try again or use a different payment method.</p>
        
        <div className="p-4 mb-6 border border-red-100 rounded-lg bg-red-50">
          <h3 className="mb-1 font-medium text-red-800">Possible reasons:</h3>
          <ul className="pl-5 space-y-1 text-sm text-left text-red-700 list-disc">
            <li>Insufficient funds</li>
            <li>Incorrect card details</li>
            <li>Transaction declined by bank</li>
            <li>Temporary connection issue</li>
          </ul>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate('/payment/checkoutcard')}
            className="w-full py-3 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
          
          <button
            onClick={() => navigate('/payment/selectpaymentmethod')}
            className="w-full py-3 font-medium text-gray-800 transition bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Change Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}
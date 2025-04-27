import React, { useState } from "react";
import { FaCreditCard, FaInfoCircle, FaCheckCircle } from "react-icons/fa";

function PayHerePayments() {
  const [showTestCards, setShowTestCards] = useState(false);
  const [showDeclineCards, setShowDeclineCards] = useState(false);

  const toggleTestCards = () => {
    setShowTestCards(!showTestCards);
    if (!showTestCards) setShowDeclineCards(false);
  };

  const toggleDeclineCards = () => {
    setShowDeclineCards(!showDeclineCards);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-800">PayHere Payments</h2>
        <div className="flex items-center">
          <span className="mr-3 text-sm text-gray-600">Sandbox Mode</span>
          <button className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
            New Payment
          </button>
        </div>
      </div>
      
      <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
        <div className="flex items-center mb-2">
          <div className="p-2 mr-4 text-blue-700 bg-blue-100 rounded-md">
            <FaInfoCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-blue-800">PayHere Sandbox</h3>
        </div>
        <p className="mb-2 text-gray-700">
          This is a test environment to help you get familiar with the PayHere Merchant Portal and 
          test integrations with your site. No actual payments are processed in Sandbox mode.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center">
            <div className="p-2 mr-4 text-white bg-blue-600 rounded-md">
              <FaCreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Test Payment</p>
              <p className="text-sm text-gray-600">Use test cards to simulate payments</p>
            </div>
          </div>
          <button 
            onClick={toggleTestCards}
            className="px-3 py-1 text-sm text-blue-600 transition-colors border border-blue-300 rounded-md hover:bg-blue-50"
          >
            {showTestCards ? "Hide Test Cards" : "Show Test Cards"}
          </button>
        </div>
        
        {showTestCards && (
          <div className="p-4 ml-8 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="mb-2 font-medium text-gray-800">Test Card Numbers (Successful Payments)</h4>
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
              <div className="flex items-center p-2 bg-white border border-gray-200 rounded">
                <FaCheckCircle className="mr-2 text-green-500" />
                <p className="text-gray-700">Visa: <span className="font-mono">4916217501611292</span></p>
              </div>
              <div className="flex items-center p-2 bg-white border border-gray-200 rounded">
                <FaCheckCircle className="mr-2 text-green-500" />
                <p className="text-gray-700">MasterCard: <span className="font-mono">5307732125531191</span></p>
              </div>
              <div className="flex items-center p-2 bg-white border border-gray-200 rounded">
                <FaCheckCircle className="mr-2 text-green-500" />
                <p className="text-gray-700">AMEX: <span className="font-mono">346781005510225</span></p>
              </div>
            </div>
            
            <p className="mb-4 text-sm text-gray-600">For "Name on Card", "CVV" & "Expiry date" you can enter any valid data.</p>
            
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">Test Decline Scenarios</h4>
              <button 
                onClick={toggleDeclineCards}
                className="px-3 py-1 text-xs text-gray-600 transition-colors border border-gray-300 rounded-md hover:bg-gray-100"
              >
                {showDeclineCards ? "Hide Details" : "Show Details"}
              </button>
            </div>
            
            {showDeclineCards && (
              <div className="mt-2 space-y-3">
                <div className="p-3 bg-white border border-gray-200 rounded">
                  <h5 className="mb-1 font-medium text-red-600">Insufficient Funds</h5>
                  <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                    <p className="text-gray-700">Visa: <span className="font-mono text-xs">4024007194349121</span></p>
                    <p className="text-gray-700">MasterCard: <span className="font-mono text-xs">5459051433777487</span></p>
                    <p className="text-gray-700">AMEX: <span className="font-mono text-xs">370787711978928</span></p>
                  </div>
                </div>
                
                <div className="p-3 bg-white border border-gray-200 rounded">
                  <h5 className="mb-1 font-medium text-red-600">Limit Exceeded</h5>
                  <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                    <p className="text-gray-700">Visa: <span className="font-mono text-xs">4929119799365646</span></p>
                    <p className="text-gray-700">MasterCard: <span className="font-mono text-xs">5491182243178283</span></p>
                    <p className="text-gray-700">AMEX: <span className="font-mono text-xs">340701811823469</span></p>
                  </div>
                </div>
                
                <div className="p-3 bg-white border border-gray-200 rounded">
                  <h5 className="mb-1 font-medium text-red-600">Do Not Honor</h5>
                  <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                    <p className="text-gray-700">Visa: <span className="font-mono text-xs">4929768900837248</span></p>
                    <p className="text-gray-700">MasterCard: <span className="font-mono text-xs">5388172137367973</span></p>
                    <p className="text-gray-700">AMEX: <span className="font-mono text-xs">374664175202812</span></p>
                  </div>
                </div>
                
                <div className="p-3 bg-white border border-gray-200 rounded">
                  <h5 className="mb-1 font-medium text-red-600">Network Error</h5>
                  <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                    <p className="text-gray-700">Visa: <span className="font-mono text-xs">4024007120869333</span></p>
                    <p className="text-gray-700">MasterCard: <span className="font-mono text-xs">5237980565185003</span></p>
                    <p className="text-gray-700">AMEX: <span className="font-mono text-xs">373433500205887</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Next Steps</h3>
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <p className="mb-3 text-gray-700">
            After completing Sandbox testing, you can apply for a Live PayHere Merchant Account.
            Note that Sandbox is a completely separate deployment from the Live environment.
          </p>
          <button className="px-4 py-2 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700">
            Apply for Live Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default PayHerePayments;
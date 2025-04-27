import React, { useState } from "react";
import { FaCreditCard, FaPlus, FaCheckCircle } from "react-icons/fa";

function PaymentMethods() {
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showDeclineInfo, setShowDeclineInfo] = useState(false);

  const toggleCardDetails = () => {
    setShowCardDetails(!showCardDetails);
    if (!showCardDetails) setShowDeclineInfo(false);
  };

  const toggleDeclineInfo = () => {
    setShowDeclineInfo(!showDeclineInfo);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payment Methods</h2>
        <button className="flex items-center px-4 py-2 text-white transition-colors bg-[#FC8A06] rounded-md hover:bg-orange-700">
          <FaPlus className="mr-2" />
          Add Payment Method
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center">
            <div className="p-2 mr-4 text-white bg-[#FC8A06] rounded-md">
              <FaCreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Credit & Debit Cards</p>
              <p className="text-sm text-gray-600">Manage your payment cards</p>
            </div>
          </div>
          <button 
            onClick={toggleCardDetails}
            className="px-3 py-1 text-sm text-[#FC8A06] transition-colors border border-orange-300 rounded-md hover:bg-blue-50"
          >
            {showCardDetails ? "Hide Cards" : "View Cards"}
          </button>
        </div>
        
        {showCardDetails && (
          <div className="p-4 ml-8 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="mb-2 font-medium text-gray-800">Your Saved Cards</h4>
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
            
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">Additional Card Information</h4>
              <button 
                onClick={toggleDeclineInfo}
                className="px-3 py-1 text-xs text-gray-600 transition-colors border border-gray-300 rounded-md hover:bg-gray-100"
              >
                {showDeclineInfo ? "Hide Details" : "Show Details"}
              </button>
            </div>
            
            {showDeclineInfo && (
              <div className="mt-2 space-y-3">
                <div className="p-3 bg-white border border-gray-200 rounded">
                  <h5 className="mb-1 font-medium text-gray-700">Alternative Visa Cards</h5>
                  <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                    <p className="text-gray-700">Card 1: <span className="font-mono text-xs">4024007194349121</span></p>
                    <p className="text-gray-700">Card 2: <span className="font-mono text-xs">4929119799365646</span></p>
                    <p className="text-gray-700">Card 3: <span className="font-mono text-xs">4929768900837248</span></p>
                  </div>
                </div>
                
                <div className="p-3 bg-white border border-gray-200 rounded">
                  <h5 className="mb-1 font-medium text-gray-700">Alternative MasterCard Cards</h5>
                  <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                    <p className="text-gray-700">Card 1: <span className="font-mono text-xs">5459051433777487</span></p>
                    <p className="text-gray-700">Card 2: <span className="font-mono text-xs">5491182243178283</span></p>
                    <p className="text-gray-700">Card 3: <span className="font-mono text-xs">5388172137367973</span></p>
                  </div>
                </div>
                
                <div className="p-3 bg-white border border-gray-200 rounded">
                  <h5 className="mb-1 font-medium text-gray-700">Alternative AMEX Cards</h5>
                  <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                    <p className="text-gray-700">Card 1: <span className="font-mono text-xs">370787711978928</span></p>
                    <p className="text-gray-700">Card 2: <span className="font-mono text-xs">340701811823469</span></p>
                    <p className="text-gray-700">Card 3: <span className="font-mono text-xs">374664175202812</span></p>
                  </div>
                </div>
                
                <div className="p-3 bg-white border border-gray-200 rounded">
                  <h5 className="mb-1 font-medium text-gray-700">Additional Cards</h5>
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
    </div>
  );
}

export default PaymentMethods;
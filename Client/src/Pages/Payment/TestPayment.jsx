import React, { useState, useEffect } from 'react';
import PaymentService from '../../services/payment-service';

const TestPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '0771234567',
    address: '123 Main Street',
    city: 'Colombo',
    country: 'Sri Lanka',
    postalCode: '10100',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryCountry: 'Sri Lanka',
    deliveryPostalCode: '',
    useDeliveryAddress: false
  });

  // Load PayHere script
  useEffect(() => {
    if (!document.getElementById('payhere-script')) {
      const script = document.createElement('script');
      script.id = 'payhere-script';
      script.src = 'https://www.payhere.lk/lib/payhere.js';
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Generate dummy order for testing
    const dummyOrder = generateDummyOrder();
    setOrderDetails(dummyOrder);
  }, []);

  // Generate dummy order data for testing
  const generateDummyOrder = () => {
    const orderId = `TEST-${Math.floor(Math.random() * 10000)}`;
    
    return {
      orderId: orderId,
      customerId: "645f340926f4bd4eff1e7111", // Replace with actual customer ID
      restaurantId: "645f340926f4bd4eff1e7222", // Replace with actual restaurant ID
      totalAmount: 1250.00,
      items: [
        { name: "Chicken Burger", price: 650.00, quantity: 1 },
        { name: "French Fries", price: 350.00, quantity: 1 },
        { name: "Coke", price: 250.00, quantity: 1 }
      ]
    };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const initializePayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare delivery details
      const deliveryDetails = formData.useDeliveryAddress ? {
        address: formData.deliveryAddress,
        city: formData.deliveryCity,
        country: formData.deliveryCountry,
        postalCode: formData.deliveryPostalCode
      } : null;

      // Prepare customer details
      const customerDetails = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode
      };
      
      // Initialize payment with the backend
      const response = await PaymentService.initializePayment({
        orderId: orderDetails.orderId,
        customerId: orderDetails.customerId,
        restaurantId: orderDetails.restaurantId,
        amount: orderDetails.totalAmount,
        items: orderDetails.items,
        customerDetails,
        deliveryDetails
      });

      if (response.data && response.data.paymentData) {
        openPayHereForm(response.data.paymentData);
      } else {
        setError('Failed to initialize payment. Please try again.');
      }
    } catch (err) {
      console.error('Payment initialization error:', err);
      setError(err.response?.data?.message || 'Failed to initialize payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openPayHereForm = (paymentData) => {
    // Make sure PayHere script is loaded
    if (!window.payhere) {
      console.error('PayHere script is not loaded');
      setError('Payment gateway not available. Please try again later.');
      return;
    }

    // Set up PayHere event handlers
    window.payhere.onCompleted = function onCompleted(orderId) {
      console.log("Payment completed. OrderID:" + orderId);
      setSuccess(`Payment completed successfully! Order ID: ${orderId}`);
    };

    window.payhere.onDismissed = function onDismissed() {
      console.log("Payment dismissed");
      setError('Payment was canceled.');
    };

    window.payhere.onError = function onError(error) {
      console.log("Error:" + error);
      setError(`Payment error occurred: ${error}`);
    };

    // Start the payment
    window.payhere.startPayment(paymentData);
  };

  if (error && !orderDetails) {
    return (
      <div className="container max-w-6xl p-8 mx-auto mt-8 bg-white rounded-lg shadow-lg">
        <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-400 rounded-md">
          <p className="font-medium">{error}</p>
        </div>
        <button
          className="px-6 py-2 font-semibold text-white transition-colors bg-[#FC8A06] rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          onClick={() => window.history.back()}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container max-w-6xl p-6 py-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#FC8A06]">Test Checkout</h1>
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              <span className="flex items-center justify-center w-8 h-8 text-white bg-[#FC8A06] rounded-full">1</span>
              <span className="font-medium text-[#FC8A06]">Cart</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span className="flex items-center justify-center w-8 h-8 text-white bg-[#FC8A06] rounded-full">2</span>
              <span className="font-medium text-[#FC8A06]">Checkout</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span className="flex items-center justify-center w-8 h-8 text-gray-600 bg-gray-200 rounded-full">3</span>
              <span className="font-medium text-gray-600">Confirmation</span>
            </div>
          </div>
        </div>
        
        {success && (
          <div className="p-4 mb-6 text-green-700 bg-green-100 border border-green-400 rounded-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="font-medium">{success}</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Left Side - Form Fields */}
          <div className="lg:w-2/3">
            <form onSubmit={initializePayment} className="space-y-4">
              <div className="p-5 mb-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                  <span className="flex items-center justify-center w-6 h-6 mr-3 text-xs text-white bg-[#FC8A06] rounded-full">1</span>
                  Customer Details
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                      required
                      placeholder="+94 7X XXX XXXX"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 mb-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                  <span className="flex items-center justify-center w-6 h-6 mr-3 text-xs text-white bg-[#FC8A06] rounded-full">2</span>
                  Billing Address
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full p-2 transition-colors bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                      >
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="India">India</option>
                        <option value="Maldives">Maldives</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full p-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 mb-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <div className="flex items-center mb-4">
                  <span className="flex items-center justify-center w-6 h-6 mr-3 text-xs text-white bg-[#FC8A06] rounded-full">3</span>
                  <input
                    type="checkbox"
                    name="useDeliveryAddress"
                    id="useDeliveryAddress"
                    checked={formData.useDeliveryAddress}
                    onChange={handleInputChange}
                    className="w-4 h-4 mr-3 text-[#FC8A06] border-gray-300 rounded focus:ring-[#FC8A06]"
                  />
                  <label htmlFor="useDeliveryAddress" className="font-medium text-gray-700">
                    Use different delivery address
                  </label>
                </div>

                {formData.useDeliveryAddress && (
                  <div className="pt-2 pl-4 mt-3 border-l-4 border-[#FC8A06]">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">Delivery Address</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block mb-1 font-medium text-gray-700">Address *</label>
                        <input
                          type="text"
                          name="deliveryAddress"
                          value={formData.deliveryAddress}
                          onChange={handleInputChange}
                          className="w-full p-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                          required={formData.useDeliveryAddress}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="block mb-1 font-medium text-gray-700">City *</label>
                          <input
                            type="text"
                            name="deliveryCity"
                            value={formData.deliveryCity}
                            onChange={handleInputChange}
                            className="w-full p-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                            required={formData.useDeliveryAddress}
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium text-gray-700">Country</label>
                          <select
                            name="deliveryCountry"
                            value={formData.deliveryCountry}
                            onChange={handleInputChange}
                            className="w-full p-2 transition-colors bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                          >
                            <option value="Sri Lanka">Sri Lanka</option>
                            <option value="India">India</option>
                            <option value="Maldives">Maldives</option>
                          </select>
                        </div>
                        <div>
                          <label className="block mb-1 font-medium text-gray-700">Postal Code</label>
                          <input
                            type="text"
                            name="deliveryPostalCode"
                            value={formData.deliveryPostalCode}
                            onChange={handleInputChange}
                            className="w-full p-2 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 mb-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                  <span className="flex items-center justify-center w-6 h-6 mr-3 text-xs text-white bg-[#FC8A06] rounded-full">4</span>
                  Test Payment Information
                </h2>
                <p className="mb-4 text-gray-700">
                  <strong>Note:</strong> For testing in sandbox mode, use these test cards:
                </p>
                <div className="p-3 rounded-md bg-gray-50">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <div className="p-2 bg-white rounded shadow-sm">
                      <p className="font-medium text-gray-800">Visa</p>
                      <p className="text-gray-600">4916217501611292</p>
                    </div>
                    <div className="p-2 bg-white rounded shadow-sm">
                      <p className="font-medium text-gray-800">MasterCard</p>
                      <p className="text-gray-600">5307732125531191</p>
                    </div>
                    <div className="p-2 bg-white rounded shadow-sm">
                      <p className="font-medium text-gray-800">AMEX</p>
                      <p className="text-gray-600">346781005510225</p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-md shadow-sm">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-start mt-4 mb-6 lg:hidden">
                <button
                  type="button"
                  className="px-6 py-2 mr-4 font-semibold text-[#FC8A06] transition-colors bg-white border border-[#FC8A06] rounded-lg hover:bg-[#FC8A06] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:ring-offset-2"
                  onClick={() => window.history.back()}
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 font-semibold text-white transition-colors bg-[#FC8A06] rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      Pay Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Right Side - Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              {orderDetails && (
                <div className="p-5 mb-6 bg-white border border-gray-200 rounded-lg shadow-md">
                  <h2 className="flex items-center justify-between pb-3 mb-4 text-lg font-semibold text-gray-800 border-b">
                    <span>Order Summary</span>
                    <span className="text-sm font-normal text-gray-500">{orderDetails.items.length} items</span>
                  </h2>
                  <div className="pr-2 mb-4 space-y-3 overflow-auto max-h-56">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between pb-2 text-gray-700 border-b">
                        <div className="flex items-start">
                          <span className="px-2 py-1 mr-2 text-xs text-[#FC8A06] bg-orange-100 rounded">{item.quantity}</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="font-semibold">LKR {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="py-3 space-y-2 border-t border-b">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>LKR {orderDetails.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>LKR 0.00</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>Included</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-3 text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-[#FC8A06]">LKR {orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  {/* Payment buttons at the bottom of Order Summary */}
                  <div className="mt-6 space-y-3">
                    <button
                      type="submit"
                      onClick={initializePayment}
                      className="flex items-center justify-center w-full px-6 py-2 font-semibold text-white transition-colors bg-[#FC8A06] rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="w-5 h-5 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                          Pay Now
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      className="flex items-center justify-center w-full px-6 py-2 font-semibold text-[#FC8A06] transition-colors bg-white border border-[#FC8A06] rounded-lg hover:bg-[#FC8A06] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:ring-offset-2"
                      onClick={() => window.history.back()}
                      disabled={isLoading}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                      </svg>
                      Back
                    </button>
                  </div>
                  
                  <div className="pt-3 mt-4 border-t">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      Secured by PayHere
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPayment;
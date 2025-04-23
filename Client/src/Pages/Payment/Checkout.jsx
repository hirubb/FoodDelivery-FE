import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentService from '../../services/payment-service';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Sri Lanka',
    postalCode: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryCountry: 'Sri Lanka',
    deliveryPostalCode: '',
    useDeliveryAddress: false
  });

  // Load PayHere script
  useEffect(() => {
    // Load PayHere script if not already loaded
    if (!document.getElementById('payhere-script')) {
      const script = document.createElement('script');
      script.id = 'payhere-script';
      script.src = 'https://www.payhere.lk/lib/payhere.js';
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Get the order details and cart items from state or localStorage
    const orderData = location.state?.orderData || JSON.parse(localStorage.getItem('orderData') || 'null');
    if (orderData) {
      setOrderDetails(orderData);
    } else {
      setError('No order data found. Please add items to your cart first.');
    }
    
    // Load user data if available
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');
    if (userData) {
      setFormData(prevState => ({
        ...prevState,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        country: userData.country || 'Sri Lanka',
        postalCode: userData.postalCode || ''
      }));
    }
  }, [location.state]);

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
        // Open PayHere payment window
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
      navigate('/payment/success', { state: { orderId } });
    };

    window.payhere.onDismissed = function onDismissed() {
      console.log("Payment dismissed");
      setError('Payment was canceled. Please try again.');
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
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container max-w-6xl p-6 py-12 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
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
        
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Left Side - Form Fields */}
          <div className="lg:w-2/3">
            <form onSubmit={initializePayment} className="space-y-6">
              <div className="p-6 mb-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <h2 className="flex items-center mb-6 text-xl font-semibold text-gray-800">
                  <span className="flex items-center justify-center w-6 h-6 mr-3 text-xs text-white bg-[#FC8A06] rounded-full">1</span>
                  Customer Details
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                      required
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                      required
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                      required
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                      required
                      placeholder="+94 7X XXX XXXX"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 mb-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <h2 className="flex items-center mb-6 text-xl font-semibold text-gray-800">
                  <span className="flex items-center justify-center w-6 h-6 mr-3 text-xs text-white bg-[#FC8A06] rounded-full">2</span>
                  Billing Address
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                      required
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                        required
                        placeholder="Colombo"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full p-3 transition-colors bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                      >
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="India">India</option>
                        <option value="Maldives">Maldives</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                        placeholder="10000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 mb-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <div className="flex items-center mb-6">
                  <span className="flex items-center justify-center w-6 h-6 mr-3 text-xs text-white bg-[#FC8A06] rounded-full">3</span>
                  <input
                    type="checkbox"
                    name="useDeliveryAddress"
                    id="useDeliveryAddress"
                    checked={formData.useDeliveryAddress}
                    onChange={handleInputChange}
                    className="w-5 h-5 mr-3 text-[#FC8A06] border-gray-300 rounded focus:ring-[#FC8A06]"
                  />
                  <label htmlFor="useDeliveryAddress" className="font-medium text-gray-700">
                    Use different delivery address
                  </label>
                </div>

                {formData.useDeliveryAddress && (
                  <div className="pt-2 pl-5 mt-4 border-l-4 border-[#FC8A06]">
                    <h2 className="mb-6 text-xl font-semibold text-gray-800">Delivery Address</h2>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Address *</label>
                        <input
                          type="text"
                          name="deliveryAddress"
                          value={formData.deliveryAddress}
                          onChange={handleInputChange}
                          className="w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                          required={formData.useDeliveryAddress}
                          placeholder="123 Delivery Street"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">City *</label>
                          <input
                            type="text"
                            name="deliveryCity"
                            value={formData.deliveryCity}
                            onChange={handleInputChange}
                            className="w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                            required={formData.useDeliveryAddress}
                            placeholder="Kandy"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">Country</label>
                          <select
                            name="deliveryCountry"
                            value={formData.deliveryCountry}
                            onChange={handleInputChange}
                            className="w-full p-3 transition-colors bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                          >
                            <option value="Sri Lanka">Sri Lanka</option>
                            <option value="India">India</option>
                            <option value="Maldives">Maldives</option>
                          </select>
                        </div>
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">Postal Code</label>
                          <input
                            type="text"
                            name="deliveryPostalCode"
                            value={formData.deliveryPostalCode}
                            onChange={handleInputChange}
                            className="w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:border-[#FC8A06]"
                            placeholder="20000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-md shadow-sm">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-start mt-6 mb-8 lg:hidden">
                <button
                  type="button"
                  className="px-6 py-3 mr-4 font-semibold text-[#FC8A06] transition-colors bg-white border border-[#FC8A06] rounded-lg hover:bg-[#FC8A06] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:ring-offset-2"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Back
                </button>
              </div>
            </form>
          </div>
          
          {/* Right Side - Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              {orderDetails && (
                <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-md">
                  <h2 className="flex items-center justify-between pb-4 mb-6 text-xl font-semibold text-gray-800 border-b">
                    <span>Order Summary</span>
                    <span className="text-sm font-normal text-gray-500">{orderDetails.items.length} items</span>
                  </h2>
                  <div className="pr-2 mb-4 space-y-4 overflow-auto max-h-64">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between pb-3 text-gray-700 border-b">
                        <div className="flex items-start">
                          <span className="px-2 py-1 mr-2 text-xs text-[#FC8A06] bg-orange-100 rounded">{item.quantity}</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="font-semibold">LKR {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="py-4 space-y-2 border-t border-b">
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
                  
                  <div className="flex justify-between pt-4 text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-[#FC8A06]">LKR {orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  {/* Payment buttons at the bottom of Order Summary */}
                  <div className="mt-8 space-y-4">
                    <button
                      type="submit"
                      onClick={initializePayment}
                      className="flex items-center justify-center w-full px-8 py-3 font-semibold text-white transition-colors bg-[#FC8A06] rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="w-5 h-5 mr-3 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                      className="flex items-center justify-center w-full px-6 py-3 font-semibold text-[#FC8A06] transition-colors bg-white border border-[#FC8A06] rounded-lg hover:bg-[#FC8A06] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FC8A06] focus:ring-offset-2"
                      onClick={() => navigate(-1)}
                      disabled={isLoading}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                      </svg>
                      Back to Cart
                    </button>
                  </div>
                  
                  <div className="pt-4 mt-6 border-t">
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

export default CheckoutPage;
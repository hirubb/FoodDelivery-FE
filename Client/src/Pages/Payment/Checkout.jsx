import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentService from '../../services/payment-service';
import OrderService from '../../services/order-service';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
  });

  // Load PayHere script
  useEffect(() => {
    if (!document.getElementById('payhere-script')) {
      const script = document.createElement('script');
      script.id = 'payhere-script';
      script.src = 'https://www.payhere.lk/lib/payhere.js';
      script.async = true;
      script.onload = () => {
        console.log('PayHere script loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load PayHere script');
        setError('Payment gateway failed to load. Please refresh the page and try again.');
      };
      document.body.appendChild(script);
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
    
    // Check for payment status from URL params (redirect from payment gateway)
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');
    const orderId = urlParams.get('order_id') || location.state?.orderId || localStorage.getItem('currentOrderId');
    
    if (paymentStatus === 'success' && orderId) {
      setSuccess(`Payment completed successfully! Order ID: ${orderId}`);
      // Verify payment status with backend
      verifyPaymentStatus(orderId);
    } else if (paymentStatus === 'failed' && orderId) {
      setError(`Payment failed. Please try again or contact support.`);
    } else if (paymentStatus === 'canceled' && orderId) {
      setError(`Payment was canceled.`);
    }
    
    fetchOrderData();
  }, [location]);

  // Verify payment status with backend
  const verifyPaymentStatus = async (orderId) => {
    try {
      const response = await PaymentService.getPaymentStatus(orderId);
      if (response.data && response.data.status === 'success') {
        setSuccess(`Payment verified successfully! Your order is confirmed.`);
        // Redirect to success page after short delay
        setTimeout(() => {
          navigate('/payment/success', { state: { orderId } });
        }, 2000);
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
      // Don't show error as the payment might still be processing
    }
  };

  const fetchOrderData = async () => {
    try {
      // Clear any previous errors
      setError('');
      
      // First check for orderId from location state
      let orderId = location.state?.orderId;
      console.log("Order ID from location state:", orderId);
      
      // Then try localStorage if not found in state
      if (!orderId) {
        orderId = localStorage.getItem('currentOrderId');
        console.log("Order ID from localStorage:", orderId);
      }
      
      // As a last resort, check URL params
      if (!orderId) {
        const params = new URLSearchParams(window.location.search);
        orderId = params.get('orderId') || params.get('order_id');
        console.log("Order ID from URL params:", orderId);
      }
      
      console.log("Final orderId being used:", orderId);
      
      if (!orderId) {
        setError('No order ID found. Please add items to your cart first.');
        setIsLoading(false);
        return;
      }
      
      console.log("Fetching order with ID:", orderId);
      const response = await OrderService.getOrderById(orderId);
      console.log("Order API response:", response);
      
      if (response.data && response.data.success && response.data.order) {
        const orderData = response.data.order;
        console.log("Order successfully loaded:", orderData);
        setOrderDetails(orderData);
        localStorage.setItem('currentOrderId', orderData.orderId || orderId);
      } else {
        throw new Error(response.data?.error || 'Could not retrieve order details');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.message || 'Failed to load order data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Save user data for future use
      localStorage.setItem('userData', JSON.stringify(formData));

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

      // Format items properly for the payment service
      const formattedItems = orderDetails.items.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name || `Menu Item ${item.menuItemId}`, // Fallback name if needed
        price: item.price || 0,
        quantity: item.quantity
      }));

      // Initialize payment via PaymentService
      const paymentData = {
        orderId: orderDetails.orderId,
        customerId: orderDetails.customerId,
        restaurantId: orderDetails.restaurantId,
        amount: orderDetails.totalAmount,
        items: formattedItems,
        customerDetails
      };
      
      console.log('Initializing payment with:', paymentData);
      
      const response = await PaymentService.initializePayment(paymentData);
      console.log('Payment initialized:', response.data);
      
      // Handle payment initialization response
      if (response.data && response.data.paymentData) {
        openPayHereForm(response.data.paymentData);
      } else {
        throw new Error('Invalid payment initialization response');
      }
    } catch (err) {
      console.error('Payment initialization error:', err);
      setError(err.response?.data?.message || 'Failed to process payment. Please try again.');
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
      
      // Wait a moment to allow the payment notification to be processed by the backend
      setTimeout(() => {
        // Verify payment status with backend
        verifyPaymentStatus(orderId);
        // Navigate to success page
        navigate('/payment/success', { state: { orderId: orderDetails.orderId } });
      }, 1500);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 rounded-full border-t-orange-500 animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Enhanced error display
  if (error) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
          <div className="p-4 mb-6 text-red-700 border-l-4 border-red-500 rounded-md bg-red-50" data-testid="error-box">
            <div className="flex">
              <svg className="w-6 h-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
          <button
            className="w-full px-6 py-3 text-white transition duration-200 bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            onClick={() => navigate('/')}
            data-testid="home-button"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-5xl p-6 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Order</h1>
          <p className="mt-2 text-gray-600">Please provide your details to finalize your purchase</p>
        </div>
        
        {success && (
          <div className="p-4 mb-8 text-green-700 border-l-4 border-green-500 rounded-md shadow-sm bg-green-50">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="font-medium">{success}</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Form Fields */}
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Details */}
              <div className="p-6 bg-white border rounded-lg shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Customer Details</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-3 transition duration-200 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                      required
                      data-testid="firstName"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 transition duration-200 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                      required
                      data-testid="lastName"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 transition duration-200 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                      required
                      data-testid="email"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 transition duration-200 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                      required
                      data-testid="phone"
                      placeholder="+94 71 234 5678"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="p-6 bg-white border rounded-lg shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Delivery Address</h2>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 transition duration-200 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    required
                    data-testid="address"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-3 transition duration-200 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                      required
                      data-testid="city"
                      placeholder="Colombo"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full p-3 transition duration-200 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                      data-testid="country"
                    >
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="India">India</option>
                      <option value="Maldives">Maldives</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full p-3 transition duration-200 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                      data-testid="postalCode"
                      placeholder="10100"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information Section (Testing) */}
              {process.env.NODE_ENV !== 'production' && (
                <div className="p-6 bg-white border rounded-lg shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold text-gray-800">Test Payment Information</h2>
                  <div className="p-4 mb-4 text-blue-800 border-l-4 border-blue-500 rounded-md bg-blue-50">
                    <p className="flex items-center font-medium">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      For testing in sandbox mode, use these test cards:
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="p-4 transition-all rounded-lg shadow-sm bg-gray-50 hover:shadow-md">
                      <p className="mb-2 font-semibold text-gray-800">Visa</p>
                      <p className="font-mono text-gray-600">4916217501611292</p>
                    </div>
                    <div className="p-4 transition-all rounded-lg shadow-sm bg-gray-50 hover:shadow-md">
                      <p className="mb-2 font-semibold text-gray-800">MasterCard</p>
                      <p className="font-mono text-gray-600">5307732125531191</p>
                    </div>
                    <div className="p-4 transition-all rounded-lg shadow-sm bg-gray-50 hover:shadow-md">
                      <p className="mb-2 font-semibold text-gray-800">AMEX</p>
                      <p className="font-mono text-gray-600">346781005510225</p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 text-red-700 border-l-4 border-red-500 rounded-md bg-red-50" data-testid="error-message">
                  <div className="flex">
                    <svg className="w-5 h-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 font-medium text-orange-500 transition duration-200 bg-white border border-orange-500 rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                  disabled={isLoading}
                  data-testid="back-button"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center flex-grow px-6 py-3 font-medium text-white transition duration-200 bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                  disabled={isLoading}
                  data-testid="checkout-button"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Pay now
                      <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="w-full mt-8 md:mt-0 md:w-1/3">
            {orderDetails && (
              <div className="sticky p-6 bg-white border rounded-lg shadow-sm top-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Order Summary</h2>
                <div className="mb-6 overflow-auto max-h-64" data-testid="order-items">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-3 border-b border-gray-200">
                      <div className="flex items-start">
                        <span className="flex items-center justify-center w-6 h-6 mr-3 text-xs font-medium text-white bg-orange-500 rounded-full">{item.quantity}</span>
                        <span className="font-medium text-gray-800">{item.name || `Item #${item.menuItemId}`}</span>
                      </div>
                      <span className="font-medium text-gray-800">LKR {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 mt-2 border-t border-gray-200">
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>Subtotal</span>
                    <span>LKR {orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between pt-4 mt-4 text-lg font-bold border-t border-gray-200">
                    <span>Total</span>
                    <span>LKR {orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="px-4 py-4 mt-6 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <span>Secured by PayHere</span>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <img src="/api/placeholder/40/24" alt="Visa" className="h-6 grayscale opacity-70" />
                    <img src="/api/placeholder/40/24" alt="Mastercard" className="h-6 grayscale opacity-70" />
                    <img src="/api/placeholder/40/24" alt="Amex" className="h-6 grayscale opacity-70" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
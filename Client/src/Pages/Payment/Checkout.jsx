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

      // Calculate the total with delivery fee
      const itemsTotal = orderDetails.totalAmount;
      const deliveryFee = itemsTotal * 0.05;
      const totalWithDelivery = orderDetails.totalAmount;

      // Initialize payment via PaymentService
      const paymentData = {
        orderId: orderDetails.orderId,
        customerId: orderDetails.customerId,
        restaurantId: orderDetails.restaurantId,
        amount: totalWithDelivery, // Updated to include delivery fee
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
      <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-gray-200 rounded-full border-t-orange-500 animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your order details...</p>
          <p className="mt-2 text-sm text-gray-500">This will just take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800">Something went wrong</h2>
            <p className="text-gray-600" data-testid="error-box">{error}</p>
          </div>
          <button
            className="w-full px-6 py-3 font-medium text-white transition duration-200 bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
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
    <div className="min-h-screen py-8 md:py-12 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Complete Your Order</h1>
          <p className="max-w-2xl mx-auto mt-3 text-gray-600">Please provide your information to finalize your purchase</p>
        </div>
        
        {success && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center p-4 border border-green-200 rounded-lg shadow-sm bg-green-50">
              <div className="flex-shrink-0 mr-3">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <p className="font-medium text-green-800">{success}</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-8 mx-auto lg:flex-row max-w-7xl">
          {/* Form Fields */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Details */}
              <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="flex items-center text-xl font-semibold text-gray-800">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer Details
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full p-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                        required
                        data-testid="firstName"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full p-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                        required
                        data-testid="lastName"
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                        required
                        data-testid="email"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                        required
                        data-testid="phone"
                        placeholder="+94 71 234 5678"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="flex items-center text-xl font-semibold text-gray-800">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Delivery Address
                  </h2>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700">Street Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                      required
                      data-testid="address"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-700">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                        required
                        data-testid="city"
                        placeholder="Colombo"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-700">Country</label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full p-3 transition duration-150 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                        data-testid="country"
                      >
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="India">India</option>
                        <option value="Maldives">Maldives</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block mb-2 text-sm font-medium text-gray-700">Postal Code</label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full p-3 transition duration-150 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                        data-testid="postalCode"
                        placeholder="10100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information Section (Testing) */}
              {process.env.NODE_ENV !== 'production' && (
                <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="flex items-center text-xl font-semibold text-gray-800">
                      <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Test Payment Information
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="p-4 mb-6 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            For testing in sandbox mode, use these test cards. Any future date and CVV can be used.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="p-4 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow">
                        <div className="flex items-center mb-2">
                          <svg className="w-6 h-6 mr-2 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 4h2.5v2.5h-2.5v-2.5zm3.5 0h2.5v2.5h-2.5v-2.5zm3.5 0h2.5v2.5h-2.5v-2.5zm3.5 0h2.5v2.5h-2.5v-2.5zm3.5 0h2v2.5h-2v-2.5zm2 3.5v2.5h-2v-2.5h2zm-17 2.5v-2.5h2.5v2.5h-2.5zm0 3.5v-2.5h2.5v2.5h-2.5zm0 3.5v-2.5h2.5v2.5h-2.5zm17-7v2.5h-2v-2.5h2zm-3 10h-2.5v-2.5h2.5v2.5zm-3.5 0h-2.5v-2.5h2.5v2.5zm-3.5 0h-2.5v-2.5h2.5v2.5zm-3.5 0h-2.5v-2.5h2.5v2.5z"/>
                          </svg>
                          <span className="font-semibold text-gray-800">Visa</span>
                        </div>
                        <p className="p-2 font-mono text-sm text-gray-700 border border-gray-200 rounded bg-gray-50">4916217501611292</p>
                      </div>
                      <div className="p-4 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow">
                        <div className="flex items-center mb-2">
                          <svg className="w-6 h-6 mr-2 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.343 18.031c.058-.049.12-.098.181-.146-1.177.783-2.59 1.238-4.107 1.238-4.113 0-7.447-3.334-7.447-7.447 0-4.113 3.334-7.447 7.447-7.447 1.517 0 2.93.455 4.107 1.238-.061-.049-.123-.098-.181-.146-2.02-1.651-5.303-2.469-8.015-.724-2.672 1.719-2.139 5.825-2.139 5.825l.009-.013c-.023 0-.076.063-.076.063.021.428.088.839.189 1.235h3.315v1.484h-2.912c.488 1.335 1.454 2.415 2.679 3.037v-1.684h1.484v2.01c.358.062.725.098 1.097.098.372 0 .739-.036 1.097-.098v-2.01h1.484v1.684c1.225-.622 2.191-1.702 2.679-3.037h-2.912v-1.484h3.315c.101-.396.168-.807.189-1.235 0 0-.053-.063-.076-.063l.009.013s.533-4.106-2.139-5.825c-2.712-1.745-5.995-.927-8.015.724zm8.223-.015c.063-.499.269-.938.578-1.285.618-.694 1.512-.822 2-.822s1.382.128 2 .822c.309.347.515.786.578 1.285h.568c-.089-.698-.334-1.339-.736-1.864-.687-.9-1.696-1.419-2.78-1.419-1.246 0-2.385.637-3.047 1.668h-7.55c-.662-1.031-1.801-1.668-3.047-1.668-1.084 0-2.093.519-2.78 1.419-.402.525-.647 1.166-.736 1.864h.568c.063-.499.269-.938.578-1.285.618-.694 1.512-.822 2-.822s1.382.128 2 .822c.309.347.515.786.578 1.285h1.889v-1.541h3.919v1.541h1.994z"/>
                          </svg>
                          <span className="font-semibold text-gray-800">MasterCard</span>
                        </div>
                        <p className="p-2 font-mono text-sm text-gray-700 border border-gray-200 rounded bg-gray-50">5307732125531191</p>
                      </div>
                      <div className="p-4 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow">
                        <div className="flex items-center mb-2">
                          <svg className="w-6 h-6 mr-2 text-blue-800" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23 5v14h-22v-14h22zm1-2h-24v18h24v-18zm-3 3h-18v12h18v-12zm-2 9h-14v1h14v-1zm0-2h-14v1h14v-1zm0-2h-14v1h14v-1zm-7-4h7v2h-7v-2z"/>
                          </svg>
                          <span className="font-semibold text-gray-800">AMEX</span>
                        </div>
                        <p className="p-2 font-mono text-sm text-gray-700 border border-gray-200 rounded bg-gray-50">346781005510225</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 border border-red-200 rounded-lg bg-red-50" data-testid="error-message">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="w-full mt-8 lg:w-1/3 lg:mt-0">
            {orderDetails && (
              <div className="sticky overflow-hidden bg-white border border-gray-200 shadow-sm top-8 rounded-xl">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="flex items-center text-xl font-semibold text-gray-800">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Order Summary
                  </h2>
                </div>
                <div className="p-6">
                  <div className="pr-2 mb-6 -mr-2 space-y-3 overflow-auto max-h-64" data-testid="order-items">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-start">
                          <div className="flex items-center justify-center w-6 h-6 mr-3 text-xs font-medium text-white bg-orange-500 rounded-full">
                            {item.quantity}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{item.name || `Item #${item.menuItemId}`}</h4>
                            <p className="text-sm text-gray-500">LKR {item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                        <span className="font-medium text-gray-800">LKR {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 mt-2 space-y-3 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>LKR {orderDetails.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>LKR {(orderDetails.totalAmount * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-4 mt-2 text-lg font-bold text-gray-600 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-orange-600">LKR {(orderDetails.totalAmount).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Added buttons to order summary */}
                  <div className="flex flex-col gap-4 mt-6">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="flex items-center justify-center w-full px-6 py-3 font-medium text-white transition duration-150 bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                      disabled={isLoading}
                      data-testid="checkout-button"
                    >
                      {isLoading ? (
                        <>
                          <svg className="w-5 h-5 mr-3 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                    
                    <button
                      type="button"
                      onClick={() => navigate('/restaurants')}
                      className="flex items-center justify-center w-full px-6 py-3 font-medium text-gray-600 transition duration-150 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                      data-testid="back-button"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Restaurants
                    </button>
                  </div>

                  <div className="p-4 mt-6 border border-gray-100 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-sm text-gray-600">Secure payment via PayHere</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

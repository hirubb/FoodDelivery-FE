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

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Test Checkout</h1>
      
      {success && (
        <div className="px-4 py-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded">
          {success}
        </div>
      )}

      {orderDetails && (
        <div className="p-4 mb-8 border rounded shadow">
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          <div className="space-y-2">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.quantity}x {item.name}</span>
                <span>LKR {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 mt-2 font-bold border-t">
              <span>Total:</span>
              <span>LKR {orderDetails.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={initializePayment}>
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">Customer Details</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">Billing Address</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="useDeliveryAddress"
              id="useDeliveryAddress"
              checked={formData.useDeliveryAddress}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="useDeliveryAddress">Use different delivery address</label>
          </div>

          {formData.useDeliveryAddress && (
            <div className="pl-4 border-l-2 border-gray-300">
              <h2 className="mb-4 text-xl font-semibold">Delivery Address</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-2">Address *</label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required={formData.useDeliveryAddress}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-2">City *</label>
                    <input
                      type="text"
                      name="deliveryCity"
                      value={formData.deliveryCity}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required={formData.useDeliveryAddress}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Country</label>
                    <input
                      type="text"
                      name="deliveryCountry"
                      value={formData.deliveryCountry}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="deliveryPostalCode"
                      value={formData.deliveryPostalCode}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 mb-6 border rounded shadow">
          <h2 className="mb-4 text-xl font-semibold">Test Payment Information</h2>
          <p className="mb-4 text-gray-700">
            <strong>Note:</strong> For testing in sandbox mode, use these test cards:
            <br />
            - Visa: 4916217501611292
            <br />
            - MasterCard: 5307732125531191
            <br />
            - AMEX: 346781005510225
          </p>
        </div>

        {error && (
          <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 mr-2 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
            disabled={isLoading}
          >
            Back
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestPayment;
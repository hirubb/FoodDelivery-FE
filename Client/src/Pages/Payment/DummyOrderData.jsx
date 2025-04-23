import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DummyOrderData = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState({
    orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
    customerId: 'CUST-123',
    restaurantId: 'REST-456',
    totalAmount: 2500.00,
    items: [
      { id: 1, name: 'Chicken Biriyani', price: 850.00, quantity: 2 },
      { id: 2, name: 'Mango Lassi', price: 350.00, quantity: 1 },
      { id: 3, name: 'Garlic Naan', price: 450.00, quantity: 1 }
    ],
    // Adding customer information for Payhere
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '0771234567',
    customerAddress: '123 Main St, Colombo',
    customerCity: 'Colombo',
    paymentMethod: 'payhere'
  });
  
  // Payhere sandbox endpoint
  const payhereEndpoint = 'https://sandbox.payhere.lk/pay/checkout';

  // Load existing order data on component mount
  useEffect(() => {
    const savedOrderData = localStorage.getItem('orderData');
    if (savedOrderData) {
      try {
        setOrderData(JSON.parse(savedOrderData));
      } catch (e) {
        console.error('Error parsing saved order data:', e);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderData.items];
    updatedItems[index][field] = field === 'price' || field === 'quantity' ? parseFloat(value) : value;
    
    // Recalculate total amount
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setOrderData(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: newTotal
    }));
  };

  const addItem = () => {
    setOrderData(prev => {
      const newItems = [...prev.items, { 
        id: Date.now(), 
        name: 'New Item', 
        price: 100.00, 
        quantity: 1 
      }];
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...prev,
        items: newItems,
        totalAmount: newTotal
      };
    });
  };

  const removeItem = (index) => {
    const updatedItems = orderData.items.filter((_, i) => i !== index);
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setOrderData(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: newTotal
    }));
  };

  const generateRandomOrder = () => {
    const randomItems = [
      { name: 'Chicken Biriyani', price: 850.00 },
      { name: 'Vegetable Biriyani', price: 750.00 },
      { name: 'Mutton Curry', price: 950.00 },
      { name: 'Butter Chicken', price: 900.00 },
      { name: 'Cheese Naan', price: 300.00 },
      { name: 'Garlic Naan', price: 250.00 },
      { name: 'Mango Lassi', price: 350.00 },
      { name: 'Sweet Lassi', price: 300.00 },
      { name: 'Gulab Jamun', price: 200.00 },
      { name: 'Rasgulla', price: 220.00 }
    ];
    
    // Select 2-5 random items
    const numItems = Math.floor(Math.random() * 4) + 2;
    const selectedItems = [];
    
    for (let i = 0; i < numItems; i++) {
      const randomIndex = Math.floor(Math.random() * randomItems.length);
      const item = randomItems[randomIndex];
      const quantity = Math.floor(Math.random() * 3) + 1;
      
      selectedItems.push({
        id: Date.now() + i,
        name: item.name,
        price: item.price,
        quantity: quantity
      });
    }
    
    const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Random customer data
    const randomNames = ['John Doe', 'Jane Smith', 'Dinesh Kumar', 'Malini Perera', 'Ashan Fernando'];
    const randomEmail = ['john@example.com', 'jane@example.com', 'dinesh@example.com', 'malini@example.com', 'ashan@example.com'];
    const randomPhone = ['0771234567', '0762345678', '0753456789', '0714567890', '0725678901'];
    const randomAddress = ['123 Main St', '456 Park Avenue', '789 Lake Road', '321 Hill Street', '654 Beach Road'];
    const randomCity = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna'];
    
    const randomIndex = Math.floor(Math.random() * 5);
    
    setOrderData({
      orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
      customerId: `CUST-${Math.floor(Math.random() * 1000)}`,
      restaurantId: `REST-${Math.floor(Math.random() * 100)}`,
      totalAmount: totalAmount,
      items: selectedItems,
      customerName: randomNames[randomIndex],
      customerEmail: randomEmail[randomIndex],
      customerPhone: randomPhone[randomIndex],
      customerAddress: randomAddress[randomIndex],
      customerCity: randomCity[randomIndex],
      paymentMethod: 'payhere'
    });
  };

  const saveOrderData = () => {
    localStorage.setItem('orderData', JSON.stringify(orderData));
    alert('Order data saved to localStorage successfully!');
  };

  const proceedToCheckout = () => {
    if (orderData.items.length === 0) {
      alert('Please add at least one item to the order before proceeding to checkout.');
      return;
    }
    
    // Save to localStorage before navigating
    localStorage.setItem('orderData', JSON.stringify(orderData));
    
    if (orderData.paymentMethod === 'payhere') {
      // Process with Payhere
      initiatePayherePayment();
    } else {
      // Use original checkout flow
      navigate('/checkout', { state: { orderData } });
    }
  };

  // Function to initiate Payhere payment
  const initiatePayherePayment = () => {
    // Create a form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = payhereEndpoint;
    
    // Construct Payhere payment parameters
    const payhereParams = {
      merchant_id: 'YOUR_PAYHERE_MERCHANT_ID', // Replace with your actual merchant ID
      return_url: window.location.origin + '/payment-success',
      cancel_url: window.location.origin + '/payment-canceled',
      notify_url: 'https://your-backend-api.com/payment-notification', // Your backend API endpoint
      order_id: orderData.orderId,
      items: orderData.items.map(item => item.name).join(', '),
      amount: orderData.totalAmount.toFixed(2),
      currency: 'LKR',
      first_name: orderData.customerName.split(' ')[0],
      last_name: orderData.customerName.split(' ').slice(1).join(' '),
      email: orderData.customerEmail,
      phone: orderData.customerPhone,
      address: orderData.customerAddress,
      city: orderData.customerCity,
      country: 'Sri Lanka',
      delivery_address: orderData.customerAddress,
      delivery_city: orderData.customerCity,
      delivery_country: 'Sri Lanka',
      custom_1: orderData.customerId,
      custom_2: orderData.restaurantId
    };
    
    // Add input fields to the form
    Object.entries(payhereParams).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    
    // Append form to body and submit
    document.body.appendChild(form);
    
    // For demo purposes, show what data would be sent
    console.log('Payhere payment parameters:', payhereParams);
    
    // In a real application, you would uncomment this:
    // form.submit();
    
    // For this dummy implementation, just show an alert and navigate
    alert(`
      Payhere payment would be initiated with:
      Order ID: ${orderData.orderId}
      Amount: LKR ${orderData.totalAmount.toFixed(2)}
      Customer: ${orderData.customerName}
      
      In a real implementation, you would be redirected to Payhere.
    `);
    
    // Clean up form element
    document.body.removeChild(form);
    
    // Navigate to a dummy success page
    navigate('/payment-success', { state: { orderData } });
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Create Dummy Order Data</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Order ID</label>
        <input 
          type="text" 
          name="orderId" 
          value={orderData.orderId} 
          onChange={handleInputChange} 
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Customer ID</label>
        <input 
          type="text" 
          name="customerId" 
          value={orderData.customerId} 
          onChange={handleInputChange} 
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Restaurant ID</label>
        <input 
          type="text" 
          name="restaurantId" 
          value={orderData.restaurantId} 
          onChange={handleInputChange} 
          className="w-full p-2 border rounded"
        />
      </div>
      
      {/* Customer Details for Payhere */}
      <div className="p-4 mb-4 border rounded bg-blue-50">
        <h2 className="mb-4 text-xl font-semibold">Customer Details (for Payhere)</h2>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2">Customer Name</label>
            <input 
              type="text" 
              name="customerName" 
              value={orderData.customerName} 
              onChange={handleInputChange} 
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-2">Customer Email</label>
            <input 
              type="email" 
              name="customerEmail" 
              value={orderData.customerEmail} 
              onChange={handleInputChange} 
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-2">Customer Phone</label>
            <input 
              type="text" 
              name="customerPhone" 
              value={orderData.customerPhone} 
              onChange={handleInputChange} 
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-2">Customer Address</label>
            <input 
              type="text" 
              name="customerAddress" 
              value={orderData.customerAddress} 
              onChange={handleInputChange} 
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-2">Customer City</label>
            <input 
              type="text" 
              name="customerCity" 
              value={orderData.customerCity} 
              onChange={handleInputChange} 
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-2">Payment Method</label>
            <select
              name="paymentMethod"
              value={orderData.paymentMethod}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="payhere">Payhere</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Order Items</h2>
          <button 
            type="button" 
            onClick={generateRandomOrder} 
            className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-700"
          >
            Generate Random Order
          </button>
        </div>
        
        {orderData.items.length === 0 ? (
          <div className="p-4 mb-4 text-yellow-700 bg-yellow-100 border border-yellow-400 rounded">
            No items in order. Please add at least one item.
          </div>
        ) : (
          orderData.items.map((item, index) => (
            <div key={item.id} className="flex flex-wrap gap-2 p-2 mb-2 border rounded">
              <div className="flex-1">
                <label className="block mb-1 text-sm">Item Name</label>
                <input 
                  type="text" 
                  value={item.name} 
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)} 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="w-24">
                <label className="block mb-1 text-sm">Price (LKR)</label>
                <input 
                  type="number" 
                  value={item.price} 
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)} 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="w-24">
                <label className="block mb-1 text-sm">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  value={item.quantity} 
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-end w-full mt-2 md:w-auto">
                <button 
                  type="button" 
                  onClick={() => removeItem(index)} 
                  className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
        
        <button 
          type="button" 
          onClick={addItem} 
          className="px-4 py-2 mt-2 text-white bg-green-500 rounded hover:bg-green-700"
        >
          Add Item
        </button>
      </div>
      
      <div className="p-4 mb-6 border rounded bg-gray-50">
        <h2 className="mb-2 text-xl font-semibold">Order Summary</h2>
        {orderData.items.length === 0 ? (
          <div className="text-gray-500">No items added yet</div>
        ) : (
          <div className="space-y-1">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.quantity}x {item.name}</span>
                <span>LKR {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 mt-2 font-bold border-t">
              <span>Total Amount:</span>
              <span>LKR {orderData.totalAmount.toFixed(2)}</span>
            </div>
            <div className="pt-2 mt-2 text-sm text-blue-600 border-t">
              Payment Method: <span className="font-semibold">{orderData.paymentMethod === 'payhere' ? 'Payhere Payment Gateway' : 'Cash on Delivery'}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-4">
        <button 
          type="button" 
          onClick={saveOrderData} 
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Save to localStorage
        </button>
        <button 
          type="button" 
          onClick={proceedToCheckout} 
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
          disabled={orderData.items.length === 0}
        >
          {orderData.paymentMethod === 'payhere' ? 'Pay with Payhere' : 'Proceed to Checkout'}
        </button>
        <button 
          type="button" 
          onClick={() => navigate('/')} 
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default DummyOrderData;
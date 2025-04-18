import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../config/setting';

const CardPaymentForm = ({ orderId, totalAmount }) => {
  const navigate = useNavigate();
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format card number with spaces for better readability 
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardDetails(prev => ({
      ...prev,
      cardNumber: formattedValue
    }));
  };

  // Create a payment token using a payment gateway SDK (this is a mock implementation)
  const createPaymentToken = async (cardData) => {
    try {
      // In a real implementation, you would use a payment gateway SDK
      // For example, with Stripe: return await stripe.createToken(cardData);
      
      // For this demo, we're simulating a token response
      // IMPORTANT: This is just for demonstration purposes
      // In production, use an actual payment gateway's SDK
      
      // Simulate API call to tokenization service
      const response = await axios.post(`${API_BASE_URL}/api/payments/tokenize`, {
        cardNumber: cardData.cardNumber.replace(/\s/g, ''),
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        cvv: cardData.cvv
      });
      
      return response.data.token;
    } catch (error) {
      console.error('Tokenization error:', error);
      throw new Error('Failed to secure card information');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Basic validation
      if (!cardDetails.cardNumber || !cardDetails.cardholderName || 
          !cardDetails.expiryMonth || !cardDetails.expiryYear || !cardDetails.cvv) {
        throw new Error('Please fill in all card details');
      }
      
      // Combine expiry month and year to MM/YY format
      const expiryDate = `${cardDetails.expiryMonth}/${cardDetails.expiryYear.slice(-2)}`;
      
      // Create a payment token (in real implementation, use a payment gateway SDK)
      const paymentToken = await createPaymentToken({
        cardNumber: cardDetails.cardNumber,
        expiryMonth: cardDetails.expiryMonth,
        expiryYear: cardDetails.expiryYear,
        cvv: cardDetails.cvv
      });
      
      // Send only the token to your server, not the actual card details
      const response = await axios.post(`${API_BASE_URL}/api/payments/process-card`, {
        orderId,
        paymentToken
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        // Navigate to success page
        navigate('/payment/success', { 
          state: { 
            paymentId: response.data.paymentId,
            orderId 
          } 
        });
      } else {
        setError(response.data.message || 'Payment failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-payment-container">
      <h2>Card Payment</h2>
      <div className="order-summary">
        <p>Order #: {orderId}</p>
        <p>Total Amount: LKR {totalAmount?.toFixed(2)}</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardDetails.cardNumber}
            onChange={handleCardNumberChange}
            maxLength="19"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Cardholder Name</label>
          <input
            type="text"
            name="cardholderName"
            placeholder="John Doe"
            value={cardDetails.cardholderName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group expiry">
            <label>Expiry Date</label>
            <div className="expiry-inputs">
              <select
                name="expiryMonth"
                value={cardDetails.expiryMonth}
                onChange={handleInputChange}
                required
              >
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = i + 1;
                  return (
                    <option key={month} value={month.toString().padStart(2, '0')}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  );
                })}
              </select>
              
              <select
                name="expiryYear"
                value={cardDetails.expiryYear}
                onChange={handleInputChange}
                required
              >
                <option value="">YYYY</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          
          <div className="form-group cvv">
            <label>CVV</label>
            <input
              type="text"
              name="cvv"
              placeholder="123"
              value={cardDetails.cvv}
              onChange={handleInputChange}
              maxLength="4"
              required
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="pay-button"
          disabled={loading}
        >
          {loading ? 'Processing...' : `Pay LKR ${totalAmount?.toFixed(2)}`}
        </button>
      </form>
      
      <div className="secure-notice">
        <p>Your payment information is securely processed.</p>
        <p>We do not store your complete card details.</p>
      </div>
    </div>
  );
};

export default CardPaymentForm;
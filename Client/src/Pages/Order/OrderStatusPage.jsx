import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function OrderStatusPage() {
  const { id } = useParams();
  const [status, setStatus] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5001/orders/${id}/status`)
      .then(res => setStatus(res.data.status));
  }, [id]);

  return (
    <div>
      <h2>Order Status</h2>
      <p>Status: <strong>{status}</strong></p>
    </div>
  );
}

export default OrderStatusPage;

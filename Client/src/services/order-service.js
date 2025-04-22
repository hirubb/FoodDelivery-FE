import axios from 'axios';

const ORDER_BASE_URL = "http://localhost:5001";

const orderService = {
  placeOrder: (orderData) => axios.post(`${ORDER_BASE_URL}/orders`, orderData),
  getOrders: () => axios.get(`${ORDER_BASE_URL}/orders`),
  getOrderById: (id) => axios.get(`${ORDER_BASE_URL}/orders/${id}`)
};

export default orderService;

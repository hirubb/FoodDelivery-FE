import React, { useEffect, useState } from "react";
import orderService from "../../services/order-service";
import { jwtDecode } from "jwt-decode";
import OrderLocationMap from "../../components/OrderManagement/OrderLocationMap";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const getCustomerIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.id || decoded._id; // adjust based on your token structure
    } catch (err) {
      console.error("Failed to decode token", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const customerId = getCustomerIdFromToken();
      console.log("Customer ID from token:", customerId);
      if (!customerId) {
        setError("No customer ID found. Please place an order first.");
        setLoading(false);
        return;
      }

      try {
        const res = await orderService.getCustomerOrders(customerId);
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching orders", err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); // collapse if already expanded
    } else {
      setExpandedOrderId(orderId); // expand this order
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p>No orders found. Place your first order!</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="border rounded-xl p-4 shadow">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Order ID: {order._id}
                </h3>
                <button 
                  onClick={() => toggleOrderDetails(order._id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {expandedOrderId === order._id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              
              <div className="mt-2">
                <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
              
              {/* Expanded order details */}
              {expandedOrderId === order._id && (
                <div className="mt-4 border-t pt-4">
                  <div className="mb-4">
                    <p className="font-semibold mb-2">Items:</p>
                    <ul className="list-disc pl-5">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name || `Item ${idx+1}`} x {item.quantity} — ${item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Location Map */}
                  {order.deliveryLocation && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Delivery Location</h4>
                      <OrderLocationMap location={order.deliveryLocation} />
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage
import React, { useEffect, useState } from "react";
import orderService from "../../services/order-service";
import { jwtDecode } from "jwt-decode";


const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
              <h3 className="text-lg font-medium mb-2">
                Order ID: {order._id}
              </h3>
              <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <div className="mt-2">
                <p className="font-semibold">Items:</p>
                <ul className="list-disc pl-5">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} x {item.quantity} — ${item.price}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;

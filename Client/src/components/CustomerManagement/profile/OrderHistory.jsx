import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import orderService from "../../../services/order-service";
// import restaurantService from "../../../services/restaurant-service";
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

  // Function to format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Function to determine status badge style
  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered':
        return 'inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full';
      case 'in progress':
      case 'processing':
        return 'inline-flex px-2 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full';
      case 'cancelled':
        return 'inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full';
      default:
        return 'inline-flex px-2 text-xs font-semibold leading-5 text-gray-800 bg-gray-100 rounded-full';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <FaHistory className="text-gray-700 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
      </div>
      
      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No orders found. Place your first order!</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="mb-6 overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Restaurant</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">AMB{order._id.substring(0, 8).toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.restaurant?.name || "Restaurant"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(order.createdAt || new Date())}</div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">LKR{order.totalAmount.toFixed(2)}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
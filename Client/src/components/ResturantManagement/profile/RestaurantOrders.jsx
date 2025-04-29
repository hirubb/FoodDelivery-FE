import React, { useEffect, useState } from "react";
import restaurantService from "../../../services/restaurant-service";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantService.getMyRestaurants();
        const restaurantList = response?.data?.restaurants ?? [];
        setRestaurants(restaurantList);
        if (restaurantList.length > 0) {
          setSelectedRestaurant(restaurantList[0]._id);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load restaurants.");
        setRestaurants([]);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchOrders(selectedRestaurant);
    }
  }, [selectedRestaurant]);

  const fetchOrders = async (restaurantId) => {
    setLoading(true);
    try {
      const response = await restaurantService.getOrders(restaurantId);
      const orderList = response.data.status.orders;
      console.log("order list : ", orderList);

      setOrders(orderList);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await restaurantService.updateOrderStatus(orderId, newStatus); // Assuming you have an API for this
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update order status.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-[#000000] bg-[#ffffff29] rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-white mb-6">🍽️ Restaurant Orders</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block mb-2 font-semibold text-white">Select a Restaurant:</label>
        <select
          className="w-full p-3 border border-[#83858E] rounded-md shadow-sm focus:ring-2 focus:ring-[#FC8A06] outline-none"
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
        >
          {restaurants.map((rest) => (
            <option key={rest._id} value={rest._id}>
              {rest.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center text-[#83858E] text-lg">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-red-400">No orders found for this restaurant.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white border border-[#e5e7eb] rounded-md">
            <thead className="bg-[#FC8A06] text-white text-left">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total (Rs.)</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Ordered On</th>
              </tr>
            </thead>
            <tbody className="text-[#03081F]">
              {orders.map((order, index) => {
                const total = order.items.reduce(
                  (acc, item) => acc + item.menuItem.price * item.quantity,
                  0
                );

                return (
                  <tr key={index} className="border-t border-gray-200 hover:bg-[#f9fafb]">
                    <td className="p-4 font-medium">{order.orderId}</td>
                    <td className="p-4">
                      <ul className="list-disc pl-5 space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            <div className="font-semibold">{item.menuItem.name}</div>
                            <div className="text-sm text-gray-600">
                              Portion: {item.menuItem.portion} | Qty: {item.quantity} | Rs.{" "}
                              {item.menuItem.price.toFixed(2)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4">Rs. {total.toFixed(2)}</td>
                    <td className="p-4">
                      <select
                        className="p-2 border rounded-md"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.orderId, e.target.value)
                        }
                      >
                        {["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"].map(
                          (status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${order.paymentStatus === "Paid"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {order.paymentStatus || "Unpaid"}
                      </span>
                    </td>
                    <td className="p-4">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-GB")
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;

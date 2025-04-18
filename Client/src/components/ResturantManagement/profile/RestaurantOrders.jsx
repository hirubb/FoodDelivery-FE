import React, { useEffect, useState } from "react";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // You can replace this with actual API call
  useEffect(() => {
    const fetchOrders = async () => {
      // Mock delay for realism
      setTimeout(() => {
        setOrders([
          {
            id: "ORD12345",
            customer: "Jane Doe",
            items: ["Burger", "Fries"],
            status: "Pending",
            time: "Just now",
          },
          {
            id: "ORD12344",
            customer: "John Smith",
            items: ["Pizza", "Coke"],
            status: "Preparing",
            time: "10 minutes ago",
          },
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#FC8A06] mb-6">Order Notifications</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No new orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">
                    Order #{order.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Customer: {order.customer}
                  </p>
                  <p className="text-sm text-gray-600">
                    Items: {order.items.join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{order.time}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestaurantOrders;

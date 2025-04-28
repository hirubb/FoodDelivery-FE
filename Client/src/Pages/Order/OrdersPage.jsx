import React, { useEffect, useState } from "react";
import orderService from "../../services/order-service";
import { jwtDecode } from "jwt-decode";
import OrderLocationMap from "../../components/OrderManagement/OrderLocationMap";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, ShoppingBag } from "lucide-react";

const OrdersPage = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Extract orderId from query parameters if available
  const queryParams = new URLSearchParams(location.search);
  const orderIdFromQuery = queryParams.get("orderId");

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
    const fetchOrder = async () => {
      setLoading(true);

      try {
        // Check if we have a pending order from the cart
        const pendingOrderString = localStorage.getItem("pendingOrder");
        
        // If we have a pending order, use that instead of fetching
        if (pendingOrderString) {
          const pendingOrder = JSON.parse(pendingOrderString);
          setOrder(pendingOrder);
          setLoading(false);
          return;
        }

        // If we have an orderId in query params, fetch that specific order
        if (orderIdFromQuery) {
          const res = await orderService.getOrderById(orderIdFromQuery);
          if (res.data.success && res.data.order) {
            setOrder(res.data.order);
          } else {
            setError("Order not found");
          }
        } else {
          // Otherwise fetch the most recent order for this customer
          const customerId = getCustomerIdFromToken();
          console.log("Customer ID from token:", customerId);

          if (!customerId) {
            setError("No customer ID found. Please place an order first.");
            setLoading(false);
            return;
          }

          const res = await orderService.getCustomerOrders(customerId);

          if (res.data.orders && res.data.orders.length > 0) {
            // Get only the most recent order (assuming they're sorted by date)
            const latestOrder = res.data.orders[0];

            // Fetch complete order details using the order ID
            const orderDetailsRes = await orderService.getOrderById(
              latestOrder._id
            );
            if (orderDetailsRes.data.success) {
              setOrder(orderDetailsRes.data.order);
            } else {
              setOrder(latestOrder); // Fallback to basic order info
            }
          } else {
            setError("No recent orders found");
          }
        }
      } catch (err) {
        console.error("Error fetching order", err);
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    // Check if we should show an order or clear the screen
    const hasDeletedOrder = sessionStorage.getItem("orderDeleted");
    if (hasDeletedOrder === "true") {
      setOrder(null);
      setError(""); // Clear any errors
      sessionStorage.removeItem("orderDeleted"); // Reset flag
      localStorage.removeItem("pendingOrder"); // Clear pending order if any
      setLoading(false);
    } else {
      fetchOrder();
    }
  }, [orderIdFromQuery]);

  const toggleOrderDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleBackToRestaurant = () => {
    // Clear the pending order
    localStorage.removeItem("pendingOrder");
    
    // Navigate back to the restaurant page
    if (order && order.restaurant_id) {
      navigate(`/restaurant/${order.restaurant_id}`);
    } else {
      navigate("/restaurants");
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setCancelLoading(true);
      
      try {
        // If this is a pending order (not yet sent to server)
        if (!order._id) {
          // Simply clear the pending order
          localStorage.removeItem("pendingOrder");
          localStorage.removeItem("cart");
          
          // Set a flag to indicate order was deleted
          sessionStorage.setItem("orderDeleted", "true");
          
          setSuccessMessage("Order cancelled successfully!");
          
          // Navigate after a delay
          setTimeout(() => {
            navigate("/restaurants");
          }, 2000);
          return;
        }

        // Otherwise call the delete order API endpoint
        const response = await orderService.deleteOrder(order._id);

        if (response.data.success) {
          setSuccessMessage("Order cancelled successfully!");
          
          // Clear both pending order and cart
          localStorage.removeItem("pendingOrder");
          localStorage.removeItem("cart");
          
          // Set a flag to indicate order was deleted
          sessionStorage.setItem("orderDeleted", "true");

          // Navigate after a delay
          setTimeout(() => {
            navigate("/restaurants");
          }, 2000);
        } else {
          setError(
            "Failed to cancel order: " +
              (response.data.error || "Unknown error")
          );
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        setError(
          "Failed to cancel order: " +
            (error.response?.data?.error || error.message || "Server error")
        );
      } finally {
        setCancelLoading(false);
      }
    }
  };
  
  const handleEditOrder = () => {
    // Navigate back to cart page to edit the order
    navigate("/cart");
  };
  
  // Handle place order
  const placeOrder = async () => {
    // Check for authentication
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to place an order");
      navigate("/login", { state: { returnUrl: "/orders" } });
      return;
    }

    // Check if order data is ready
    if (!order || !order.items || order.items.length === 0) {
      setError("Cannot place order: No items found");
      return;
    }

    // Prepare order data
    const restaurantId = order.restaurant_id;

    const orderItems = order.items.map((item) => ({
      menuItemId: item._id,
      quantity: item.quantity,
      name: item.name,
      price: item.price
    }));

    const totalAmount = order.totalAmount;

    // Include location data in the order
    const orderData = {
      restaurantId,
      items: orderItems,
      totalAmount,
      deliveryLocation: order.deliveryLocation,
    };

    try {
      setIsPlacingOrder(true);
      setError(null);

      const response = await orderService.placeOrder(orderData);

      // Clear pending order and cart after successful order
      localStorage.removeItem("pendingOrder");
      localStorage.removeItem("cart");

      // Save order ID for tracking
      const orderId = response.data.order.orderId;
      const recentOrders = JSON.parse(
        localStorage.getItem("recentOrders") || "[]"
      );
      recentOrders.unshift(orderId);
      localStorage.setItem(
        "recentOrders",
        JSON.stringify(recentOrders.slice(0, 10))
      ); // Keep last 10 orders

      // Navigate to checkout page with the new order ID
      navigate("/checkout", { state: { orderId } });
    } catch (err) {
      console.error("Order placement failed:", err);

      if (!err.response) {
        setError(
          "Network error. Please check your connection and try again."
        );
      } else if (err.response.status === 401) {
        setError("Your session has expired. Please login again.");
        navigate("/login", { state: { returnUrl: "/orders" } });
      } else {
        setError(
          `Failed to place order: ${err.response.data.error || err.message}`
        );
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const isPendingOrder = !order?._id;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white">text-black
      <h2 className="text-2xl font-semibold mb-4">Your Order</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {!loading && !error && !order && (
        <div>
          <p>No recent order found.</p>
          <button
            onClick={() => navigate("/restaurants")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Browse Restaurants
          </button>
        </div>
      )}

      {!loading && !error && order && (
        <div className="border rounded-xl p-4 shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {isPendingOrder ? "New Order" : `Order ID: ${order._id || order.orderId}`}
            </h3>
            <button
              onClick={toggleOrderDetails}
              className="text-blue-600 hover:text-blue-800"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
          </div>

          <div className="mt-2">
            <p>
              <strong>Total Amount:</strong> Rs. {order.totalAmount.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {order.status}
              </span>
            </p>
            {order.paymentStatus && (
              <p>
                <strong>Payment:</strong>{" "}
                <span
                  className={`font-semibold ${
                    order.paymentStatus === "Paid"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>
            )}
          </div>

          {/* Order details section */}
          {showDetails && (
            <div className="mt-4 border-t pt-4">
              <div className="mb-4">
                <p className="font-semibold mb-2">Items:</p>
                <ul className="list-disc pl-5">
                  {order.items &&
                    order.items.map((item, idx) => (
                      <li key={idx} className="mb-1">
                        <span className="font-medium">
                          {item.name || `Unknown Item ${idx + 1}`}
                        </span>{" "}
                        x {item.quantity}
                        {item.price && (
                          <span className="ml-2 text-gray-700">
                            — Rs.
                            {typeof item.price === "number"
                              ? item.price.toFixed(2)
                              : "N/A"}
                          </span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Location Map */}
              {order.deliveryLocation && order.deliveryLocation.latitude && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Delivery Location</h4>
                  <OrderLocationMap location={order.deliveryLocation} />
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleBackToRestaurant}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              <ArrowLeft className="inline mr-1" size={16} />
              Back to Restaurant
            </button>

            {/* Edit button for pending orders */}
            {isPendingOrder && (
              <button
                onClick={handleEditOrder}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              >
                <Edit size={16} className="mr-1" />
                Edit Order
              </button>
            )}

            {/* Place Order button - moved from CartPage */}
            {isPendingOrder && (
              <button
                onClick={placeOrder}
                disabled={isPlacingOrder}
                className={`flex-1 py-2 ${
                  isPlacingOrder ? "bg-gray-400" : "bg-[#FC8A06] hover:bg-[#E67E22]"
                } text-white rounded flex items-center justify-center gap-2`}
              >
                {isPlacingOrder ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Place Order (Rs. {order.totalAmount.toFixed(2)})
                  </>
                )}
              </button>
            )}

            {/* Cancel button for any order */}
            <button
              className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition ${
                cancelLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              onClick={handleCancelOrder}
              disabled={cancelLoading}
            >
              {cancelLoading ? "Cancelling..." : "Cancel Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
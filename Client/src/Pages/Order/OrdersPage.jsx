import React, { useEffect, useState } from "react";
import orderService from "../../services/order-service";
import { jwtDecode } from "jwt-decode";
import OrderLocationMap from "../../components/OrderManagement/OrderLocationMap";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react";

const OrdersPage = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
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

  useEffect(() => {
    if (successMessage || error) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "Preparing": return "bg-blue-100 text-blue-800";
      case "On the way": return "bg-purple-100 text-purple-800";
      default: return "bg-orange-100 text-orange-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === "Paid" ? "text-green-600" : "text-red-600";
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    setSuccessMessage("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      {/* Floating notification */}
      {showNotification && (successMessage || error) && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 flex items-center justify-between ${successMessage ? "bg-green-50 border-l-4 border-green-500" : "bg-red-50 border-l-4 border-red-500"}`}>
          <div className="flex items-center">
            {successMessage ? (
              <CheckCircle className="text-green-500 mr-3" size={20} />
            ) : (
              <AlertCircle className="text-red-500 mr-3" size={20} />
            )}
            <p className={successMessage ? "text-green-800" : "text-red-800"}>
              {successMessage || error}
            </p>
          </div>
          <button
            onClick={handleCloseNotification}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Header with background */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-6 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <ShoppingBag className="mr-3" size={24} />
              Your Order
            </h2>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              </div>
            )}

            {!loading && !error && !order && (
              <div className="text-center py-10">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-6">No recent orders found.</p>
                <button
                  onClick={() => navigate("/restaurants")}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  Browse Restaurants
                </button>
              </div>
            )}

            {!loading && !error && order && (
              <div>
                {/* Order summary header */}
                <div className="border-b pb-4 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      {isPendingOrder ? "New Order" : `Order : ${(order._id || order.orderId)}`}
                    </h3>
                    <button
                      onClick={toggleOrderDetails}
                      className="flex items-center text-orange-500 hover:text-orange-700 font-medium transition-colors"
                    >
                      {showDetails ? (
                        <>
                          Hide Details <ChevronUp size={18} className="ml-1" />
                        </>
                      ) : (
                        <>
                          Show Details <ChevronDown size={18} className="ml-1" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Order meta info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">Total Amount</p>
                      <p className="text-xl font-bold text-gray-800">
                        LKR : {order.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">Status</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                          {order.status || "Processing"}
                        </span>
                      </div>
                    </div>

                    {order.paymentStatus && (
                      <div className="bg-gray-200 rounded-lg p-3">
                        <p className="text-gray-500 text-black">Payment</p>
                        <p className={`text-lg font-bold ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order details section */}
                {showDetails && (
                  <div className="mb-6 space-y-6">
                    {/* Items section */}
                    <div>
                      <h4 className="font-bold text-gray-700 mb-3 flex items-center">
                        <ShoppingBag size={18} className="mr-2" />
                        Order Items
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-4">
                        {order.items && order.items.length > 0 ? (
                          <ul className="divide-y divide-gray-200">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                  <span className="h-8 w-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full mr-3">
                                    {item.quantity}
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {item.name || `Unknown Item ${idx + 1}`}
                                  </span>
                                </div>
                                {item.price && (
                                  <span className="font-bold text-gray-700">
                                    LKR :{typeof item.price === "number" ? item.price.toFixed(2) : "N/A"}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">No items found in this order</p>
                        )}
                      </div>
                    </div>

                    {/* Location Map */}
                    {order.deliveryLocation && order.deliveryLocation.latitude && (
                      <div>
                        <h4 className="font-bold text-black mb-3 flex items-center">
                          <MapPin size={18} className="mr-2" />
                          Delivery Location
                        </h4>
                        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm text-black">
                          <OrderLocationMap location={order.deliveryLocation} />
                        </div>
                      </div>
                    )}

                    {/* Delivery time estimate - example extra info */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <Clock size={18} className="text-blue-600 mr-2" />
                        <h4 className="font-bold text-blue-800">Estimated Delivery</h4>
                      </div>
                      <p className="text-blue-700">
                        Your order will arrive in approximately 30-45 minutes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col md:flex-row gap-3 pt-4 border-t">
                  <button
                    onClick={handleBackToRestaurant}
                    className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Restaurant
                  </button>

                  {/* Edit button for pending orders */}
                  {isPendingOrder && (
                    <button
                      onClick={handleEditOrder}
                      className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Edit size={18} className="mr-2" />
                      Edit Order
                    </button>
                  )}

                  {/* Place Order button - moved from CartPage */}
                  {isPendingOrder && (
                    <button
                      onClick={placeOrder}
                      disabled={isPlacingOrder}
                      className={`flex-1 py-3 px-4 ${isPlacingOrder ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
                        } text-white rounded-lg flex items-center justify-center transition-colors shadow-md`}
                    >
                      {isPlacingOrder ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={18} className="mr-2" />
                          Place Order (₹{order.totalAmount.toFixed(2)})
                        </>
                      )}
                    </button>
                  )}

                  {/* Cancel button for any order */}
                  <button
                    className={`md:flex-none md:w-auto py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors ${cancelLoading ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    onClick={handleCancelOrder}
                    disabled={cancelLoading}
                  >
                    {cancelLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <X size={18} className="mr-2" />
                        Cancel Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
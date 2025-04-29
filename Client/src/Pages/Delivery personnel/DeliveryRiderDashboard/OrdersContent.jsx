import { useState, useEffect } from 'react';
import {
    FaMapMarkedAlt,
    FaCheckCircle,
    FaTimes,
    FaPhoneAlt,
    FaMotorcycle,
    FaBoxOpen,
    FaHistory,
    FaLocationArrow,
    FaMapMarkerAlt,
    FaRegClock,
    FaDollarSign
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import DeliveryRiderService from '../../../services/DeliveryRider-service';
import RestaurantService from '../../../services/restaurant-service';
import customerService from '../../../services/customer-service';
import OrderService from '../../../services/order-service';
import { MakeDriverAvailable, MakeDriverUnavailable } from '../DeliveryServices/DeliveryAvailabilty';

function OrdersContent({ setActiveTab, setNavigationData }) {
    const [activeOrderTab, setActiveOrderTab] = useState('pending');
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]); // Unified orders array

    const [deliveryDetails, setDeliveryDetails] = useState(null);
    const [restaurantDetails, setRestaurantDetails] = useState(null);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);

    // Add missing state variables
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllDetails = async () => {
            try {
                setLoading(true);
                // Fetch all deliveries for the driver
                const deliveriesResponse = await DeliveryRiderService.GetAllDeliveriesForDriver();
                const deliveries = deliveriesResponse.data || [];

                // Process each delivery to create order objects
                const orderPromises = deliveries.map(async (delivery) => {
                    try {
                        // Fetch restaurant details
                        const restaurantResponse = await RestaurantService.getRestaurantById(delivery.Restuarentid);

                        // Fetch customer details
                        const customerResponse = await customerService.GetCustomerById(delivery.customerid);

                        // Fetch order details
                        const orderResponse = await OrderService.getOrderDetailsById(delivery.orderid);

                        // Create a unified order object
                        return {
                            id: delivery.orderid, // Use order ID here
                            deliveryId: delivery._id, // Store delivery ID separately
                            customer: `${customerResponse.data.customer.first_name} ${customerResponse.data.customer.last_name}`,
                            customerPhone: customerResponse.data.customer.phone || 'N/A',
                            pickup: `${restaurantResponse.data.data.street}, ${restaurantResponse.data.data.country}`,
                            pickupLatitude: restaurantResponse.data.data.latitude,
                            pickupLongitude: restaurantResponse.data.data.longitude,
                            dropoff: 'Customer Location',
                            dropoffLatitude: orderResponse.data.status.deliveryLocation.latitude,
                            dropoffLongitude: orderResponse.data.status.deliveryLocation.longitude,
                            items: `${orderResponse.data.status.items.length} items`,
                            // Use mapOrderStatus with the delivery status
                            status: mapOrderStatus(delivery.status),
                            restaurant: restaurantResponse.data.data.name,
                            totalAmount: orderResponse.data.status.totalAmount,
                            date: new Date(delivery.Date).toLocaleString()
                        };
                    } catch (err) {
                        console.error(`Error processing delivery ${delivery._id}:`, err);
                        return null;
                    }
                });

                // Wait for all promises to resolve
                const processedOrders = (await Promise.all(orderPromises)).filter(order => order !== null);

                // Update orders state with all processed orders
                setOrders(processedOrders);
            } catch (err) {
                console.error("Error fetching details:", err);
                setError("Error fetching order details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllDetails();
    }, []);

    // Helper function to map API status values to UI status values
    const mapOrderStatus = (apiStatus) => {
        switch (apiStatus) {
            case 'pending':
                return 'pending'; // Status for new/pending orders
            case 'Accepted':
                return 'Accepted'; // Status for active/accepted orders
            case 'completed':
            case 'delivered':
                return 'completed'; // Status for completed orders
            default:
                return 'pending'; // Default fallback
        }
    };

    const AcceptOrder = async () => {
        setLoading(true);
        // Clear previous messages
        setSuccess('');
        setError('');

        try {
            const response = await DeliveryRiderService.UpdateDeliveryStatus({
                deliveryId: selectedOrder.deliveryId, // Use deliveryId for the API call
                status: 'Accepted',
            });

            await MakeDriverUnavailable(setLoading, setSuccess, setError);

            setOrders(prevOrders => {
                return prevOrders.map(order =>
                    order.id === selectedOrder.id ? { ...order, status: 'Accepted' } : order
                );
            });

            setSuccess("Order accepted successfully!");
            // Close the modal after successful acceptance
            setTimeout(() => setShowOrderDetail(false), 1500);
        } catch (err) {
            console.error("Error accepting order:", err);
            setError("Failed to accept the order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const MarkAsDelivered = async () => {
        setLoading(true);
        // Clear previous messages
        setSuccess('');
        setError('');

        try {
            const response = await DeliveryRiderService.UpdateDeliveryStatus({
                deliveryId: selectedOrder.deliveryId, // Use deliveryId for the API call
                status: 'delivered',
            });


            await MakeDriverAvailable(setLoading, setSuccess, setError);

            setOrders(prevOrders => {
                return prevOrders.map(order =>
                    order.id === selectedOrder.id ? { ...order, status: 'completed' } : order
                );
            });
            setSuccess("Order marked as delivered successfully!");
            // Close the modal after successful delivery
            setTimeout(() => setShowOrderDetail(false), 1500);
        } catch (err) {
            console.error("Error marking order as delivered:", err);
            setError("Failed to mark the order as delivered. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const DeclineOrder = async () => {
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            // First update order status back to confirmed (so restaurant knows it needs another driver)
            await OrderService.UpdateOrderStatus({
                orderId: selectedOrder.id,
                status: 'Confirmed',
            });

            // Then decline the delivery
            await DeliveryRiderService.UpdateDeliveryStatus({
                deliveryId: selectedOrder.deliveryId,
                status: 'declined',
            });

            await MakeDriverAvailable(setLoading, setSuccess, setError);

            // Remove this order from the list
            setOrders(prevOrders => {
                return prevOrders.filter(order => order.id !== selectedOrder.id);
            });

            setSuccess("Order declined successfully");
            // Close the modal after successful decline
            setTimeout(() => setShowOrderDetail(false), 1500);
        } catch (err) {
            console.error("Error declining order:", err);
            setError("Failed to decline the order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Filter orders based on status
    const pendingOrders = orders.filter(order => order.status === 'pending');
    const activeOrders = orders.filter(order => order.status === 'Accepted');
    const historyOrders = orders.filter(order => order.status === 'completed');

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setShowOrderDetail(true);
        // Clear any previous messages
        setSuccess('');
        setError('');
    };

    const handleViewOnMap = (order) => {
        // Pass location data to NavigationContent through parent component
        setNavigationData({
            orderId: order.id,
            customer: order.customer,
            customerPhone: order.customerPhone,
            pickup: order.pickup,
            pickupLatitude: order.pickupLatitude,
            pickupLongitude: order.pickupLongitude,
            dropoff: order.dropoff,
            dropoffLatitude: order.dropoffLatitude,
            dropoffLongitude: order.dropoffLongitude,
            items: order.items,
            restaurant: order.restaurant,
            status: order.status
        });

        // Switch to navigation tab
        setActiveTab('navigation');

        // Close the modal
        setShowOrderDetail(false);
    };

    // Status badge component for better reuse
    const StatusBadge = ({ status }) => {
        let bgColor, textColor, label, icon;

        switch (status) {
            case 'completed':
                bgColor = 'bg-emerald-100';
                textColor = 'text-emerald-800';
                label = 'Completed';
                icon = <FaCheckCircle className="mr-1" />;
                break;
            case 'Accepted':
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
                label = 'Active';
                icon = <FaMotorcycle className="mr-1" />;
                break;
            default:
                bgColor = 'bg-amber-100';
                textColor = 'text-amber-800';
                label = 'New';
                icon = <FaRegClock className="mr-1" />;
        }

        return (
            <span className={`ml-2 px-2.5 py-1 text-xs rounded-full flex items-center ${bgColor} ${textColor}`}>
                {icon} {label}
            </span>
        );
    };

    const renderOrders = (orders) => {
        if (loading && orders.length === 0) {
            return (
                <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <h3 className="mt-4 text-sm font-medium text-gray-600">Loading orders...</h3>
                </div>
            );
        }

        return orders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100"
                        onClick={() => handleOrderClick(order)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center">
                                    <span className="font-bold text-gray-800">#{order.id.slice(-6)}</span>
                                    <StatusBadge status={order.status} />
                                </div>
                                <h3 className="text-sm font-medium mt-1 text-gray-700">{order.customer}</h3>
                                <p className="text-xs text-gray-500 mt-1">{order.restaurant}</p>
                            </div>
                            <div className="text-right">
                                <div className="font-medium text-emerald-600">${order.totalAmount.toFixed(2)}</div>
                                <div className="text-xs text-gray-500 mt-1">{order.date}</div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 space-y-2.5">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-6 text-orange-500">
                                    <FaMapMarkerAlt />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-xs text-gray-500 font-medium">PICKUP</p>
                                    <p className="text-sm">{order.pickup}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-6 text-blue-500">
                                    <FaLocationArrow />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-xs text-gray-500 font-medium">DROPOFF</p>
                                    <p className="text-sm">{order.dropoff}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                            <span className="flex items-center">
                                <FaBoxOpen className="mr-1" /> {order.items}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
                <FaBoxOpen className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-600">No Orders</h3>
                <p className="mt-1 text-sm text-gray-500">No {activeOrderTab} orders to display right now.</p>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-full p-6">
            <div className="max-w-7xl mx-auto">
                {/* Dashboard Summary */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Orders Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-sm text-gray-500 mb-1">New Orders</div>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl font-bold text-gray-800">{pendingOrders.length}</span>
                                <span className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                                    <FaBoxOpen />
                                </span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-sm text-gray-500 mb-1">Active Orders</div>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl font-bold text-gray-800">{activeOrders.length}</span>
                                <span className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                                    <FaMotorcycle />
                                </span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-sm text-gray-500 mb-1">Completed Orders</div>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl font-bold text-gray-800">{historyOrders.length}</span>
                                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                                    <FaCheckCircle />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex bg-white rounded-xl p-1 shadow-sm">
                        <button
                            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all text-sm flex items-center justify-center ${activeOrderTab === 'pending' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 hover:text-amber-600'}`}
                            onClick={() => setActiveOrderTab('pending')}
                        >
                            <FaBoxOpen className={`mr-2 ${activeOrderTab === 'pending' ? 'text-white' : 'text-amber-500'}`} />
                            New Orders
                            {pendingOrders.length > 0 && (
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeOrderTab === 'pending' ? 'bg-white text-amber-600' : 'bg-amber-100 text-amber-800'}`}>
                                    {pendingOrders.length}
                                </span>
                            )}
                        </button>
                        <button
                            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all text-sm flex items-center justify-center ${activeOrderTab === 'active' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:text-blue-600'}`}
                            onClick={() => setActiveOrderTab('active')}
                        >
                            <FaMotorcycle className={`mr-2 ${activeOrderTab === 'active' ? 'text-white' : 'text-blue-500'}`} />
                            Active
                            {activeOrders.length > 0 && (
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeOrderTab === 'active' ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-800'}`}>
                                    {activeOrders.length}
                                </span>
                            )}
                        </button>
                        <button
                            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all text-sm flex items-center justify-center ${activeOrderTab === 'history' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:text-emerald-600'}`}
                            onClick={() => setActiveOrderTab('history')}
                        >
                            <FaHistory className={`mr-2 ${activeOrderTab === 'history' ? 'text-white' : 'text-emerald-500'}`} />
                            History
                            {historyOrders.length > 0 && (
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeOrderTab === 'history' ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-800'}`}>
                                    {historyOrders.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Order List */}
                <div className="transition-all duration-300">
                    {activeOrderTab === 'pending' && renderOrders(pendingOrders)}
                    {activeOrderTab === 'active' && renderOrders(activeOrders)}
                    {activeOrderTab === 'history' && renderOrders(historyOrders)}
                </div>
            </div>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {showOrderDetail && selectedOrder && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowOrderDetail(false)}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                                    <p className="text-sm text-gray-500 mt-1">{selectedOrder.restaurant}</p>
                                </div>
                                <div className="text-right">


                                </div>
                                <button
                                    className="bg-white text-gray-500 p-2 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-colors ml-4"
                                    onClick={() => setShowOrderDetail(false)}
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>

                            <div className="p-6">
                                {/* Show success message if exists */}
                                {success && (
                                    <div className="mb-4 bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg">
                                        <p className="flex items-center">
                                            <FaCheckCircle className="mr-2" />
                                            {success}
                                        </p>
                                    </div>
                                )}

                                {/* Show error message if exists */}
                                {error && (
                                    <div className="mb-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
                                        <p className="flex items-center">
                                            <FaTimes className="mr-2" />
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <div className="pb-4 border-b border-gray-200">
                                    <div>
                                        <p className="text-sm text-gray-500">Order ID</p>
                                        <p className="font-semibold text-gray-800">{selectedOrder.id}</p>
                                    </div>
                                </div>

                                <div className="py-4 border-b border-gray-200">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-blue-600 font-bold text-lg">{selectedOrder.customer.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{selectedOrder.customer}</p>
                                            <p className="text-sm text-gray-500">{selectedOrder.customerPhone}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <a href={`tel:${selectedOrder.customerPhone}`} className="bg-green-500 text-white p-2.5 rounded-full hover:bg-green-600 transition-colors inline-flex items-center justify-center">
                                                <FaPhoneAlt size={14} />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="space-y-5 text-gray-800">
                                        <div className="flex">
                                            <div className="flex-shrink-0 w-8 text-orange-500 pt-0.5">
                                                <FaMapMarkerAlt size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Pickup location</p>
                                                <p className="font-medium text-gray-800">{selectedOrder.pickup}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {selectedOrder.pickupLatitude}, {selectedOrder.pickupLongitude}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="flex-shrink-0 w-8 text-blue-500 pt-0.5">
                                                <FaLocationArrow size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Dropoff location</p>
                                                <p className="font-medium text-gray-800">{selectedOrder.dropoff}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {selectedOrder.dropoffLatitude}, {selectedOrder.dropoffLongitude}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-sm font-medium text-gray-700">Order Summary</p>
                                                <span className="flex items-center text-emerald-600">
                                                    <FaDollarSign size={14} className="mr-1" />
                                                    <span className="font-bold">{selectedOrder.totalAmount.toFixed(2)}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaBoxOpen className="mr-2 text-gray-500" />
                                                <p className="text-gray-800">{selectedOrder.items}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-colors flex items-center justify-center shadow-sm"
                                        onClick={() => handleViewOnMap(selectedOrder)}
                                        disabled={loading}
                                    >
                                        <FaMapMarkedAlt className="mr-2" /> View on Map
                                    </button>

                                    {/* Actions based on status */}
                                    {selectedOrder.status === 'pending' && (
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <button
                                                onClick={() => DeclineOrder()}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                                                disabled={loading}
                                            >
                                                <FaTimes className="mr-2" />
                                                {loading ? 'Processing...' : 'Decline'}
                                            </button>






                                            <button
                                                onClick={() => AcceptOrder()}
                                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center shadow-sm"
                                                disabled={loading}
                                            >
                                                <FaCheckCircle className="mr-2" />
                                                {loading ? 'Processing...' : 'Accept'}
                                            </button>
                                        </div>
                                    )}

                                    {selectedOrder.status === 'Accepted' && (
                                        <button
                                            onClick={() => MarkAsDelivered()}
                                            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center shadow-sm"
                                            disabled={loading}
                                        >
                                            <FaCheckCircle className="mr-2" />
                                            {loading ? 'Processing...' : 'Mark as Delivered'}
                                        </button>
                                    )}

                                    {selectedOrder.status === 'completed' && (
                                        <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg flex items-center">
                                            <FaCheckCircle className="mr-3 text-emerald-500" />
                                            <div>
                                                <p className="font-medium">Successfully delivered</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default OrdersContent;

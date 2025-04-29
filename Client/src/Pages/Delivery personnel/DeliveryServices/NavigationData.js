// import React, { useEffect, useState } from 'react';
// import { useDeliveryContext } from './DeliveryContext';
// import DeliveryRiderService from '../../../services/DeliveryRider-service';
// import RestaurantService from '../../../services/restaurant-service';
// import customerService from '../../../services/customer-service';
// import OrderService from '../../../services/order-service';
// import OrdersContent from '../DeliveryRiderDashboard/OrdersContent';

// const DeliveryDetails = () => {

//     const [isDataLoaded, setIsDataLoaded] = useState(false);  // To ensure data is fully loaded

//     const [deliveryDetails, setDeliveryDetails] = useState(null);
//     const [restaurantDetails, setRestaurantDetails] = useState(null);
//     const [customerDetails, setCustomerDetails] = useState(null);
//     const [orderDetails, setOrderDetails] = useState(null);


//     useEffect(() => {
//         const fetchAllDetails = async () => {
//             try {
//                 // Fetch delivery details
//                 const deliveryResponse = await DeliveryRiderService.GetDeliveryDetails();
//                 console.log("Delivery details fetched:", deliveryResponse);
//                 setDeliveryDetails({
//                     orderid: deliveryResponse.data._id,
//                     driverid: deliveryResponse.data.orderid,
//                     customerid: deliveryResponse.data.customerid,
//                     restaurantid: deliveryResponse.data.Restuarentid,
//                     Deliverystatus: deliveryResponse.data.status,
//                     totalDistance: deliveryResponse.data.totalDistance,
//                     date: deliveryResponse.data.date,
//                 });

//                 // Fetch restaurant details
//                 const restaurantResponse = await RestaurantService.getRestaurantById(deliveryResponse.data.Restuarentid);
//                 console.log("Restaurant details fetched:", restaurantResponse.data);
//                 setRestaurantDetails({
//                     ownerId: restaurantResponse.data.data.owner_id,
//                     name: restaurantResponse.data.data.name,  // Changed from customerName to name
//                     email: restaurantResponse.data.data.email,
//                     phone: restaurantResponse.data.data.phone,
//                     street: restaurantResponse.data.data.street,
//                     postalCode: restaurantResponse.data.data.postal_code,
//                     country: restaurantResponse.data.data.country,
//                     latitude: restaurantResponse.data.data.latitude,
//                     longitude: restaurantResponse.data.data.longitude,
//                 });

//                 // Fetch customer details
//                 const customerResponse = await customerService.GetCustomerById(deliveryResponse.data.customerid);
//                 console.log("Customer details fetched:", customerResponse);
//                 setCustomerDetails({
//                     Email: customerResponse.data.customer.email,
//                     first_name: customerResponse.data.customer.first_name,
//                     last_name: customerResponse.data.customer.last_name,
//                     phone: customerResponse.data.customer.phone,
//                 });

//                 // Fetch order details
//                 const orderResponse = await OrderService.getOrderDetailsById(deliveryResponse.data.orderid);
//                 console.log("Order details fetched:", orderResponse);
//                 setOrderDetails({
//                     items: orderResponse.data.status.items,
//                     totalAmount: orderResponse.data.status.totalAmount,
//                     deliveryLocation: orderResponse.data.status.deliveryLocation,
//                     status: orderResponse.data.status.status,
//                 });


//             } catch (err) {
//                 console.error("Error fetching details:", err);
//             }
//         };

//         fetchAllDetails();
//     }, []);



//     return (
//         <div>
//             <OrdersContent
//                 deliveryDetails={deliveryDetails}
//                 restaurantDetails={restaurantDetails}
//                 customerDetails={customerDetails}
//                 orderDetails={orderDetails}
//             />
//         </div>
//     );
// };

// export default DeliveryDetails;

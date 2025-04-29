import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // Import UserProvider
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Home from "./Pages/Home";
import Login from "./Pages/Auth/LoginPage";
import Register from "./Pages/Auth/RegisterPage";
import OwnerRegister from "./components/ResturantManagement/OwnerRegister";
import RestaurantRegister from "./components/ResturantManagement/RestaurantRegister";
import Restaurant from "./Pages/Restaurant/Restaurant";
import RestaurantDetails from "./Pages/Order/RestaurantDetails";
import Cart from "./Pages/Order/Cart";
import OrdersPage from "./Pages/Order/OrdersPage";
import { AuthProvider } from "./components/Auth/AuthContext";
import Profile from "./Pages/Restaurant/profile/Profile";
import CreateMenu from "./Pages/Restaurant/profile/CreateMenu";
import CreateMenuForm from "./components/ResturantManagement/profile/CreateMenuForm";
import CreateMenuItems from "./components/ResturantManagement/profile/CreateMenuItems";

import ShowMenu from "./components/ResturantManagement/profile/ShowMenu";
import CreatePromo from "./components/ResturantManagement/profile/CreatePromo";
import CheckoutPage from "./Pages/Payment/Checkout";
import PaymentSuccess from "./Pages/Payment/PaymentSuccess";
// import PaymentCancel from './Pages/Payment/PaymentCancel';
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import RestaurantOwnerDashboard from "./Pages/Restaurant/profile/RestaurantOwnerDashboard";
import CustomerDashboard from "./Pages/Customer/CustomerDashboard";
import RestaurantOffers from "./components/ResturantManagement/profile/RestaurantOffers";
import DeliveryOptionsSignUp from "./Pages/Delivery personnel/DeliveryOptionsSignUp";
import DeliverySignUp from "./Pages/Delivery personnel/DeliverySignUp";
import VehicleDetailsSignUp from "./Pages/Delivery personnel/VehicleDetailsSignUp";
import DriverDashboard from "./Pages/Delivery personnel/DeliveryRiderDashboard/DriverDashboard";
import DeliveryRiderHome from "./Pages/Delivery personnel/DeliveryHomePage";

import PrivateRoute from "./components/Auth/PrivateRoute";

// import OrderStatusPage from './pages/Order/OrderStatusPage';

import TestPayment from "./Pages/Payment/TestPayment";
import UnauthorizedPage from "./Pages/UnauthorizedPage";
import GoogleCallback from './Pages/Auth/GoogleCallback';


// AppContent should be inside Router to use useLocation()
const AppContent = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isDliveryPersonnelSignUp =
    location.pathname === "/deliveryPersonnel-SignUp" ||
    location.pathname === "/DeliveryPersonnel-OptionsSignUp" ||
    location.pathname === "/deliveryPersonnel/VehicleDetails-SignUp" ||
    location.pathname === "/deliveryPersonnel/DriverDashboard";

  return (
    <div className="App">
      {!isAuthPage && !isDliveryPersonnelSignUp && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/owner-register" element={<OwnerRegister />} />
          <Route path="/restaurant-register" element={<RestaurantRegister />} />
          <Route path="/restaurants" element={<Restaurant />} />

          {/* =====================  Order Routes ===================== */}
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrdersPage />} />

          <Route
            path="/owner/profile"
            element={
                <RestaurantOwnerDashboard />
            
            }
          />
          <Route
            path="/restaurant/offers/:restaurantId"
            element={
              <PrivateRoute roles={["Restaurant Owner"]}>
                <RestaurantOffers />
              </PrivateRoute>
            }
          />
          <Route
            path="/restaurant/menu/create/:id"
            element={
              <PrivateRoute roles={["Restaurant Owner"]}>
                <CreateMenu />
              </PrivateRoute>
            }
          />
          <Route
            path="/restaurant/menu/form"
            element={
              <PrivateRoute roles={["Restaurant Owner"]}>
                <CreateMenuForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/restaurant/menu/items"
            element={
              <PrivateRoute roles={["Restaurant Owner"]}>
                <CreateMenuItems />
              </PrivateRoute>
            }
          />
          <Route
            path="/restaurant/menu/:restaurantId"
            element={
              <PrivateRoute roles={["Restaurant Owner"]}>
                <ShowMenu />
              </PrivateRoute>
            }
          />
          <Route
            path="/restaurant/promo/create/:restaurantId"
            element={
              <PrivateRoute roles={["Restaurant Owner"]}>
                <CreatePromo />
              </PrivateRoute>
            }
          />

          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<CheckoutPage />} />

          <Route
            path="/admin-dashboard"
            element={
             
                <AdminDashboard />
              
            }
          />

          <Route path="/customer-dashboard" element={<CustomerDashboard />} />

          {/* <Route path="/test-payment" element={<TestPayment />} /> */}

          {/* ===================== Delivery Rider Routes ===================== */}

          <Route path="/deliveryPersonnel" element={<DeliveryRiderHome />} />

          <Route
            path="/DeliveryPersonnel-OptionsSignUp"
            element={<DeliveryOptionsSignUp />}
          />
          <Route
            path="/deliveryPersonnel-SignUp"
            element={<DeliverySignUp />}
          />
          <Route
            path="/deliveryPersonnel/VehicleDetails-SignUp"
            element={<VehicleDetailsSignUp />}
          />
          <Route
            path="/deliveryPersonnel/DriverDashboard"
            element={<DriverDashboard />}
          />
          <Route
            path="/deliveryPersonnel/HomePage"
            element={<DeliveryRiderHome />}
          />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/google-callback" element={<GoogleCallback />} />




        </Routes>
      </main>
      {!isAuthPage && !isDliveryPersonnelSignUp && <Footer />}

    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Import UserProvider
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Home from './Pages/Home';
import Login from './Pages/Auth/LoginPage';
import Register from './Pages/Auth/RegisterPage';
import OwnerRegister from './components/ResturantManagement/OwnerRegister';
import RestaurantRegister from './components/ResturantManagement/RestaurantRegister';
import Restaurant from './Pages/Restaurant/Restaurant';
import RestaurantDetails from './Pages/Order/RestaurantDetails';
import Cart from './Pages/Order/Cart';
import { AuthProvider } from './components/Auth/AuthContext';
import Profile from './Pages/Restaurant/profile/Profile';
import DeliveryOptionsSignUp from './Pages/Delivery personnel/DeliveryOptionsSignUp';
import DeliverySignUp from './Pages/Delivery personnel/DeliverySignUp';
import VehicleDetailsSignUp from './Pages/Delivery personnel/VehicleDetailsSignUp';

import DriverDashboard from './Pages/Delivery personnel/DeliveryRiderDashboard/DriverDashboard';
import DeliveryRiderHome from './Pages/Delivery personnel/DeliveryHomePage';


import Checkout from './Pages/Order/Checkout';
import CreateMenu from './Pages/Restaurant/profile/CreateMenu';
import CreateMenuForm from './components/ResturantManagement/profile/CreateMenuForm';
import CreateMenuItems from './components/ResturantManagement/profile/CreateMenuItems';
import OwnerLogin from './Pages/Restaurant/profile/OwnerLogin';
import ShowMenu from './components/ResturantManagement/profile/ShowMenu';
import CreatePromo from './components/ResturantManagement/profile/CreatePromo';
import AdminDashboard from './Pages/Admin/AdminDashboard';

// AppContent should be inside Router to use useLocation()
const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDliveryPersonnelSignUp = location.pathname === '/deliveryPersonnel-SignUp' || location.pathname === '/DeliveryPersonnel-OptionsSignUp' || location.pathname === '/deliveryPersonnel/VehicleDetails-SignUp' || location.pathname === '/deliveryPersonnel/DriverDashboard';

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
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/owner/profile" element={<Profile />} />

          {/* ===================== Delivery Rider Routes ===================== */}

          <Route path="/deliveryPersonnel" element={<DeliveryRiderHome />} />

          <Route path="/DeliveryPersonnel-OptionsSignUp" element={<DeliveryOptionsSignUp />} />
          <Route path="/deliveryPersonnel-SignUp" element={<DeliverySignUp />} />
          <Route path="/deliveryPersonnel/VehicleDetails-SignUp" element={<VehicleDetailsSignUp />} />
          <Route path="/deliveryPersonnel/DriverDashboard" element={<DriverDashboard />} />
          <Route path="/deliveryPersonnel/HomePage" element={<DeliveryRiderHome />} />



          <Route path="/restaurant/menu/create/:id" element={<CreateMenu />} />
          <Route path="/restaurant/menu/form" element={<CreateMenuForm />} />
          <Route path="/restaurant/menu/items" element={<CreateMenuItems />} />
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/restaurant/menu/:restaurantId" element={<ShowMenu />} />
          <Route path="/restaurant/promo/create/:restaurantId" element={<CreatePromo />} />

          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAuthPage && !isDliveryPersonnelSignUp && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>  {/* Wrap your app in UserProvider */}
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;

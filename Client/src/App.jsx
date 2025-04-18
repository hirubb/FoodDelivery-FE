import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import PaymentMethodSelectionPage from './Pages/Payment/PaymentMethodSelectionPage'
import PaymentMethodSelector from './components/Payment/PaymentMethodSelector'
import OrderSummary from './components/Payment/OrderSummary'
import CheckoutCardPage from './Pages/Payment/CheckoutCardPage'
import PaypalPayment from './Pages/Payment/PaypalPayment'
import PaymentSuccess from './Pages/Payment/PaymentSuccess'
import PaymentFailed from './Pages/Payment/PaymentFailed'
import CardPaymentForm from './components/Payment/CardPaymentForm'
import PaymentRefunded from './Pages/Payment/PaymentRefunded'

// AppContent should be inside Router to use useLocation()
const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App">
      {!isAuthPage && <Header />}
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
          <Route path="/payment/selectpaymentmethod" element={<PaymentMethodSelectionPage />} />
          <Route path="/payment/paymentmethodselector" element={<PaymentMethodSelector />} />
          <Route path="/payment/ordersummary" element={<OrderSummary />} />
          <Route path="/payment/checkoutcard" element={<CheckoutCardPage />} />
          <Route path="/payment/paypal-payment" element={<PaypalPayment />} />
          <Route path="/payment/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment/payment-failed" element={<PaymentFailed />} />
          <Route path="/payment/cardpayment-form" element={<CardPaymentForm />} />
          <Route path="/payment/payment-refunded" element={<PaymentRefunded />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;

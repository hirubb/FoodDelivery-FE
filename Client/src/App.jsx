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

// Wrapper component that conditionally renders the Header
const App = () => {
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
          <Route path="/restaurants" element={<Restaurant/>} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/owner/profile" element={<Profile/>}/>
        </Routes>
      </main>
      <Footer />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
};


export default App;
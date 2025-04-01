import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Home from './Pages/Home';
import OwnerRegister from './components/ResturantManagement/OwnerRegister';
import RestaurantRegister from './components/ResturantManagement/RestaurantRegister';
import Restaurant from './Pages/Restaurant/Restaurant';

import Profile from './Pages/Restaurant/profile/Profile';

function App() {
  return (
    
    <Router>
      <div>
        <Header />
      </div>
     
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/owner-register" element={<OwnerRegister />} />
          <Route path="/restaurant-register" element={<RestaurantRegister />} />
          <Route path="/restaurants" element={<Restaurant/>}/>
          <Route path="/owner/profile" element={<Profile/>}/>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;

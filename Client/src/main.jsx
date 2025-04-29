import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <CartProvider>
           <App />
        </CartProvider>
  </React.StrictMode>
);

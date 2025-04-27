// src/context/CartContext.jsx
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i._id === item._id);
      
      if (existingItem) {
        return prevCart.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [
          ...prevCart,
          {
            ...item,
            quantity: 1,
          },
        ];
      }
    });
  };
  
  const updateQuantity = (itemId, newQuantity) => {
    setCart((prevCart) => 
      prevCart
        .map((item) => 
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
  
  const removeItem = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };
  
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };
  
  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        getCartCount,
        getCartTotal,
        toggleCart,
        setCart  
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
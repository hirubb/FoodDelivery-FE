import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    // Initialize cart items from localStorage or empty array
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart items to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item, size) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(
                i => i.id === item.id && i.size === size
            );

            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id && i.size === size
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }

            return [...prevItems, {
                ...item,
                size,
                quantity: 1,
                price: item.prices[size]
            }];
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(prevItems => 
            prevItems.filter(item => item.id !== itemId)
        );
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(itemId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const getCartTotal = () => {
        return cartItems.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );
    };

    const getItemCount = () => {
        return cartItems.reduce(
            (total, item) => total + item.quantity,
            0
        );
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
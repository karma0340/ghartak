import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        // Increment total count
        setCartCount(prev => prev + 1);

        // Manage items array
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => {
            const item = prev.find(i => i.id === productId);
            if (!item) return prev;
            setCartCount(prevCount => Math.max(0, prevCount - item.quantity));
            return prev.filter(i => i.id !== productId);
        });
    };

    const clearCart = () => {
        setCartItems([]);
        setCartCount(0);
    };

    const value = useMemo(() => ({
        cartCount,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart
    }), [cartCount, cartItems]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

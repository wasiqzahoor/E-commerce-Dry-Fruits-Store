import React, { createContext, useState, useContext, useEffect } from 'react'; // 1. useEffect ko import karein
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 2. Initial state ko localStorage se load karein
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart items from localStorage", error);
      return [];
    }
  });

  // 3. Jab bhi cartItems badlein, to unhein localStorage mein save karein
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);


  // Baaqi functions waise hi rahenge, unhein badalne ki zaroorat nahi
  const addToCart = (product, quantity) => {
    const exist = cartItems.find((item) => item._id === product._id);
    if (exist) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id ? { ...exist, qty: exist.qty + quantity } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: quantity }]);
    }
    
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item._id !== productId));
    toast.error("Item removed from cart.");
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item._id === productId ? { ...item, qty: newQuantity } : item
        )
      );
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
import React, { createContext, useState, useContext, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlistItems(savedItems);
  }, []);

  // Function to add/remove an item from the wishlist
  const toggleWishlist = (product) => {
    let updatedWishlist;
    const isSaved = wishlistItems.some(item => item._id === product._id);

    if (isSaved) {
      // Remove item
      updatedWishlist = wishlistItems.filter(item => item._id !== product._id);
    } else {
      // Add item
      updatedWishlist = [...wishlistItems, product];
    }
    
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};
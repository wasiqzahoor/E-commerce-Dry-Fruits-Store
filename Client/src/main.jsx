import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // <-- AuthProvider ko import karein
import { WishlistProvider } from './context/WishlistContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <GoogleOAuthProvider clientId="387320254594-8lnji03kgts4g5hujvr7qro5sgbf5q7g.apps.googleusercontent.com">
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider> 
          <CartProvider>
            <App />
          </CartProvider>
        </WishlistProvider> 
      </AuthProvider>
    </BrowserRouter>
     </GoogleOAuthProvider>
  </React.StrictMode>
);
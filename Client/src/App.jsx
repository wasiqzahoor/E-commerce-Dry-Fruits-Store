import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {

    window.scrollTo(0, 0);
  }, [pathname]); 

  return null; 
};

export default ScrollToTop;import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; 
import HomePage from "./pages/HomePage";
import "./App.css";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminOrderListPage from "./pages/admin/AdminOrderListPage";
import AdminProductListPage from "./pages/admin/AdminProductListPage";
import AdminUserListPage from "./pages/admin/AdminUserListPage";
import AdminOrderHistoryPage from "./pages/admin/AdminOrderHistoryPage"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SavedItemsPage from "./pages/SavedItemsPage";
import AdminLayout from "./components/AdminLayout";
import AdminPromotionsPage from "./pages/admin/AdminPromotionsPage";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const location = useLocation();
  const pathsWithoutFooter = ['/auth'];
  const isAdminRoute = location.pathname.startsWith('/admin');

  const showFooter = !pathsWithoutFooter.includes(location.pathname) && !isAdminRoute;

  return (
    <>
      <Navbar />
      <ScrollToTop />
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-20"
      />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/saved-items" element={<SavedItemsPage />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrderListPage />} />
            <Route path="products" element={<AdminProductListPage />} />
            <Route path="users" element={<AdminUserListPage />} />
            <Route path="history" element={<AdminOrderHistoryPage />} />
            <Route path="promotions" element={<AdminPromotionsPage />} />
          </Route>
        </Routes>
      </main>

      {showFooter && <Footer />}
    </>
  );
}

export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./App.css";
// ... Baaqi saare page imports waise hi rahenge
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
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
import ProductList from "./components/ProductList";
import Layout from "./components/Layout"; // Naya Layout component import karein

function App() {
  return (
    <>
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
          {/* Naya Layout Route banayein jo baaqi routes ko wrap karega */}
          <Route path="/" element={<Layout />}>
            {/* Saare non-admin routes ab iske andar aayenge */}
            <Route index element={<HomePage />} /> {/* Homepage ke liye index route */}
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="products" element={<ProductList />} />
            <Route path="saved-items" element={<SavedItemsPage />} />

            <Route
              path="checkout"
              element={
                <ProtectedRoute> <CheckoutPage /> </ProtectedRoute>
              }
            />
            <Route
              path="my-orders"
              element={
                <ProtectedRoute> <MyOrdersPage /> </ProtectedRoute>
              }
            />
          </Route>
          
          {/* Admin routes ko alag rakhein */}
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute> <AdminLayout /> </AdminProtectedRoute>
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
    </>
  );
}

export default App;

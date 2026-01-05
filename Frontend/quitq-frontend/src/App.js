import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import PrivateRoute from "./components/PrivateRoute";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import CategoryManagement from "./pages/Admin/CategoryManagement";
import OrderManagementPage from "./pages/Admin/OrderManagementPage";

import SellerDashboard from "./pages/Seller/SellerDashboard";
import ManageProducts from "./pages/Seller/ManageProducts";
import SellerProfile from "./pages/Seller/SellerProfile";
import SellerBusinessProfile from "./pages/Seller/SellerBusinessProfile";  

import Profile from "./pages/User/Profile";
import Home from "./pages/User/Home";
import Categories from "./pages/User/Categories";
import CategoryProducts from "./pages/User/CategoryProducts";
import AllProducts from "./pages/User/AllProducts";
import ProductDetail from "./pages/User/ProductDetail";
import Cart from "./pages/User/Cart";
import Orders from "./pages/User/Orders";
import Checkout from "./pages/User/Checkout";
import About from "./pages/User/About";
import OrderSuccess from "./pages/User/OrderSuccess";

import Navbar from "./components/Navbar";

import "./index.css";

function AppContent() {
  const location = useLocation();

 
  const noNavbar = ["/login", "/register"];
  const showNavbar = !noNavbar.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />

       
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <PrivateRoute role="ADMIN">
              <CategoryManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <PrivateRoute role="ADMIN">
              <OrderManagementPage />
            </PrivateRoute>
          }
        />

        
        <Route
          path="/seller/dashboard"
          element={
            <PrivateRoute role="SELLER">
              <SellerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/seller/products"
          element={
            <PrivateRoute role="SELLER">
              <ManageProducts />
            </PrivateRoute>
          }
        />
        <Route
          path="/seller/profile"
          element={
            <PrivateRoute role="SELLER">
              <SellerProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/seller/business-profile"
          element={
            <PrivateRoute role="SELLER">
              <SellerBusinessProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories/:id"
          element={
            <PrivateRoute>
              <CategoryProducts />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <AllProducts />
            </PrivateRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <PrivateRoute>
              <ProductDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <PrivateRoute>
              <OrderSuccess />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}



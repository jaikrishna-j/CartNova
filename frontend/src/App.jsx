import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import api from '@/api';

import MainLayout from "./layout/MainLayout";
import HomePage from "./components/home/HomePage";
import NotFoundPage from "./components/ui/NotFoundPage";
import StorePage from "./components/home/StorePage";
import ProductPage from "./components/product/ProductPage";
import CartPage from "./components/cart/CartPage";
import CheckoutPage from "./components/checkout/CheckoutPage";
import LoginPage from "./components/user/LoginPage";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import UserProfilePage from "./components/user/UserProfilePage";
import PaymentStatusPage from "./components/payment/PaymentStatusPage";
import CustomToastContainer from "./components/ui/CustomToastContainer";
import RegisterPage from "./components/user/RegisterPage";

const App = () => {
  const [numCartItems, setNumberCartItems] = useState(0);
  const cart_code = localStorage.getItem("cart_code");

  useEffect(function () {
    if (cart_code) {
      api.get(`get_cart_stat?cart_code=${cart_code}`)
        .then(res => {
          setNumberCartItems(res.data.num_of_items);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }, []);

  return (
    <AuthProvider>
      {/* This renders your toast container */}
      <CustomToastContainer />
      
      <Routes>
        <Route path="/" element={<MainLayout numCartItems={numCartItems} />}>
          <Route index element={<HomePage />} />
          <Route path="products/:slug" element={<ProductPage setNumberCartItems={setNumberCartItems} />} />
          <Route path="cart" element={<CartPage setNumberCartItems={setNumberCartItems} />} />
          <Route path="checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="profile" element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } />
          <Route path="payment-status" element={<PaymentStatusPage />}/>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
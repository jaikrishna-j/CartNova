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
import AboutPage from "./components/pages/AboutPage";
import ContactPage from "./components/pages/ContactPage";
import TermsPage from "./components/pages/TermsPage";
import PrivacyPage from "./components/pages/PrivacyPage";

// Inner component that has access to AuthContext
const AppRoutes = () => {
  const [numCartItems, setNumberCartItems] = useState(0);
  const cart_code = localStorage.getItem("cart_code");

  useEffect(function () {
    // Fetch cart stats if we have a cart_code
    if (cart_code) {
      api.get(`get_cart_stat?cart_code=${cart_code}`)
        .then(res => {
          // Ensure we get a valid number, default to 0 if invalid
          const numItems = res.data.num_of_items || 0;
          setNumberCartItems(numItems);
        })
        .catch(err => {
          console.log(err.message);
          setNumberCartItems(0);
        });
    } else {
      setNumberCartItems(0);
    }
  }, [cart_code]);
  
  // Also listen for cart updates from other components
  useEffect(function () {
    const handleCartUpdate = () => {
      const currentCartCode = localStorage.getItem("cart_code");
      if (currentCartCode) {
        api.get(`get_cart_stat?cart_code=${currentCartCode}`)
          .then(res => {
            setNumberCartItems(res.data.num_of_items || 0);
          })
          .catch(() => setNumberCartItems(0));
      }
    };
    
    // Listen for custom event when cart is updated
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  return (
    <>
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
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
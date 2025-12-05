import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './tailwind-scope.css';


const googleClientId = "1082363198832-bf2isc0l8e89cr3vkqfaotaaioj5m6tp.apps.googleusercontent.com";

const queryClient = new QueryClient();

// Configuration for PayPal
const initialOptions = {
    "client-id": "AVj6zN6mWe-5begZfoXssJKTmZfupJ1LWU346-BX5sryyyVrpmP64xYYJBE6f55uYQkB-1xaf45IYFFx",
    currency: "USD",
    intent: "capture",
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <PayPalScriptProvider options={initialOptions}>
          <App />
        </PayPalScriptProvider>
      </QueryClientProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
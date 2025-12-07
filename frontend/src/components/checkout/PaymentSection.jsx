import api from '@/api';
import React, { useState, useEffect } from 'react';
import { FaPaypal } from 'react-icons/fa';
// import { SiGooglepay } from 'react-icons/si'; // Removed GPay icon
import { RiShieldCheckLine } from 'react-icons/ri';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

const PaymentSection = () => {
    const cart_code = localStorage.getItem("cart_code");
    const [loadingGateway, setLoadingGateway] = useState(null);
    const [userData, setUserData] = useState({ name: '', email: '', phone: '' });

    const [{ isPending }] = usePayPalScriptReducer();

    useEffect(() => {
        api.get('user_info')
            .then(res => {
                setUserData({
                    name: `${res.data.first_name || ''} ${res.data.last_name || ''}`.trim() || res.data.username || 'Customer',
                    email: res.data.email || '',
                    phone: res.data.phone || ''
                });
            })
            .catch(err => console.error("Could not fetch user info for payment:", err.response ? err.response.data : err.message));
    }, []);

    // --- RAZORPAY PAYMENT ---
    function makeRazorpayPayment() {
        if (typeof window.Razorpay !== 'function') {
            alert("Razorpay is not available. Please refresh.");
            return;
        }
        setLoadingGateway('razorpay');
        api.post("initiate_payment/", { cart_code, gateway: 'razorpay' })
            .then(res => {
                const responseData = res.data;
                if (!responseData || !responseData.order_id) { throw new Error("Invalid Razorpay order data"); }
                const options = {
                    key: responseData.key,
                    amount: responseData.amount,
                    currency: responseData.currency,
                    name: "CartNova",
                    description: `Payment for Cart #${cart_code}`,
                    order_id: responseData.order_id,
                    handler: (response) => {
                        setLoadingGateway('verifying');
                        api.post('verify_payment/', {
                            gateway: 'razorpay',
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }).then(verifyRes => {
                            if (verifyRes.data.status === 'success') {
                                localStorage.removeItem("cart_code");
                                window.location.href = `/payment-status?status=success&ref=${response.razorpay_order_id}`;
                            } else { throw new Error("Backend verification failed"); }
                        }).catch(verifyErr => {
                             console.error("Backend Verification FAILED:", verifyErr.response ? verifyErr.response.data : verifyErr.message);
                             window.location.href = `/payment-status?status=failure&ref=${response.razorpay_order_id}`;
                        });
                    },
                    prefill: { name: userData.name, email: userData.email, contact: userData.phone },
                    theme: { color: "#4F46E5" }
                };
                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', (response) => {
                    alert(`Payment Failed: ${response.error.description || 'Unknown Error'}`);
                    window.location.href = `/payment-status?status=failure&ref=${responseData.order_id}`;
                    setLoadingGateway(null);
                });
                rzp.open();
            })
            .catch(err => {
                console.error("Error initiating Razorpay:", err.response ? err.response.data : err.message);
                alert(`Could not start Razorpay payment. ${err.response?.data?.error || 'Please try again.'}`);
                setLoadingGateway(null);
            });
    }

    // --- PAYPAL: Create Order Function ---
    const createPayPalOrder = (data, actions) => {
        setLoadingGateway('paypal');
        return api.post("initiate_payment/", { cart_code, gateway: 'paypal' })
            .then(res => {
                console.log("PayPal Initiation Response:", res.data);
                if (res.data && res.data.order_id) {
                    return res.data.order_id;
                } else {
                    throw new Error("Invalid order_id from backend for PayPal");
                }
            })
            .catch(err => {
                console.error("Error initiating PayPal:", err.response ? err.response.data : err.message);
                alert(`Could not start PayPal payment. ${err.response?.data?.error || 'Please try again.'}`);
                setLoadingGateway(null);
                return null;
            });
    };

    // --- PAYPAL: On Approve Function ---
    const onPayPalApprove = (data, actions) => {
        setLoadingGateway('verifying');
        console.log("PayPal Payment Success (Frontend):", data);
        return api.post('verify_payment/', {
            gateway: 'paypal',
            paypal_order_id: data.orderID
        })
        .then(verifyRes => {
            console.log("Backend Verification OK:", verifyRes.data);
            if (verifyRes.data.status === 'success') {
                localStorage.removeItem("cart_code");
                window.location.href = `/payment-status?status=success&ref=${data.orderID}`;
            } else {
                throw new Error("Backend verification failed");
            }
        })
        .catch(verifyErr => {
            console.error("Backend Verification FAILED:", verifyErr.response ? verifyErr.response.data : verifyErr.message);
            alert("Payment verification failed. Please contact support.");
            window.location.href = `/payment-status?status=failure&ref=${data.orderID}`;
        });
    };

    // --- PAYPAL: On Error Function ---
    const onPayPalError = (err) => {
         console.error("PayPal Error:", err);
         alert("An error occurred with the PayPal transaction. Please try again.");
         setLoadingGateway(null);
    };

    const isLoading = (gateway) => loadingGateway === gateway;

    return (
        <div className='lg:sticky lg:top-20 bg-white rounded-2xl sm:rounded-xl shadow-lg border border-gray-200 self-start'>
            <div className='bg-indigo-600 text-white rounded-t-2xl sm:rounded-t-xl px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4'>
                <h2 className='text-sm sm:text-base md:text-lg lg:text-xl font-bold'>Payment Options</h2>
            </div>
            <div className='p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4'>
                
                {/* GPay Button Removed */}

                {/* PayPal Button Container */}
                <div className={`relative ${loadingGateway && loadingGateway !== 'paypal' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {/* Show loader on top if paypal is processing or script is loading */}
                    {(isLoading('paypal') || loadingGateway === 'verifying' || isPending) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/30 z-20 rounded-2xl sm:rounded-xl">
                             <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                        </div>
                    )}
                    <PayPalButtons
                        style={{
                            layout: "horizontal",
                            color: "blue",
                            shape: "rect",
                            label: "pay",
                            tagline: false,
                            height: 48,
                        }}
                        createOrder={createPayPalOrder}
                        onApprove={onPayPalApprove}
                        onError={onPayPalError}
                        disabled={loadingGateway && loadingGateway !== 'paypal'}
                    />
                </div>

                {/* Razorpay Button */}
                <button
                    className={`w-full flex items-center justify-center gap-2 sm:gap-3 h-10 sm:h-12 px-3 sm:px-4 bg-sky-500 text-white text-xs sm:text-sm md:text-base font-bold shadow-md rounded-lg sm:rounded-xl focus:outline-none border-none transition-all ${isLoading('razorpay') || loadingGateway ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-600'}`}
                    id="razorpay-button"
                    onClick={makeRazorpayPayment}
                    disabled={loadingGateway}
                >
                    {isLoading('razorpay') ? ( <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ) : ( <RiShieldCheckLine className="text-base sm:text-lg" /> )}
                    <span>{isLoading('razorpay') ? 'Processing...' : 'Pay with Razorpay'}</span>
                </button>
            </div>
        </div>
    );
};

export default PaymentSection;
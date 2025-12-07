import api from '@/api';
import React, { useState, useEffect } from 'react';
import { FaPaypal } from 'react-icons/fa';
// import { SiGooglepay } from 'react-icons/si'; // Removed GPay icon
import { RiShieldCheckLine } from 'react-icons/ri';
import { usePayPalScriptReducer } from '@paypal/react-paypal-js';

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

    // --- PAYPAL: Custom Button Handler ---
    const handlePayPalPayment = async () => {
        if (loadingGateway) return;
        
        setLoadingGateway('paypal');
        
        try {
            // Step 1: Create order on backend and get approval URL
            const res = await api.post("initiate_payment/", { cart_code, gateway: 'paypal' });
            console.log("PayPal Initiation Response:", res.data);
            
            if (!res.data || !res.data.order_id) {
                throw new Error("Invalid order_id from backend for PayPal");
            }
            
            const orderId = res.data.order_id;
            const approvalUrl = res.data.approval_url;
            
            // Step 2: Use PayPal SDK programmatically if approval URL not available, otherwise redirect
            if (approvalUrl) {
                // Redirect to PayPal approval page
                // PayPal will redirect back with token, which we'll handle on return
                window.location.href = approvalUrl;
            } else if (window.paypal && window.paypal.Buttons) {
                // Fallback: Use PayPal SDK programmatically
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'position: fixed; left: -9999px; top: -9999px; width: 1px; height: 1px; overflow: hidden; z-index: -1;';
                document.body.appendChild(buttonContainer);
                
                window.paypal.Buttons({
                    createOrder: () => orderId,
                    onApprove: async (data) => {
                        setLoadingGateway('verifying');
                        try {
                            const verifyRes = await api.post('verify_payment/', {
                                gateway: 'paypal',
                                paypal_order_id: data.orderID
                            });
                            
                            if (verifyRes.data.status === 'success') {
                                localStorage.removeItem("cart_code");
                                window.location.href = `/payment-status?status=success&ref=${data.orderID}`;
                            } else {
                                throw new Error("Backend verification failed");
                            }
                        } catch (verifyErr) {
                            console.error("Backend Verification FAILED:", verifyErr.response ? verifyErr.response.data : verifyErr.message);
                            alert("Payment verification failed. Please contact support.");
                            window.location.href = `/payment-status?status=failure&ref=${data.orderID}`;
                        }
                    },
                    onError: (err) => {
                        console.error("PayPal Error:", err);
                        alert("An error occurred with the PayPal transaction. Please try again.");
                        setLoadingGateway(null);
                    },
                    onCancel: () => {
                        console.log("PayPal payment cancelled");
                        setLoadingGateway(null);
                    }
                }).render(buttonContainer).then(() => {
                    const paypalButton = buttonContainer.querySelector('button');
                    if (paypalButton) {
                        paypalButton.click();
                    }
                    setTimeout(() => {
                        if (buttonContainer.parentNode) {
                            buttonContainer.parentNode.removeChild(buttonContainer);
                        }
                    }, 5000);
                }).catch((err) => {
                    console.error("Error rendering PayPal button:", err);
                    setLoadingGateway(null);
                    if (buttonContainer.parentNode) {
                        buttonContainer.parentNode.removeChild(buttonContainer);
                    }
                    alert("Could not initialize PayPal. Please try again.");
                });
            } else {
                throw new Error("PayPal SDK not loaded and approval URL not available.");
            }
        } catch (err) {
            console.error("Error initiating PayPal:", err.response ? err.response.data : err.message);
            alert(`Could not start PayPal payment. ${err.response?.data?.error || err.message || 'Please try again.'}`);
            setLoadingGateway(null);
        }
    };

    const isLoading = (gateway) => loadingGateway === gateway;

    return (
        <div className='lg:sticky lg:top-20 bg-white rounded-2xl sm:rounded-xl shadow-lg border border-gray-200 self-start'>
            <div className='bg-indigo-600 text-white rounded-t-2xl sm:rounded-t-xl px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:pt-2 lg:pb-4'>
                <h2 className='text-sm sm:text-base md:text-lg lg:text-xl font-bold'>Payment Options</h2>
            </div>
            <div className='p-4 sm:p-5 lg:pt-3 lg:px-6 lg:pb-6 space-y-3 sm:space-y-4'>
                
                {/* GPay Button Removed */}

                {/* PayPal Custom Button */}
                <button
                    className={`w-full flex items-center justify-center gap-2 sm:gap-3 h-10 sm:h-12 px-3 sm:px-4 bg-[#0070ba] text-white text-xs sm:text-sm md:text-base font-bold shadow-md rounded-lg sm:rounded-xl focus:outline-none border-none transition-all relative ${isLoading('paypal') || loadingGateway === 'verifying' || isPending || (loadingGateway && loadingGateway !== 'paypal') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#005ea6]'}`}
                    onClick={handlePayPalPayment}
                    disabled={isLoading('paypal') || loadingGateway === 'verifying' || isPending || (loadingGateway && loadingGateway !== 'paypal')}
                >
                    {isLoading('paypal') || loadingGateway === 'verifying' ? (
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <FaPaypal className="text-base sm:text-lg" />
                    )}
                    <span>
                        {isLoading('paypal') ? 'Processing...' : loadingGateway === 'verifying' ? 'Verifying...' : 'Pay with PayPal'}
                    </span>
                </button>

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
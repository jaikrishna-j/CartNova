import React from 'react';
import OrderSummary from './OrderSummary';
import PaymentSection from './PaymentSection';
import useCartData from '@/hooks/useCartData';
import Spinner from '../ui/Spinner';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const CheckoutPage = () => {
    const { cartItems, cartTotal, loading, tax, error } = useCartData();

    if (loading) {
        return <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]"><Spinner loading={loading} /></div>;
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <FiAlertTriangle className="mx-auto text-5xl text-red-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Error Loading Cart</h2>
                <p className="text-gray-500">Could not fetch your cart details. Please try again.</p>
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                 <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
                 <p className="text-gray-500 mb-6">You must add items to your cart before you can check out.</p>
                 <Link to="/store" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg">
                    Go to Store
                 </Link>
            </div>
        );
    }

    return (
        <div className='bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center'>
                    Checkout
                </h1>
                {/* --- THIS IS THE RESTORED, CORRECT LAYOUT --- */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start'>
                    {/* The Order Summary is back on the left */}
                    <div className="lg:col-span-7">
                        <OrderSummary cartItems={cartItems} cartTotal={cartTotal} tax={tax} />
                    </div>
                    {/* The Payment Section is back on the right */}
                    <div className="lg:col-span-5">
                        <PaymentSection />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
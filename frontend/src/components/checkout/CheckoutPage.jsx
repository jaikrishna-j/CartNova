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
            <div className="text-center py-12 sm:py-16 md:py-20">
                <FiAlertTriangle className="mx-auto text-3xl sm:text-4xl md:text-5xl text-red-400 mb-3 sm:mb-4" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Error Loading Cart</h2>
                <p className="text-sm sm:text-base text-gray-500">Could not fetch your cart details. Please try again.</p>
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="text-center py-12 sm:py-16 md:py-20">
                 <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Your Cart is Empty</h2>
                 <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">You must add items to your cart before you can check out.</p>
                 <Link to="/store" className="bg-indigo-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base">
Go to Store
                 </Link>
            </div>
        );
    }

    return (
        <div className='bg-gray-50 min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-6 md:mb-8 text-center'>
                    Checkout
                </h1>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-start'>
                    {/* The Order Summary is back on the left */}
                    <div className="lg:col-span-7 order-1 lg:order-1">
                        <OrderSummary cartItems={cartItems} cartTotal={cartTotal} tax={tax} />
                    </div>
                    {/* The Payment Section is back on the right */}
                    <div className="lg:col-span-5 mt-4 lg:mt-0 order-2 lg:order-2">
                        <PaymentSection />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
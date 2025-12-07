import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLock } from 'react-icons/fi';
import { AuthContext } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const CartSummary = ({ cartTotal, tax }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const subTotal = cartTotal.toFixed(2);
    const cartTax = tax.toFixed(2);
    const total = (cartTotal + tax).toFixed(2);

    const handleCheckoutClick = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            toast.error("Please sign in to proceed to checkout.");
            navigate('/login');
        }
    };

    return (
        <div className='lg:sticky lg:top-24 bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm'>
            <h2 className='text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4'>Order Summary</h2>
            
            <div className="space-y-2.5 sm:space-y-3">
                <div className='flex justify-between items-center text-sm sm:text-base text-gray-600'>
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">₹{subTotal}</span>
                </div>
                <div className='flex justify-between items-center text-sm sm:text-base text-gray-600'>
                    <span>Estimated Tax</span>
                    <span className="font-medium text-gray-900">₹{cartTax}</span>
                </div>
                <div className='flex justify-between items-center text-base sm:text-lg pt-3 sm:pt-4 border-t border-gray-200 mt-3 sm:mt-4'>
                    <span className="font-bold text-gray-900">Order Total</span>
                    <strong className="text-lg sm:text-xl font-bold text-indigo-600">₹{total}</strong>
                </div>
            </div>
            
            <Link to="/checkout" className="mt-4 sm:mt-6 block" onClick={handleCheckoutClick}>
                <button
                    className='w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 bg-indigo-600 text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105 border-none'
                >
                    <span>Proceed to Checkout</span>
                    <FiArrowRight className="text-base sm:text-lg" />
                </button>
            </Link>

            <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <FiLock className="text-xs sm:text-sm" />
                <span>Secure Checkout</span>
            </div>
        </div>
    );
};

export default CartSummary;
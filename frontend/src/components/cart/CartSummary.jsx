import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiLock } from 'react-icons/fi';

const CartSummary = ({ cartTotal, tax }) => {
    const subTotal = cartTotal.toFixed(2);
    const cartTax = tax.toFixed(2);
    const total = (cartTotal + tax).toFixed(2);

    return (
        <div className='lg:sticky lg:top-24 bg-gray-50 rounded-xl p-6 border border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Order Summary</h2>
            
            <div className="space-y-3">
                <div className='flex justify-between items-center text-gray-600'>
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">₹{subTotal}</span>
                </div>
                <div className='flex justify-between items-center text-gray-600'>
                    <span>Estimated Tax</span>
                    <span className="font-medium text-gray-900">₹{cartTax}</span>
                </div>
                <div className='flex justify-between items-center text-lg pt-4 border-t mt-4 border-gray-200'>
                    <span className="font-bold text-gray-900">Order Total</span>
                    <strong className="text-xl font-bold text-indigo-600">₹{total}</strong>
                </div>
            </div>
            
            <Link to="/checkout" className="mt-6 block">
                <button
                    className='w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105'
                >
                    <span>Proceed to Checkout</span>
                    <FiArrowRight />
                </button>
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <FiLock />
                <span>Secure Checkout</span>
            </div>
        </div>
    );
};

export default CartSummary;
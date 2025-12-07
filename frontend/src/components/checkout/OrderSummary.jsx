import React from 'react';
import OrderItem from './OrderItem';

const OrderSummary = ({ cartItems, cartTotal, tax }) => {
    const total = (cartTotal + tax).toFixed(2);

    return (
        <div className='bg-white rounded-2xl sm:rounded-xl shadow-lg border border-gray-200'>
            <div className='bg-indigo-600 text-white rounded-t-2xl sm:rounded-t-xl px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4'>
                <h2 className='text-sm sm:text-base md:text-lg lg:text-xl font-bold'>Order Summary</h2>
            </div>
            <div className='p-4 sm:p-5 lg:p-6'>
                <div className='max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-2 space-y-3 sm:space-y-4'>
                    {cartItems.map(item => <OrderItem key={item.id} cartItem={item} />)}
                </div>
                <div className='mt-3 sm:mt-4 lg:mt-6 pt-3 sm:pt-4 lg:pt-6 border-t border-gray-200 flex justify-between items-center'>
                    <h3 className='text-sm sm:text-base md:text-lg font-bold text-gray-900'>Total</h3>
                    <strong className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                        ₹{total}
                    </strong>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;

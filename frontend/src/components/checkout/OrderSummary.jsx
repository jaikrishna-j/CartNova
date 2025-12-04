import React from 'react';
import OrderItem from './OrderItem';

const OrderSummary = ({ cartItems, cartTotal, tax }) => {
    const total = (cartTotal + tax).toFixed(2);

    return (
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'>
            <div className='bg-indigo-600 text-white rounded-t-xl px-6 py-4'>
                <h2 className='text-xl font-bold'>Order Summary</h2>
            </div>
            <div className='p-6'>
                <div className='max-h-[300px] overflow-y-auto pr-2 space-y-4'>
                    {cartItems.map(item => <OrderItem key={item.id} cartItem={item} />)}
                </div>
                <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center'>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-white'>Total</h3>
                    <strong className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                        ₹{total}
                    </strong>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;

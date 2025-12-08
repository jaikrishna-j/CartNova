import React from 'react';
import { getProxiedImageUrl } from '@/utils/imageProxy';

const OrderItem = ({ cartItem }) => {
    const imgSrc = getProxiedImageUrl(cartItem.product?.image) || 'https://placehold.co/400x400/e0e7ff/3f51b5?text=NO+IMAGE';

    return (
        <div className='flex justify-between items-center gap-2 sm:gap-4'>
            <div className='flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1'>
                <img 
                    src={imgSrc}
                    alt={cartItem.product.name}
                    className='w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain rounded-md bg-gray-100 p-1 flex-shrink-0' 
                />
                <div className='min-w-0 flex-1'>
                    <h4 className='font-semibold text-gray-800 text-xs sm:text-sm md:text-base leading-tight truncate'>{cartItem.product.name}</h4>
                    <small className="text-xs sm:text-sm text-gray-500">{`Quantity: ${cartItem.quantity}`}</small>
                </div>
            </div>
            <span className='font-semibold text-gray-700 text-xs sm:text-sm md:text-base flex-shrink-0'>
                ₹{parseFloat(cartItem.total).toFixed(2)}
            </span>
        </div>
    );
};

export default OrderItem;

import { BASE_URL } from '@/api';
import React from 'react';

const OrderItem = ({ cartItem }) => {
    let imgSrc = 'https://placehold.co/400x400/e0e7ff/3f51b5?text=NO+IMAGE';
    if (cartItem.product?.image) {
        if (cartItem.product.image.startsWith('http')) {
            imgSrc = cartItem.product.image;
        } else {
            try { imgSrc = new URL(cartItem.product.image, BASE_URL).href; }
            catch (e) { console.error("Error creating image URL:", e); }
        }
    }

    return (
        <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
                <img 
                    src={imgSrc}
                    alt={cartItem.product.name}
                    className='w-16 h-16 object-contain rounded-md bg-gray-100 p-1' 
                />
                <div>
                    <h4 className='font-semibold text-gray-800 text-base'>{cartItem.product.name}</h4>
                    <small className="text-gray-500">{`Quantity: ${cartItem.quantity}`}</small>
                </div>
            </div>
            <span className='font-semibold text-gray-700'>
                ₹{parseFloat(cartItem.total).toFixed(2)}
            </span>
        </div>
    );
};

export default OrderItem;

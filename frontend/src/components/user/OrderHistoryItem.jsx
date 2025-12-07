import React from 'react';
import { BASE_URL } from '@/api';
import { Link } from 'react-router-dom';

// This component displays a single product item from your order history
const OrderHistoryItem = ({ item }) => {
    const { product, quantity, order_id, order_date } = item;

    // --- 1. CALCULATE THE TOTAL PRICE ---
    const itemTotal = (parseFloat(product?.price || 0) * quantity).toFixed(2);

    // Safely construct image URL
    let itemImage = 'https://placehold.co/80x80/e0e7ff/3f51b5?text=No+Img';
    if (product?.image && typeof product.image === 'string') {
        try {
            if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
                itemImage = product.image;
            } else {
                const cleanedBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
                const cleanedImagePath = product.image.startsWith('/') ? product.image.slice(1) : product.image;
                itemImage = `${cleanedBaseUrl}/${cleanedImagePath}`;
            }
        } catch (e) {
            console.error("Error creating image URL:", e, "Base:", BASE_URL, "Image:", product.image);
        }
    }

    // Format the date
    const orderDateTime = new Date(order_date).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    return (
        <div className='flex items-start gap-2 sm:gap-4 py-3 sm:py-4'>
            <img
                src={itemImage}
                alt={product?.name || 'Product'}
                className='w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md bg-gray-100 flex-shrink-0'
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/e0e7ff/3f51b5?text=Error'; }}
            />
            <div className='flex-grow text-left min-w-0 pr-2'>
                <Link to={`/products/${product.slug}`} className='font-medium text-xs sm:text-sm text-gray-800 line-clamp-2 hover:text-indigo-600 block'>
                    {product?.name || 'Product Name Unavailable'}
                </Link>
                <p className='text-xs text-gray-500 mt-1'>
                    Qty: {quantity}
                </p>
            </div>
            <div className='flex-shrink-0 text-right min-w-[90px] sm:min-w-[120px]'>
                {/* --- 2. ADD THE TOTAL PRICE HERE --- */}
                <p className='text-sm sm:text-base font-bold text-indigo-600 mb-1 break-words'>
                    ₹{itemTotal}
                </p>
                <p className='text-xs sm:text-sm font-semibold text-gray-800'>Order: #{order_id}</p>
                <p className='text-xs text-gray-500 leading-tight'>{orderDateTime}</p>
            </div>
        </div>
    );
};

export default OrderHistoryItem;
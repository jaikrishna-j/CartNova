import React from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '@/api';

const truncateWords = (text = '', limit = 8) => {
  const words = String(text).trim().split(/\s+/);
  return words.length > limit ? words.slice(0, limit).join(' ') + '...' : words.join(' ');
};

const HomeCard = ({ product }) => {
  const title = product?.title ?? product?.name ?? product?.product_name ?? '';
  const priceValue = product?.price ?? '0.00';
  const price = parseFloat(priceValue).toFixed(2);
  const displayedTitle = truncateWords(title, 8);

  let imgSrc = 'https://placehold.co/400x300/e0e7ff/3f51b5?text=NO+IMAGE';
  if (product?.image) {
    try {
      const imageUrl = new URL(product.image, BASE_URL);
      imgSrc = imageUrl.href;
    } catch (e) {
      console.error("Error creating image URL:", e);
    }
  }

  const categoryName = product?.category?.name || product?.category || 'General';

  return (
    <Link to={`/products/${product.slug}`} className="no-underline block h-full">
      {/* FIX: Animation classes are now here */}
      <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transform transition-transform duration-500 hover:scale-[1.03] hover:shadow-2xl">
        <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
          <img
            src={imgSrc}
            alt={title || 'Product Image'}
            className="h-full w-full object-contain object-center p-2"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/e0e7ff/3f51b5?text=Image+Load+Fail'; }}
          />
        </div>

        <div className="p-3 flex flex-col justify-between flex-grow">
          <div className='space-y-1'>
            <span className="text-xs font-medium text-purple-500 dark:text-purple-400 uppercase tracking-widest block truncate">
              {categoryName}
            </span>
            <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight block truncate">
              {displayedTitle}
            </h5>
          </div>
          <div className="mt-2 flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
            <h6 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
              ₹{price}
            </h6>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomeCard;
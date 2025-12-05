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
    <Link to={`/products/${product.slug}`} className="no-underline block h-full group">
      {/* Enhanced card with better animations */}
      <div className="flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-indigo-300">
        <div className="relative w-full overflow-hidden bg-gray-50 aspect-square group-hover:bg-gray-100 transition-colors duration-300">
          <img
            src={imgSrc}
            alt={title || 'Product Image'}
            className="h-full w-full object-contain object-center p-3 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/e0e7ff/3f51b5?text=Image+Load+Fail'; }}
          />
        </div>

        <div className="p-4 flex flex-col justify-between flex-grow">
          <div className='space-y-2'>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block truncate">
              {categoryName}
            </span>
            <h5 className="text-base font-bold text-gray-900 leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-indigo-600 transition-colors duration-300">
              {displayedTitle}
            </h5>
          </div>
          <div className="mt-3 flex justify-between items-center pt-3 border-t border-gray-100">
            <h6 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              ₹{price}
            </h6>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomeCard;
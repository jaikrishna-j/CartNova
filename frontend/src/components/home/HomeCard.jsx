import React from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '@/api';

const HomeCard = ({ product }) => {
  const title = product?.title ?? product?.name ?? product?.product_name ?? '';
  const priceValue = product?.price ?? '0.00';
  const price = parseFloat(priceValue).toFixed(2);

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
    <Link to={`/products/${product.slug}`} className="no-underline block group">
      {/* Enhanced card with better animations - Square card */}
      <div className="flex flex-col aspect-square bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-indigo-300">
        {/* Square image container - flex basis 65% to leave more room for text, inner container is square */}
        <div className="relative w-full flex-[0_0_65%] bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center overflow-hidden">
          <div className="w-[75%] aspect-square overflow-hidden">
            <img
              src={imgSrc}
              alt={title || 'Product Image'}
              className="w-full h-full object-contain object-center p-3 transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/e0e7ff/3f51b5?text=Image+Load+Fail'; }}
            />
          </div>
        </div>

        {/* Text content section - ensures price is always visible */}
        <div className="px-3 pt-2.5 pb-3 flex flex-col flex-1 min-h-0">
          <div className='space-y-1.5 flex-shrink-0'>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block truncate">
              {categoryName}
            </span>
            <h5 className="text-sm font-bold text-gray-900 leading-tight line-clamp-1 truncate group-hover:text-indigo-600 transition-colors duration-300">
              {title}
            </h5>
          </div>
          <div className="mt-auto pt-2 flex justify-between items-center border-t border-gray-100 flex-shrink-0">
            <h6 className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              ₹{price}
            </h6>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomeCard;
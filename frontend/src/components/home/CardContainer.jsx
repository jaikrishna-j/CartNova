import HomeCard from './HomeCard';
import React from 'react';

const CardContainer = ({ products, isSearch = false }) => {
  return (
    <section
      className={`py-8 sm:py-12 bg-gray-50 ${isSearch ? 'pt-0' : 'pt-20'}`}
      id="products"
    >
      {!isSearch && (
        <h4 className="mt-8 mb-6 text-xl font-extrabold tracking-tight text-center text-transparent text-gray-800 sm:text-2xl md:text-3xl lg:text-4xl sm:mt-12 sm:mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
          Our Featured Products
        </h4>
      )}

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {isSearch && products.length > 0 && (
          <div className="sticky z-10 px-4 py-3 mb-6 bg-white border border-indigo-200 shadow-md rounded-xl top-20 backdrop-blur-sm bg-white/95">
            <span className="text-sm font-medium text-gray-700">
              Showing <span className="font-bold text-indigo-600">{products.length}</span> products
            </span>
          </div>
        )}

        {/* Product Grid: Now renders HomeCard directly */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {products?.map((product) => (
            <HomeCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <p className="mt-8 text-base text-center text-gray-500 sm:text-lg md:text-xl sm:mt-12">No products found.</p>
        )}
      </div>
    </section>
  );
};

export default CardContainer;
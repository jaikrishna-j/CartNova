import HomeCard from './HomeCard';
import React from 'react';

const CardContainer = ({ products, isSearch = false }) => {
  // Note: searchParams logic is kept but not used for rendering in this simplified version.

  return (
    <section
      className={`py-8 sm:py-12 bg-gray-50 dark:bg-gray-900 ${isSearch ? 'pt-0' : 'pt-20'}`}
      id="products"
    >
      {!isSearch && (
        <h4 className="text-center text-3xl sm:text-4xl mt-12 font-extrabold text-gray-800 dark:text-gray-100 mb-8 tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          Our Featured Products
        </h4>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isSearch && products.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 px-4 py-3 mb-6 shadow-md dark:shadow-gray-900/50 rounded-xl sticky top-20 z-10 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Showing <span className="font-bold text-indigo-600 dark:text-indigo-400">{products.length}</span> products
            </span>
          </div>
        )}

        {/* Product Grid: Now renders HomeCard directly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <HomeCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-xl text-gray-500 dark:text-gray-400 mt-12">No products found.</p>
        )}
      </div>
    </section>
  );
};

export default CardContainer;
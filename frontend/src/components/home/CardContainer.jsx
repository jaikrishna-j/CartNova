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
        <h4 className="text-center text-3xl mt-12 font-extrabold text-gray-800 dark:text-gray-100 mb-8 tracking-tight">
          Our Featured Products
        </h4>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isSearch && products.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border-b border-indigo-300 dark:border-indigo-600 px-4 py-3 mb-6 shadow-sm rounded-xl sticky top-20 z-10">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Showing <span className="font-bold text-indigo-500">{products.length}</span> products
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
          <p className="text-center text-xl text-gray-500 mt-12">No products found.</p>
        )}
      </div>
    </section>
  );
};

export default CardContainer;
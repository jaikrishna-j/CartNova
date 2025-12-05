import HomeCard from './HomeCard';
import React from 'react';

const CardContainer = ({ products, isSearch = false }) => {
  // Note: searchParams logic is kept but not used for rendering in this simplified version.

  return (
    <section
      className={`py-8 sm:py-12 bg-gray-50 ${isSearch ? 'pt-0' : 'pt-20'}`}
      id="products"
    >
      {!isSearch && (
        <h4 className="text-center text-3xl sm:text-4xl mt-12 font-extrabold text-gray-800 mb-8 tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Our Featured Products
        </h4>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isSearch && products.length > 0 && (
          <div className="bg-white border border-indigo-200 px-4 py-3 mb-6 shadow-md rounded-xl sticky top-20 z-10 backdrop-blur-sm bg-white/95">
            <span className="text-sm font-medium text-gray-700">
              Showing <span className="font-bold text-indigo-600">{products.length}</span> products
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
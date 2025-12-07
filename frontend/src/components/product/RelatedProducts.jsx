import React from 'react';
import HomeCard from '../home/HomeCard'; 

const RelatedProducts = ({ products }) => {
    if (!Array.isArray(products) || products.length === 0) {
        return null;
    }

    return (
        <section className="py-6 sm:py-8 md:py-12 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 border-b border-gray-200 pb-2 sm:pb-3">
                    Customers also liked
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map(product => (
                       <HomeCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedProducts;
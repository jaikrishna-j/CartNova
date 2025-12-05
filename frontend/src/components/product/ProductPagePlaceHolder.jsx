import React from 'react';

const ProductPagePlaceHolder = () => (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col md:flex-row gap-8 md:gap-16 items-start animate-pulse">
            <div className="w-full md:w-1/2">
                <div className="h-80 md:h-96 lg:h-[550px] bg-gray-300 rounded-xl w-full"></div>
            </div>
            <div className="w-full md:w-1/2 space-y-6 pt-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-10 bg-gray-400 rounded w-3/4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                <div className="space-y-3 pt-4">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-11/12"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
                <div className="pt-6">
                    <div className="h-12 bg-gray-400 rounded-xl w-48"></div>
                </div>
            </div>
        </div>
    </section>
);

export default ProductPagePlaceHolder;
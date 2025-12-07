import React from 'react';
import HomeCard from '@/components/home/HomeCard'; 
import PagePagination from '@/components/ui/PagePagination';
import PlaceHolderContainer from '@/components/ui/PlaceHolderContainer';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';

const Store = ({
    products,
    allCategories,
    isLoading,
    productData,
    urlCategory,
    totalPages,
    urlPage,
    isCategoryListOpen,
    handleCategoryChange,
    handleSetPage,
    setIsCategoryListOpen
}) => {

    if (isLoading && !productData) { 
        return (
            <div className="pt-24 px-4 sm:px-6 lg:px-8">
                <PlaceHolderContainer />
            </div>
        );
    }

    return (
        <div className='bg-white min-h-screen'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-8 sm:pb-12">
                
                <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-6 md:mb-8 tracking-tighter border-b pb-2 sm:pb-3 md:pb-4 border-indigo-200'>
                    The Store Front
                </h1>

                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-x-12 items-start'> 
                    
                    <aside className='mb-4 sm:mb-6 lg:mb-0 lg:col-span-1 z-10'> 
                        <div className={`bg-white rounded-xl border border-indigo-200 lg:sticky lg:top-24 select-none transition-all duration-300 ${isCategoryListOpen ? 'p-6' : 'py-2.5 px-4'}`}>
                            <button
                                onClick={() => setIsCategoryListOpen(prev => !prev)}
                                className='w-full flex justify-between items-center focus:outline-none border-none p-0 cursor-pointer bg-transparent hover:opacity-80 transition-opacity duration-200' 
                            >
                                <h2 className='text-base sm:text-lg font-bold text-indigo-600'>
                                    Categories
                                </h2>
                                {isCategoryListOpen ? (
                                    <HiChevronUp className='text-indigo-600 text-xl transition-transform duration-300' />
                                ) : (
                                    <HiChevronDown className='text-indigo-600 text-xl transition-transform duration-300' />
                                )}
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCategoryListOpen ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                                <ul className='space-y-2 list-none p-0 m-0'> 
                                    {allCategories.map((category) => (
                                        <li key={category.value} className='my-0'> 
                                            <button
                                                onClick={() => handleCategoryChange(category.value)}
                                                className={`w-full text-left py-2.5 px-3 rounded-lg text-base font-medium transition-all duration-200 border-none bg-transparent focus:outline-none cursor-pointer
                                                    ${urlCategory === category.value 
                                                        ? 'bg-indigo-100 text-indigo-700 shadow-sm font-semibold' 
                                                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                                    }`}
                                            >
                                                {category.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>

                    <main className='lg:col-span-3 pt-4 sm:pt-6'>
                        
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <p className="text-xs sm:text-sm text-gray-600">
                                Showing <span className="font-semibold text-indigo-600">{productData?.count ?? 0}</span> results
                            </p>
                        </div>
                        
                        {(() => {
                            if (isLoading && productData?.results?.length === 0) {
                                return <PlaceHolderContainer />;
                            } else if (products.length > 0) {
                                return (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {products.map(product => (
                                            <HomeCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                );
                            } else {
                                return (
                                    <div className='text-center py-12 sm:py-16 md:py-20 bg-white rounded-xl mt-6 sm:mt-8 shadow-md border border-gray-200'>
                                        <p className='text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-600'>
                                            No products found matching your filter criteria.
                                        </p>
                                    </div>
                                );
                            }
                        })()}

                        {totalPages > 1 && (
                            <div className='mt-8 sm:mt-10 md:mt-12 w-full flex justify-center'>
                                <PagePagination 
                                    numOfPages={totalPages} 
                                    handleSetPage={handleSetPage} 
                                    page={urlPage} 
                                />
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
};

export default Store;
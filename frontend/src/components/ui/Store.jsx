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
        <div className='bg-white dark:bg-gray-900 min-h-screen'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
                
                <h1 className='text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 tracking-tighter border-b pb-4 border-indigo-200 dark:border-indigo-700'>
                    The Store Front
                </h1>

                <div className='grid grid-cols-1 lg:grid-cols-4 gap-x-12 items-start'> 
                    
                    <aside className='mb-8 lg:mb-0 lg:col-span-1 z-10'> 
                        <div className='p-6 bg-white rounded-xl shadow-lg border border-indigo-300 lg:sticky lg:top-24 select-none'>
                            <button
                                onClick={() => setIsCategoryListOpen(prev => !prev)}
                                className='w-full flex justify-between items-center focus:outline-none border-none p-0 cursor-pointer bg-transparent' 
                            >
                                <h2 className='text-lg font-bold text-[#6050DC]'>
                                    Categories
                                </h2>
                                {isCategoryListOpen ? (
                                    <HiChevronUp className='text-[#6050DC] text-xl transition-transform duration-300' />
                                ) : (
                                    <HiChevronDown className='text-[#6050DC] text-xl transition-transform duration-300' />
                                )}
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCategoryListOpen ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                <ul className='space-y-1 list-none p-0 m-0'> 
                                    {allCategories.map((category) => (
                                        <li key={category.value} className='my-0'> 
                                            <button
                                                onClick={() => handleCategoryChange(category.value)}
                                                className={`w-full text-left py-1 px-2 rounded-md text-base font-normal transition-colors duration-200 border-none bg-white p-0 m-0 focus:outline-none cursor-pointer
                                                    ${urlCategory === category.value 
                                                        ? 'bg-indigo-100 text-[#6050DC] shadow-sm font-semibold' 
                                                        : 'text-gray-800 hover:bg-indigo-50 hover:text-indigo-600'
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

                    <main className='lg:col-span-3 pt-6'>
                        
                        <div className="flex items-center justify-between mb-6 p-3 bg-white dark:bg-gray-800 rounded-[10px] shadow-md border border-gray-200 dark:border-gray-700">
                            <p className="mt-2.5 ml-2 text-sm text-gray-600 dark:text-gray-400">
                                Showing <span className="font-semibold text-gray-900 dark:text-white">{productData?.count ?? 0}</span> results
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
                                    <div className='text-center py-20 bg-white dark:bg-gray-800 rounded-xl mt-8 shadow-md'>
                                        <p className='text-xl font-medium text-gray-600 dark:text-gray-400'>
                                            No products found matching your filter criteria.
                                        </p>
                                    </div>
                                );
                            }
                        })()}

                        {totalPages > 1 && (
                            <div className='mt-10'>
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
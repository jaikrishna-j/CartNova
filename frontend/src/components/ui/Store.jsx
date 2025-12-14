import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import HomeCard from '@/components/home/HomeCard'; 
import PagePagination from '@/components/ui/PagePagination';
import PlaceHolderContainer from '@/components/ui/PlaceHolderContainer';
import { HiChevronDown, HiChevronUp, HiOutlineBars3 } from 'react-icons/hi2';
import { IoSearch } from 'react-icons/io5';

const Store = ({
    products,
    allCategories,
    isLoading,
    productData,
    urlCategory,
    urlQuery,
    totalPages,
    urlPage,
    isCategoryListOpen,
    handleCategoryChange,
    handleSetPage,
    setIsCategoryListOpen
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(urlQuery || '');
    const [isMobileCategoryMenuOpen, setIsMobileCategoryMenuOpen] = useState(false);
    const mobileCategoryButtonRef = useRef(null);

    // Sync search query with URL params
    useEffect(() => {
        const urlQueryParam = searchParams.get('q') || '';
        setSearchQuery(urlQueryParam);
    }, [searchParams]);

    // Handle click outside mobile category menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                mobileCategoryButtonRef.current &&
                !mobileCategoryButtonRef.current.contains(event.target)
            ) {
                setIsMobileCategoryMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMobileSearchSubmit = (e) => {
        e.preventDefault();
        const newParams = new URLSearchParams();
        const trimmedQuery = searchQuery.trim();
        
        if (trimmedQuery) {
            newParams.set('q', trimmedQuery);
            // When searching, ignore category - search across all products
        } else {
            // When search is empty, restore category filter
            if (urlCategory !== 'all') {
                newParams.set('category', urlCategory);
            }
        }
        newParams.set('page', '1');
        navigate(`/store?${newParams.toString()}`);
    };

    const handleMobileCategorySelect = (categoryValue) => {
        const newParams = new URLSearchParams();
        
        // If there's a search query, ignore category change (search takes priority)
        if (searchQuery.trim()) {
            newParams.set('q', searchQuery.trim());
        } else {
            // Only apply category when not searching
            if (categoryValue !== 'all') {
                newParams.set('category', categoryValue);
            }
        }
        newParams.set('page', '1');
        navigate(`/store?${newParams.toString()}`);
        setIsMobileCategoryMenuOpen(false);
    };

    const handleMobileSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
    };

    const currentCategoryLabel =
        allCategories.find((c) => c.value === urlCategory)?.label ||
        'All Products';

    if (isLoading && !productData) { 
        return (
            <div className='bg-white min-h-screen'>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-8 sm:pb-12">
                    <PlaceHolderContainer isSearch={false} gridCols="lg:grid-cols-3" noWrapper={true} />
                </div>
            </div>
        );
    }

    return (
        <div className='bg-white min-h-screen'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-8 sm:pb-12">
                
                {/* Mobile Search Bar - Only visible on mobile screens */}
                <div className='lg:hidden mb-6'>
                    <form onSubmit={handleMobileSearchSubmit} className='flex items-center gap-2 w-full'>
                        {/* Search Input - Takes most width */}
                        <input
                            type='text'
                            placeholder='Search products...'
                            value={searchQuery}
                            onChange={handleMobileSearchChange}
                            className='flex-grow bg-white px-4 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none text-sm border-0 rounded-full focus:ring-2 focus:ring-indigo-500 transition-all duration-200'
                        />
                        {/* Search Button */}
                        <button
                            type='submit'
                            className='bg-indigo-600 text-white w-12 h-12 hover:bg-indigo-700 transition duration-200 focus:outline-none flex items-center justify-center border-none rounded-full flex-shrink-0 shadow-md'
                        >
                            <IoSearch className='text-xl' />
                        </button>
                        {/* Category Button */}
                        <div ref={mobileCategoryButtonRef} className='relative flex-shrink-0'>
                            <button
                                type='button'
                                onClick={() => setIsMobileCategoryMenuOpen((prev) => !prev)}
                                className='bg-indigo-600 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2.5 rounded-full border-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center justify-center space-x-1 hover:bg-indigo-700 shadow-md h-12'
                            >
                                <HiOutlineBars3 className='text-base sm:text-lg' />
                                <span className='hidden sm:inline max-w-[80px] truncate'>{currentCategoryLabel}</span>
                                <HiChevronDown
                                    className={`ml-0.5 sm:ml-1 text-sm sm:text-base transition-transform duration-300 ${
                                        isMobileCategoryMenuOpen ? 'rotate-180' : 'rotate-0'
                                    }`}
                                />
                            </button>
                            {isMobileCategoryMenuOpen && (
                                <div className='absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-2xl border-0 py-2 max-h-[calc(100vh-12rem)] overflow-y-auto z-50'>
                                    {allCategories.map((cat, index) => (
                                        <button
                                            key={cat.value}
                                            onClick={() => handleMobileCategorySelect(cat.value)}
                                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                                                urlCategory === cat.value
                                                    ? 'bg-indigo-100 text-indigo-700 font-bold'
                                                    : 'text-gray-700 hover:bg-indigo-50'
                                            } ${index === 0 ? 'rounded-t-lg' : ''} ${
                                                index === allCategories.length - 1 ? 'rounded-b-lg' : ''
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-x-12 items-start'> 
                    
                    <aside className='hidden lg:block mb-4 sm:mb-6 lg:mb-0 lg:col-span-1 z-10'> 
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

                    <main className='lg:col-span-3 pt-4 sm:pt-6 lg:pt-4'>
                        
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <p className="text-xs sm:text-sm text-gray-600">
                                Showing <span className="font-semibold text-indigo-600">{productData?.count ?? 0}</span> results
                            </p>
                        </div>
                        
                        {(() => {
                            if (isLoading) {
                                return <PlaceHolderContainer isSearch={false} gridCols="lg:grid-cols-3" noWrapper={true} />;
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
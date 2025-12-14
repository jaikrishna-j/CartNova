import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Store from '@/components/ui/Store';
import { getProducts, getCategories } from '@/services/apiProducts';
import NetworkErrorDisplay from '@/components/ui/NetworkErrorDisplay';

const StorePage = () => {
    const [products, setProducts] = useState([]);
    const [productData, setProductData] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCategoryListOpen, setIsCategoryListOpen] = useState(() => {
        // Set initial state based on screen size - closed on mobile, open on desktop
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024;
        }
        return true;
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    const urlQuery = searchParams.get('q') || '';
    const urlCategory = searchParams.get('category') || 'all';
    
    const PRODUCTS_PER_PAGE = 9;

    useEffect(() => {
        const fetchStoreData = async () => {
            setIsLoading(true);
            setError(null); 
            try {
                const categoriesData = await getCategories();
                const productsData = await getProducts(urlPage, urlQuery, urlCategory, PRODUCTS_PER_PAGE);
                
                setProducts(productsData.results);
                setProductData(productsData);
                setAllCategories([{ label: 'All Products', value: 'all' }, ...categoriesData]);

            } catch (err) {
                console.error(err);
                setError(err.message); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchStoreData();
    }, [urlPage, urlQuery, urlCategory]);

    // Handle window resize to update category dropdown state for mobile/desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                // Desktop: keep it open
                setIsCategoryListOpen(true);
            } else {
                // Mobile: keep it closed
                setIsCategoryListOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        // Set initial state on mount
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSetPage = (newPage) => {
        searchParams.set('page', newPage);
        setSearchParams(searchParams);
    };

    const handleCategoryChange = (newCategory) => {
        searchParams.set('category', newCategory);
        searchParams.set('page', '1');
        setSearchParams(searchParams);
        if (window.innerWidth < 1024) {
            setIsCategoryListOpen(false);
        }
    };

    const totalPages = Math.ceil((productData?.count || 0) / PRODUCTS_PER_PAGE);

    if (error) {
        return (
            <NetworkErrorDisplay
                title="Could Not Load Store 🛒"
            />
        );
    }

    return (
        <Store 
            products={products}
            allCategories={allCategories}
            isLoading={isLoading}
            productData={productData}
            urlCategory={urlCategory}
            urlQuery={urlQuery}
            totalPages={totalPages}
            urlPage={urlPage}
            isCategoryListOpen={isCategoryListOpen}
            handleCategoryChange={handleCategoryChange}
            handleSetPage={handleSetPage}
            setIsCategoryListOpen={setIsCategoryListOpen}
        />
    );
};

export default StorePage;

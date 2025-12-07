import { useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import PagePagination from '@/components/ui/PagePagination';
import { getProducts } from '@/services/apiProducts';
import PlaceHolderContainer from '@/components/ui/PlaceHolderContainer';
import NetworkErrorDisplay from '@/components/ui/NetworkErrorDisplay';
import Header from '@/components/home/Header';
import CardContainer from '@/components/home/CardContainer';
import { useEffect } from 'react';
// FIX: Import the FUNCTION, not the value
import { generateRandomAlphanumeric } from '@/GenerateCartCode'; // Adjusted path assuming it's in src/

const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(function(){
        if(localStorage.getItem("cart_code") === null){
            // FIX: CALL the function to get a NEW code
            localStorage.setItem("cart_code", generateRandomAlphanumeric(11));
        }
    }, []);

    const urlPage = parseInt(searchParams.get('page') || '1');
    const urlQuery = searchParams.get('q') || '';
    const urlCategory = searchParams.get('category') || 'all';

    const isSearching = urlQuery || (urlCategory && urlCategory !== 'all');
    const page = urlPage;
    const numOfProductsPerPage = 8; // This should probably be handled by your paginator logic

    const { isPending, isError, error, data } = useQuery({
        queryKey: ['products', page, urlQuery, urlCategory],
        queryFn: () => getProducts(page, urlQuery, urlCategory),
        placeholderData: keepPreviousData
    });

    const products = data?.results || [];
    const numOfPages = data ? Math.ceil(data.count / numOfProductsPerPage) : 0;

    function handleSetPage (newPage) {
        if (newPage >= 1 && newPage <= numOfPages) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('page', newPage);
            setSearchParams(newParams);
        }
    }

    if (isError) {
        return (
            <NetworkErrorDisplay
                title="Data Fetching Failed 😔"
            />
        );
    }
    
    const content = (
        <section id='products' className='w-full'>
            {isPending ? (
                <PlaceHolderContainer />
            ) : products.length > 0 ? (
                <CardContainer products={products} isSearch={isSearching} />
            ) : (
                <div className='text-center py-20 bg-white'>
                    <p className='text-xl text-gray-500'>
                        No products found for your search criteria.
                    </p>
                </div>
            )}
            
            {numOfPages > 1 && (
                <div className='flex justify-center w-full my-6 sm:my-8 md:my-10 px-4'>
                    <PagePagination
                        page={page}
                        numOfPages={numOfPages}
                        handleSetPage={handleSetPage}
                    />
                </div>
            )}
        </section>
    );

    return (
        <>
            {!isSearching && <Header />}
            {content}
        </>
    )
}

export default HomePage;
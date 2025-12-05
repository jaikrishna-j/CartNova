import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductPagePlaceHolder from './ProductPagePlaceHolder';
import RelatedProducts from './RelatedProducts';
import { getProductDetail } from '@/services/apiProducts';
import api, { BASE_URL } from '@/api';
import { FiShoppingCart } from 'react-icons/fi';

// --- THIS IS THE ONLY CHANGE ---
import toast from 'react-hot-toast'; // Change this import from 'sonner'

import { generateRandomAlphanumeric } from '../../GenerateCartCode';
import Spinner from '../ui/Spinner'; 

const ProductPage = ({ setNumberCartItems }) => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [inCart, setInCart] = useState(false);
    const [similarProducts, setSimilarProducts] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!slug) {
            setError('No product slug provided.');
            setLoading(false);
            return;
        }
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            setInCart(false); 
            try {
                const data = await getProductDetail(slug);
                if (!data || !data.id) {
                    navigate('/404', { replace: true });
                    return;
                }
                setProduct(data);
                setSimilarProducts(data.similar_products || []);
            } catch (err) {
                setError(err.message || 'Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug, navigate]);
    
    useEffect(() => {
        if (product && product.id) {
            const cart_code = localStorage.getItem('cart_code');
            const product_id = product.id;
            if (cart_code) {
                api.get(`product_in_cart?cart_code=${cart_code}&product_id=${product_id}`)
                    .then(res => {
                        setInCart(res.data.product_in_cart);
                    })
                    .catch(err => {
                        console.log("Could not check cart status initially:", err.message);
                        setInCart(false); 
                    });
            } else {
                setInCart(false);
            }
        }
    }, [product]); 

    async function add_item() {
        if (!product || isAdding) {
            return;
        }
        setIsAdding(true);
        setError(null);

        try {
            let currentCartCode = localStorage.getItem("cart_code");

            if (!currentCartCode) {
                currentCartCode = generateRandomAlphanumeric(11);
                localStorage.setItem("cart_code", currentCartCode);
                console.log("Generated NEW cart_code:", currentCartCode);
            }

            const newItem = {
                cart_code: currentCartCode,
                product_id: product.id
            };

            const response = await api.post('add_item/', newItem);
            console.log('Item added successfully:', response.data);
            setInCart(true);
            
            // This function call works perfectly with react-hot-toast
            toast.success("Added to cart"); 

            api.get(`get_cart_stat?cart_code=${currentCartCode}`)
                .then(statRes => {
                    if (setNumberCartItems) {
                        setNumberCartItems(statRes.data.num_of_items);
                    }
                })
                .catch(statErr => console.error("Failed to update cart count:", statErr));

        } catch (err) {
            console.error('Error adding item:', err.response ? err.response.data : err.message);
            setError('Failed to add item to cart. Please try again.');
            
            // This also works perfectly
            toast.error("Failed to add item to cart."); 
        } finally {
            setIsAdding(false);
        }
    }

    if (loading) return <ProductPagePlaceHolder />;
    if (error && !product) {
        return (
             <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center bg-white min-h-screen'>
                 <p className="text-red-500">{error}</p>
                 <Link to="/store" className="text-indigo-600 hover:underline mt-4 inline-block">Go back to Store</Link>
             </div>
        );
    }
    if (!product) return <ProductPagePlaceHolder />;

    const productName = product.name;
    const productPrice = parseFloat(product.price).toFixed(2);
    const productDescription = product.description || 'No description available.';

    let imgSrc = 'https://placehold.co/600x700/e0e7ff/3f51b5?text=No+Image';
    if (product.image && typeof product.image === 'string') {
        try {
            if (product.image.startsWith('http')) {
                imgSrc = product.image;
            } else {
                 const cleanedBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
                 const cleanedImagePath = product.image.startsWith('/') ? product.image.slice(1) : product.image;
                 imgSrc = `${cleanedBaseUrl}/${cleanedImagePath}`;
            }
        } catch (e) { console.error('Error creating image URL:', e); }
    }

    return (
        <div className='bg-white'>
            <section className='py-8 md:py-12'>
                <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex flex-col md:flex-row gap-8 md:gap-16 items-start'>
                        {/* Image Section */}
                        <div className='w-full md:w-1/2 bg-gray-100 rounded-xl p-4 md:aspect-square'>
                            <img
                                className='w-full h-full object-contain rounded-lg'
                                src={imgSrc}
                                alt={productName}
                                onError={e => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/600x700/e0e7ff/3f51b5?text=Load+Fail';
                                }}
                            />
                        </div>
                        {/* Details Section */}
                        <div className='w-full md:w-1/2 p-2'>
                            <div className='text-sm text-gray-500 mb-2'>
                                SKU: {product.id || 'N/A'}
                            </div>
                            <h1 className='text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight'>
                                {productName}
                            </h1>
                            <div className='flex items-baseline mb-6'>
                                <span className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600'>
                                    ₹{productPrice}
                                </span>
                            </div>
                            <p className='text-gray-600 leading-relaxed mb-8 text-lg'>
                                {productDescription}
                            </p>
                            <div className='flex flex-wrap gap-4'>
                                <button
                                    onClick={add_item}
                                    className={`flex flex-1 sm:flex-none items-center justify-center px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed ${isAdding ? 'opacity-70 cursor-wait' : ''}`}
                                    type='button'
                                    disabled={inCart || isAdding}
                                >
                                    {isAdding ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Adding...
                                        </>
                                    ) : inCart ? (
                                        <>✓ Added to Cart</>
                                    ) : (
                                        <><FiShoppingCart className='mr-2' /> Add to Cart</>
                                    )}
                                </button>
                            </div>
                            {error && !inCart && <p className="text-red-500 mt-4">{error}</p>}
                        </div>
                    </div>
                </div>
            </section>
            <RelatedProducts products={similarProducts} />
        </div>
    );
};

export default ProductPage;
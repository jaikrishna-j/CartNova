import api from '../api'; 
import axios from 'axios';

function buildProductQueryParams(page, q, category, pageSize) {
    let params = [`page=${page}`];

    if (pageSize) {
        params.push(`page_size=${pageSize}`);
    }
    if (q) {
        params.push(`q=${encodeURIComponent(q)}`);
        // When searching, ignore category filter - search across all products
        // Don't add category parameter when search query exists
    } else if (category && category.toLowerCase() !== 'all') {
        // Only apply category filter when there's no search query
        params.push(`category=${encodeURIComponent(category)}`);
    }

    return `/products/?${params.join('&')}`; 
}


export async function getProductDetail(slug) {
    const url = `/product_detail/${slug}/`;
    
    try {
        const response = await api.get(url);
        return response.data;
    } 
    catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            throw new Error(`Product not found.`);
        }
        console.error("Error in getProductDetail:", error.message);
        throw new Error('Failed to load product details. Please try again later.');
    }
}


export async function getProducts(page = 1, q = '', category = 'all', pageSize = null) {
    const url = buildProductQueryParams(page, q, category, pageSize);

    try {
        const response = await api.get(url);
        return response.data;
    } 
    catch (error) {
        console.error("Error fetching products:", error.message);
        throw new Error('Could not fetch products. Please check your connection and try again.');
    }
}


export async function getCategories() {
    try {
        const response = await api.get('/categories/');
        return response.data; 
    } 
    catch (error) {
        console.error("Error fetching categories:", error.message);
        throw new Error('Could not load categories.');
    }
}
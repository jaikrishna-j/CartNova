import React, { useEffect, useState } from 'react';
import OrderHistoryItemContainer from './OrderHistoryItemContainer';
import UserInfo from './UserInfo';
import api from '@/api';
import Spinner from '../ui/Spinner';

const UserProfilePage = () => {
    const [userInfo, setUserInfo] = useState(null);
    // This state holds the FULL list of all items
    const [orderItems, setOrderItems] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    // --- NEW STATE for pagination ---
    // This tracks the number of items currently visible
    const [visibleCount, setVisibleCount] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch user info and the FULL order history
                const [userInfoRes, ordersRes] = await Promise.all([
                    api.get("user_info"),
                    api.get("order_history/") // This fetches ALL items
                ]);
                setUserInfo(userInfoRes.data);
                setOrderItems(ordersRes.data); // Set the full list
            } catch (err) {
                console.error("Failed to fetch profile data:", err.response ? err.response.data : err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Runs once on component mount

    if (loading && !userInfo) { // Allow showing content if userInfo is loaded but orders are still loading
        return (
             <div className="min-h-screen flex items-center justify-center">
                 <Spinner loading={loading} />
             </div>
        );
    }

    if (!userInfo) {
        return (
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-red-500'>
                Could not load user profile information. Please try refreshing the page.
            </div>
        );
    }

    // --- PAGINATION LOGIC ---
    // Create the list of items to actually display (e.g., first 10, then 20, etc.)
    const itemsToDisplay = orderItems.slice(0, visibleCount);
    // Check if there are more items to load
    const hasMoreItems = visibleCount < orderItems.length;
    // Function to increase the visible count
    const loadMoreItems = () => {
        setVisibleCount(prevCount => prevCount + 10);
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <h1 className='text-4xl font-extrabold text-gray-900 mb-8'>
                My Profile
            </h1>
            <div className='space-y-12'>
                {/* This component is unchanged */}
                <UserInfo userInfo={userInfo} />
                
                {/* Pass the pagination props to the container */}
                <OrderHistoryItemContainer 
                    items={itemsToDisplay} 
                    isLoading={loading}
                    hasMoreItems={hasMoreItems}
                    onLoadMore={loadMoreItems}
                />
            </div>
        </div>
    );
};

export default UserProfilePage;
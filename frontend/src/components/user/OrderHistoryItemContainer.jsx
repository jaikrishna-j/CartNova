import React from 'react';
import OrderHistoryItem from './OrderHistoryItem'; 
import { FiLoader } from 'react-icons/fi';

const OrderHistoryItemContainer = ({ items, isLoading, hasMoreItems, onLoadMore }) => {
  return (
    <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
      <div className='bg-indigo-600 text-white p-4'>
        <h5 className='text-xl font-bold'>Order History</h5>
      </div>
      
      {/* --- THIS CLASS adds the border --- */}
      <div className='max-h-[400px] overflow-y-auto divide-y divide-gray-200'>
        {isLoading && items.length === 0 ? ( 
          <div className="flex justify-center items-center h-40">
            <FiLoader className="text-4xl text-indigo-500 animate-spin" />
            <span className="ml-3 text-gray-500">Loading orders...</span>
          </div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <div className="px-4" key={item.id}> 
              <OrderHistoryItem item={item} />
            </div>
          ))
        ) : !isLoading ? ( 
          <div className="text-center py-10 px-4 text-gray-500">
            You haven't placed any completed orders yet.
          </div>
        ) : null}
      </div>

      {/* --- "SHOW MORE" BUTTON SECTION --- */}
      {hasMoreItems && (
        <div className="border-t border-gray-200 p-4 text-center">
            <button
                onClick={onLoadMore}
                className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-xl hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border-none"
            >
                Show More
            </button>
        </div>
      )}

    </div>
  );
};

export default OrderHistoryItemContainer;
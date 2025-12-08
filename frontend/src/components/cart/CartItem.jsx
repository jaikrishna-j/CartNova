import React, { useState } from 'react';
import toast from 'react-hot-toast'; // UPDATED: Changed from 'react-toastify'
import api from '@/api';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { getProxiedImageUrl } from '@/utils/imageProxy';

const CartItem = ({ item, setCartItems, setCartTotal, setNumberCartItems, cartItems }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const [loading, setLoading] = useState(false);

    const imgSrc = getProxiedImageUrl(item.product?.image) || 'https://placehold.co/400x400/e0e7ff/3f51b5?text=NO+IMAGE';
    
    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
        updateCartItem(newQuantity);
    };

    const deleteCartItem = () => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            api.post("delete_cartitem/", { item_id: item.id })
                .then(() => {
                    toast.success("Item removed"); // This will now use react-hot-toast
                    const updatedItems = cartItems.filter(ci => ci.id !== item.id);
                    setCartItems(updatedItems);
                    const newTotal = updatedItems.reduce((acc, curr) => acc + curr.total, 0);
                    const newNumItems = updatedItems.reduce((acc, curr) => acc + curr.quantity, 0);
                    setCartTotal(newTotal);
                    // Update cart count in navbar
                    if (setNumberCartItems) {
                        setNumberCartItems(newNumItems);
                    }
                })
                .catch(err => toast.error("Failed to remove item.")); // This will now use react-hot-toast
        }
    };

    const updateCartItem = (currentQuantity) => {
        if (currentQuantity < 1) {
            deleteCartItem();
            return;
        }
        setLoading(true);
        api.patch("update_quantity/", { quantity: currentQuantity, item_id: item.id })
            .then(res => {
                const updatedItems = cartItems.map(ci => ci.id === item.id ? res.data.data : ci);
                setCartItems(updatedItems);
                    const newTotal = updatedItems.reduce((acc, curr) => acc + curr.total, 0);
                    const newNumItems = updatedItems.reduce((acc, curr) => acc + curr.quantity, 0);
                    setCartTotal(newTotal);
                    if (setNumberCartItems) {
                        setNumberCartItems(newNumItems);
                    }
                    // Dispatch custom event to update cart count globally
                    window.dispatchEvent(new CustomEvent('cartUpdated'));
            })
            .catch(err => toast.error("Failed to update cart.")) // This will now use react-hot-toast
            .finally(() => setLoading(false));
    };

    return (
        <div className='py-4 sm:py-6'>
            <div className='hidden lg:grid grid-cols-12 gap-6 items-center'>
                <div className="col-span-6 flex items-center gap-4">
                    <img src={imgSrc} alt={item.product.name} className='w-20 h-20 object-contain rounded-md flex-shrink-0 bg-gray-100 p-1' />
                    {/* 1. Added 'min-w-0' to allow this flex item to shrink and its content to wrap. */}
                    <div className="min-w-0">
                        {/* 2. Removed 'truncate' so the text can wrap to the next line. */}
                        <h3 className='font-semibold text-gray-800 text-base'>
                            {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Price: ₹{parseFloat(item.product.price).toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="col-span-2 flex justify-center items-center">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button onClick={() => handleQuantityChange(quantity - 1)} className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-l-lg disabled:opacity-50 transition" disabled={loading}>
                            <FiMinus className="text-lg" />
                        </button>
                        <span className="px-4 py-2 text-center font-medium w-16 border-x border-gray-300">
                            {loading ? <ClipLoader size={16} color={"#4f46e5"} /> : quantity}
                        </span>
                        <button onClick={() => handleQuantityChange(quantity + 1)} className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-r-lg disabled:opacity-50 transition" disabled={loading}>
                            <FiPlus className="text-lg" />
                        </button>
                    </div>
                </div>
            
                <div className="col-span-2 text-right font-bold text-gray-900 text-lg">
                    ₹{parseFloat(item.total).toFixed(2)}
                </div>
            
                <div className="col-span-2 flex justify-end">
                    <button 
                        onClick={deleteCartItem} 
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors"
                        title="Remove item"
                    >
                        <FiTrash2 />
                        <span>Remove</span>
                    </button>
                </div>
            </div>

            {/* --- MOBILE LAYOUT --- */}
            <div className='flex flex-col lg:hidden gap-3 sm:gap-4'>
                <div className="flex items-center gap-3 sm:gap-4">
                    <img src={imgSrc} alt={item.product.name} className='w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-md flex-shrink-0 bg-gray-100 p-1' />
                    <div className="flex-grow min-w-0">
                        <h3 className='font-semibold text-gray-800 text-sm sm:text-base leading-tight'>
                            {item.product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Price: ₹{parseFloat(item.product.price).toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600 text-sm">Quantity</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button onClick={() => handleQuantityChange(quantity - 1)} className="px-2 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-l-lg disabled:opacity-50 transition text-sm" disabled={loading}>
                            <FiMinus className="text-base" />
                        </button>
                        <span className="px-3 py-1.5 text-center font-medium w-12 border-x border-gray-300 text-sm">
                            {loading ? <ClipLoader size={14} color={"#4f46e5"} /> : quantity}
                        </span>
                        <button onClick={() => handleQuantityChange(quantity + 1)} className="px-2 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-r-lg disabled:opacity-50 transition text-sm" disabled={loading}>
                            <FiPlus className="text-base" />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-3">
                    <span className="font-bold text-gray-600 text-sm sm:text-base">Total</span>
                    <span className="font-bold text-gray-900 text-base sm:text-lg">₹{parseFloat(item.total).toFixed(2)}</span>
                </div>

                <div className="mt-2">
                    <button 
                        onClick={deleteCartItem} 
                        className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 bg-red-50 text-red-600 text-xs sm:text-sm font-semibold rounded-lg border border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors"
                        title="Remove item"
                    >
                        <FiTrash2 className="text-sm sm:text-base" />
                        <span>Remove from Cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
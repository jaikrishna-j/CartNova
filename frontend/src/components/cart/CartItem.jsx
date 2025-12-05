import React, { useState } from 'react';
import toast from 'react-hot-toast'; // UPDATED: Changed from 'react-toastify'
import api, { BASE_URL } from '@/api';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';

const CartItem = ({ item, setCartItems, setCartTotal, setNumberCartItems, cartItems }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const [loading, setLoading] = useState(false);

    let imgSrc = 'https://placehold.co/400x400/e0e7ff/3f51b5?text=NO+IMAGE';
    if (item.product?.image) {
        if (item.product.image.startsWith('http')) {
            imgSrc = item.product.image;
        } 
        else {
            try { imgSrc = new URL(item.product.image, BASE_URL).href; }
            catch (e) { console.error("Error creating image URL:", e); }
        }
    }
    
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
                    setNumberCartItems(newNumItems);
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
                setNumberCartItems(newNumItems);
            })
            .catch(err => toast.error("Failed to update cart.")) // This will now use react-hot-toast
            .finally(() => setLoading(false));
    };

    return (
        <div className='py-6'>
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
                    <div className="flex items-center border rounded-lg">
                        <button onClick={() => handleQuantityChange(quantity - 1)} className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-l-lg disabled:opacity-50 transition" disabled={loading}>
                            <FiMinus />
                        </button>
                        <span className="px-4 py-1.5 text-center font-medium w-16 border-x">
                            {loading ? <ClipLoader size={18} color={"#4f46e5"} /> : quantity}
                        </span>
                        <button onClick={() => handleQuantityChange(quantity + 1)} className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-r-lg disabled:opacity-50 transition" disabled={loading}>
                            <FiPlus />
                        </button>
                    </div>
                </div>
            
                <div className="col-span-2 text-right font-bold text-gray-900 text-lg">
                    ₹{parseFloat(item.total).toFixed(2)}
                </div>
            
                <div className="col-span-2 flex justify-end">
                    <button 
                        onClick={deleteCartItem} 
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-md border border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors"
                        title="Remove item"
                    >
                        <FiTrash2 />
                        <span>Remove</span>
                    </button>
                </div>
            </div>

            {/* --- MOBILE LAYOUT --- */}
            <div className='flex flex-col lg:hidden gap-4'>
                <div className="flex items-center gap-4">
                    <img src={imgSrc} alt={item.product.name} className='w-20 h-20 object-contain rounded-md flex-shrink-0 bg-gray-100 p-1' />
                    {/* --- THIS IS THE FIX --- */}
                    <div className="flex-grow min-w-0">
                        <h3 className='font-semibold text-gray-800 text-base'>
                            {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Price: ₹{parseFloat(item.product.price).toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Quantity</span>
                    <div className="flex items-center border rounded-lg">
                        <button onClick={() => handleQuantityChange(quantity - 1)} className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-l-lg disabled:opacity-50 transition" disabled={loading}>
                            <FiMinus />
                        </button>
                        <span className="px-4 py-1.5 text-center font-medium w-16 border-x">
                            {loading ? <ClipLoader size={18} color={"#4f46e5"} /> : quantity}
                        </span>
                        <button onClick={() => handleQuantityChange(quantity + 1)} className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-r-lg disabled:opacity-50 transition" disabled={loading}>
                            <FiPlus />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center border-t pt-4 mt-4">
                    <span className="font-bold text-gray-600">Total</span>
                    <span className="font-bold text-gray-900 text-lg">₹{parseFloat(item.total).toFixed(2)}</span>
                </div>

                <div className="mt-2">
                    <button 
                        onClick={deleteCartItem} 
                        className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors"
                        title="Remove item"
                    >
                        <FiTrash2 />
                        <span>Remove from Cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
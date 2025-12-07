import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import api from '../../api'
import Spinner from '../ui/Spinner'
import { FiShoppingBag } from 'react-icons/fi'
import useCartData from '@/hooks/useCartData'

const CartPage = ({ setNumberCartItems }) => {
  const {cartItems, setCartItems, cartTotal, setCartTotal, loading, tax} = useCartData()

  const numItems = cartItems.reduce((acc, curr) => acc + curr.quantity, 0)

  // Show loading state
  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[calc(100vh-8rem)]'>
        <Spinner loading={loading} />
      </div>
    )
  }

  // Show empty cart message if no items
  if (!cartItems || cartItems.length < 1) {
    return (
      <div className='min-h-[calc(100vh-8rem)] flex items-center justify-center bg-white'>
        <div className='text-center p-8'>
          <FiShoppingBag className='mx-auto text-6xl text-gray-300 mb-4' />
          <h2 className='text-3xl font-bold text-gray-800 mb-3'>
            Your Cart is Empty
          </h2>
          <p className='text-gray-500 mb-8'>
            Looks like you haven't added anything yet.
          </p>
          <Link
            to='/store'
            className='inline-block bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105'
          >
            Explore Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12'>
        <div className='mb-6 sm:mb-8'>
          <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900'>
            Your Cart
          </h1>
          <p className='mt-2 text-xs sm:text-sm md:text-base text-gray-500'>
            You have {numItems} item{numItems !== 1 && 's'} in your cart.
          </p>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start'>
          <div className='lg:col-span-8'>
            <div className='divide-y divide-gray-200'>
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  setCartItems={setCartItems}
                  setCartTotal={setCartTotal}
                  setNumberCartItems={setNumberCartItems}
                  cartItems={cartItems}
                />
              ))}
            </div>
          </div>
          <div className='lg:col-span-4 mt-6 lg:mt-0'>
            <CartSummary cartTotal={cartTotal} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage

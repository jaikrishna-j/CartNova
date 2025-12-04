import { useState, useEffect } from 'react'
import api from '../api'

function useCartData () {
  const cart_code = localStorage.getItem('cart_code')
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0.0)
  const tax = 4.0
  const [loading, setLoading] = useState(false)

  useEffect(function () {
    setLoading(true)
    api.get(`get_cart?cart_code=${cart_code}`)
    .then(res => {
        console.log(res.data)
        setLoading(false)
        setCartItems(res.data.items)
        setCartTotal(res.data.sum_total)
    })
    .catch(err => {
        console.error('Failed to fetch cart:', err.message)
        setLoading(false)
    })
  }, [cart_code])

  return {cartItems, setCartItems, cartTotal, setCartTotal, loading, tax}
}

export default useCartData

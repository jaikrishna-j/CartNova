import { useState, useEffect } from 'react'
import api from '../api'

function useCartData () {
  const cart_code = localStorage.getItem('cart_code')
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0.0)
  const tax = 4.0
  const [loading, setLoading] = useState(false)

  useEffect(function () {
    // Only fetch if we have a cart_code
    if (!cart_code) {
      setCartItems([])
      setCartTotal(0.0)
      setLoading(false)
      return
    }

    setLoading(true)
    api.get(`get_cart?cart_code=${cart_code}`)
    .then(res => {
        console.log(res.data)
        setLoading(false)
        // Ensure we only set items if they exist and are valid
        const items = res.data.items || []
        setCartItems(items)
        setCartTotal(res.data.sum_total || 0.0)
    })
    .catch(err => {
        console.error('Failed to fetch cart:', err.message)
        setLoading(false)
        setCartItems([])
        setCartTotal(0.0)
    })
  }, [cart_code])

  return {cartItems, setCartItems, cartTotal, setCartTotal, loading, tax}
}

export default useCartData

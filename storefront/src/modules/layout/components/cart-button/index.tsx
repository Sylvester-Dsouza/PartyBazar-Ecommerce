"use client"

import { useEffect, useState } from "react"
import { retrieveCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartDropdown from "../cart-dropdown"

export default function CartButton() {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await retrieveCart()
        setCart(cartData)
      } catch (error) {
        console.error("Failed to load cart:", error)
        setCart(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-grey-70 text-white relative">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 18.333a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666zM16.667 18.333a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666zM.833 1.667h2.5L5.4 11.992a1.667 1.667 0 0 0 1.667 1.341h8.1a1.667 1.667 0 0 0 1.666-1.341l1.334-7H4.167" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    )
  }

  return <CartDropdown cart={cart} />
}

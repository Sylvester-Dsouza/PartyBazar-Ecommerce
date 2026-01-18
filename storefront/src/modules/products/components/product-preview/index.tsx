"use client"

import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Button from "@modules/common/components/button"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { addToCart } from "@lib/data/cart"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const [isAdding, setIsAdding] = useState(false)
  const params = useParams()
  const router = useRouter()
  const countryCode = params.countryCode as string

  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Check if product is new
  const isNew = product.created_at
    ? new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    : false

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAdding) return

    // If only 1 variant, add to cart
    if (product.variants && product.variants.length === 1) {
      const variant = product.variants[0]
      setIsAdding(true)
      try {
        await addToCart({
          variantId: variant.id,
          quantity: 1,
          countryCode,
        })
        // Optional: Show toast
      } catch (err) {
        console.error(err)
      } finally {
        setIsAdding(false)
      }
    } else {
      // Multiple variants -> Go to product page
      router.push(`/${countryCode}/products/${product.handle}`)
    }
  }

  return (
    <div className="group relative bg-white rounded-xl border border-grey-20 hover:border-grey-30 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* ... (Keep Badges and Heart) ... */}

      {/* (New Badge) */}
      {isNew && (
        <span className="absolute top-3 left-3 z-10 bg-party-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          New
        </span>
      )}

      {/* Wishlist Heart */}
      <button
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-grey-40 hover:text-party-pink-500 transition-colors">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Product Image */}
      <LocalizedClientLink href={`/products/${product.handle}`} className="block">
        <div className="aspect-square bg-grey-5 border-b border-grey-20">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="rounded-none shadow-none"
          />
        </div>
      </LocalizedClientLink>

      {/* Product Info */}
      <div className="p-4 bg-[#FFFDFA]">
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <Text className="text-party-dark font-medium text-sm line-clamp-2 min-h-[40px]" data-testid="product-title">
            {product.title}
          </Text>
        </LocalizedClientLink>

        <div className="mt-2 mb-3">
          {cheapestPrice && (
            <span className="text-party-dark font-semibold text-base">
              <PreviewPrice price={cheapestPrice} />
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="outline"
          size="sm"
          fullWidth
          className="uppercase tracking-wide"
          onClick={handleAddToCart}
          disabled={isAdding}
          isLoading={isAdding}
        >
          {product.variants?.length === 1 ? (isAdding ? "Adding..." : "Add to Cart") : "Select Options"}
        </Button>
      </div>
    </div>
  )
}

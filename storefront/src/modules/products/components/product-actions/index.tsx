"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"
import { Gift, Minus, Plus, Package, Shield, Truck, ShieldCheck } from "lucide-react"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
  region,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // Get price for display
  const price = selectedVariant?.calculated_price?.calculated_amount || 0
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: region.currency_code || 'INR',
  }).format(price)

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: quantity,
      countryCode,
    })

    setIsAdding(false)
  }

  // buy now functionality
  const handleBuyNow = async () => {
    if (!selectedVariant?.id) return

    setIsAdding(true)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: quantity,
        countryCode,
      })

      router.push(`/${countryCode}/checkout`)
    } catch (e) {
      console.error(e)
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4 mb-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        {/* Quantity & Add to Cart */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3 relative" id="add-to-cart-section">
            {/* Quantity Selector */}
            <div className="flex items-center bg-white rounded-full px-1 py-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
                disabled={isAdding}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 sm:w-10 text-center font-semibold text-base">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-party-sky-300 hover:bg-party-sky-200 text-white flex items-center justify-center transition-colors"
                disabled={isAdding}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button with Price */}
            <button
              onClick={handleAddToCart}
              disabled={
                !inStock ||
                !selectedVariant ||
                !!disabled ||
                isAdding ||
                !isValidVariant
              }
              className="flex-1 bg-party-sky-200 text-gray-900 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-xl shadow-party-sky-200/30 hover:shadow-2xl hover:shadow-party-sky-200/40 hover:bg-party-sky-300 transition-all duration-300 hover:scale-[1.02] transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
              {!selectedVariant && !options
                ? "Select variant"
                : !inStock || !isValidVariant
                  ? "Out of stock"
                  : `Add to Cart — ${formattedPrice}`}
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              isAdding ||
              !isValidVariant
            }
            className="w-full bg-gray-900 text-white py-4 rounded-full font-bold text-base hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? "Processing..." : "Celebrate Now — Express Shipping"}
          </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-4 gap-1 sm:gap-3 mb-6">
          <div className="flex flex-col items-center text-center group">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1.5 group-hover:bg-blue-200 transition-colors">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
            <span className="text-[9px] sm:text-[11px] font-semibold text-gray-900 leading-tight">Express</span>
            <span className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Shipping</span>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-1.5 group-hover:bg-pink-200 transition-colors">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
            </div>
            <span className="text-[9px] sm:text-[11px] font-semibold text-gray-900 leading-tight">Quality</span>
            <span className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Guarantee</span>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1.5 group-hover:bg-blue-200 transition-colors">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
            <span className="text-[9px] sm:text-[11px] font-semibold text-gray-900 leading-tight">COD</span>
            <span className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Available</span>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-1.5 group-hover:bg-pink-200 transition-colors">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
            </div>
            <span className="text-[9px] sm:text-[11px] font-semibold text-gray-900 leading-tight">Secure</span>
            <span className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Payments</span>
          </div>
        </div>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}

"use client"

import { useEffect, useState } from "react"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"

const OnSale = ({ countryCode }: { countryCode: string }) => {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const { response } = await listProducts({
          countryCode,
          queryParams: {
            limit: 5,
            // Filter products that are on sale - you can adjust this based on your product data structure
            // This assumes you have a way to mark products as on sale (e.g., through tags or metadata)
          }
        })

        // For now, we'll take the first 5 products and simulate sale pricing
        // In a real implementation, you'd filter for products that actually have sale prices
        setProducts(response.products.slice(0, 5))
      } catch (error) {
        console.error("Failed to fetch sale products:", error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    if (countryCode) {
      fetchSaleProducts()
    }
  }, [countryCode])

  const calculateSalePrice = (product: HttpTypes.StoreProduct) => {
    // Get the first variant's price
    const variant = product.variants?.[0]
    if (!variant?.calculated_price) return { original: 0, sale: 0, discount: 0, currency: "USD" }

    const original = variant.calculated_price.calculated_amount || 0
    // Simulate a 20-40% discount
    const discountPercent = 0.2 + Math.random() * 0.2
    const sale = original * (1 - discountPercent)

    return {
      original,
      sale,
      discount: Math.round(discountPercent * 100),
      currency: variant.calculated_price.currency_code || "USD"
    }
  }

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="content-container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="party-heading-md">On Sale</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-grey-5 rounded-2xl p-4 aspect-square"></div>
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-grey-5 rounded w-3/4"></div>
                  <div className="h-4 bg-grey-5 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-12">
        <div className="content-container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="party-heading-md">On Sale</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-grey-50">No sale products available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="content-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="party-heading-md">On Sale</h2>
          <LocalizedClientLink href="/collections/sale" className="inline-flex items-center gap-2 px-4 py-2 border border-party-dark text-party-dark font-medium rounded-full hover:bg-party-dark hover:text-white transition-colors">
            <span>View All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => {
            const pricing = calculateSalePrice(product)
            const thumbnail = product.thumbnail || product.images?.[0]?.url

            return (
              <LocalizedClientLink
                key={product.id}
                href={`/products/${product.handle}`}
                className="group"
              >
                <div className="bg-grey-5 rounded-2xl p-4 aspect-square flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-shadow">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl text-grey-40">🎉</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{pricing.discount}%
                  </span>
                </div>
                <div className="mt-3">
                  <Text className="font-medium text-grey-80 text-sm line-clamp-1">{product.title}</Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Text className="text-party-pink-500 font-bold">
                      {convertToLocale({
                        amount: pricing.sale,
                        currency_code: pricing.currency
                      })}
                    </Text>
                    <Text className="text-grey-40 text-sm line-through">
                      {convertToLocale({
                        amount: pricing.original,
                        currency_code: pricing.currency
                      })}
                    </Text>
                  </div>
                </div>
              </LocalizedClientLink>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default OnSale

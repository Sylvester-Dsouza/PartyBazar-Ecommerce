"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import PreviewPrice from "@modules/products/components/product-preview/price"
import { Text, clx } from "@medusajs/ui"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  countryCode: string
}

export default function SearchModal({ isOpen, onClose, countryCode }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<HttpTypes.StoreProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
      const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
      const response = await fetch(
        `${backendUrl}/store/products?q=${encodeURIComponent(searchQuery)}&limit=10&fields=*variants.calculated_price`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": publishableKey || "",
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setResults(data.products || [])
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query) {
        searchProducts(query)
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [query, searchProducts])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
      setQuery("")
      setResults([])
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleProductClick = (handle: string) => {
    onClose()
    router.push(`/${countryCode}/products/${handle}`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-0 md:pt-20">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full h-full md:h-auto md:max-w-2xl bg-white md:rounded-xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-top">
        {/* Search Header */}
        <div className="flex items-center gap-4 p-4 md:p-6 border-b border-grey-10 shrink-0">
          <div className="relative flex-1">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-0 top-1/2 -translate-y-1/2 text-grey-40"
            >
              <path
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 py-2 text-lg text-party-dark placeholder:text-grey-40 outline-none font-medium"
              autoFocus
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-grey-40 hover:text-party-dark transition-colors rounded-full hover:bg-grey-5"
            aria-label="Close search"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto bg-grey-5/30 md:max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-party-pink-500 border-t-transparent" />
            </div>
          ) : query && results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <p className="text-lg font-medium text-party-dark mb-2">No results found</p>
              <p className="text-grey-50">We couldn't find anything matching "{query}"</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-grey-10">
              {results.map((product) => {
                const { cheapestPrice } = getProductPrice({ product })

                return (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.handle!)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white transition-colors text-left group"
                  >
                    <div className="relative w-16 h-16 shrink-0 bg-grey-5 rounded-lg overflow-hidden border border-grey-10">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-grey-40">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-party-dark truncate group-hover:text-party-pink-600 transition-colors">
                        {product.title}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-grey-50 truncate mt-0.5">
                          {product.description}
                        </p>
                      )}

                      <div className="mt-1 flex items-center gap-2">
                        {cheapestPrice && (
                          <div className="flex items-center text-sm font-semibold">
                            <PreviewPrice price={cheapestPrice} />
                          </div>
                        )}
                      </div>
                    </div>

                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-grey-30 -ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    >
                      <path
                        d="M7.5 15l5-5-5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4 opacity-60">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-grey-30 mb-4"
              >
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-lg font-medium text-party-dark mb-1">Search the store</p>
              <p className="text-grey-50">Type to see products...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

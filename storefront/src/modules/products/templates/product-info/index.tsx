import { HttpTypes } from "@medusajs/types"
import { Star, Award } from "lucide-react"
import { getProductPrice } from "@lib/util/get-product-price"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  selectedVariant?: HttpTypes.StoreProductVariant
}

const ProductInfo = ({ product, selectedVariant }: ProductInfoProps) => {
  // Mock rating data - you can replace with actual data from product metadata
  const rating = (product.metadata?.rating as number) || 4.8
  const reviewCount = (product.metadata?.review_count as number) || 127

  // Extract metadata fields
  const color = product.metadata?.color as string
  const size = product.metadata?.size as string
  const material = product.material || (product.metadata?.material as string)
  const gas = product.metadata?.gas as string
  const originCountry = product.metadata?.country_of_origin as string
  const gasCost = product.metadata?.gas_cost as string

  // Get price
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: selectedVariant?.id,
  })

  const selectedPrice = selectedVariant ? variantPrice : cheapestPrice

  // Calculate discount percentage if there's a price difference
  const discountPercentage = selectedPrice && selectedPrice.original_price_number > selectedPrice.calculated_price_number
    ? Math.round(((selectedPrice.original_price_number - selectedPrice.calculated_price_number) / selectedPrice.original_price_number) * 100)
    : 0

  return (
    <div id="product-info">
      {/* SKU & Trust Badge */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{selectedVariant?.sku || product.variants?.[0]?.sku || product.handle?.toUpperCase()}</p>
        <div className="flex items-center gap-1 px-2.5 py-1 bg-party-sky-200/20 rounded-full">
          <Award className="w-3.5 h-3.5 text-party-pink-500" />
          <span className="text-xs font-semibold text-party-pink-500">Best Seller</span>
        </div>
      </div>

      {/* Product Title */}
      <h1 className="text-2xl sm:text-xl lg:text-2xl font-bold text-party-pink-500 leading-tight mb-3">
        {product.title}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${star <= Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200'
                }`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-gray-900">{rating}</span>
        <span className="text-sm text-gray-500">({reviewCount} happy customers)</span>
      </div>

      {/* Price Section - After Rating */}
      {selectedPrice && (
        <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {/* Only show "From" if product has multiple variants and no specific variant is selected */}
              {!selectedVariant && product.variants && product.variants.length > 1 && "From "}
              {selectedPrice.calculated_price}
            </span>

            {/* Show discount if original price is higher than calculated price */}
            {selectedPrice.original_price_number > selectedPrice.calculated_price_number && (
              <>
                <span className="text-base text-gray-400 line-through">
                  {selectedPrice.original_price}
                </span>
                <span className="px-2 py-0.5 bg-party-pink-400 text-white text-xs font-bold rounded-full">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Product Attributes Grid - Matching the reference image */}
      <div className="pb-4 mb-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {/* Color */}
          {color && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Color</h4>
              <p className="text-sm font-normal text-party-pink-400">{color}</p>
            </div>
          )}

          {/* Size */}
          {size && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Size</h4>
              <p className="text-sm font-normal text-gray-500">{size}</p>
            </div>
          )}

          {/* Material */}
          {material && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Material</h4>
              <p className="text-sm font-normal text-gray-500">{material}</p>
            </div>
          )}

          {/* Gas */}
          {gas && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Gas</h4>
              <p className="text-sm font-normal text-gray-500">{gas}</p>
            </div>
          )}

          {/* Country of Origin */}
          {originCountry && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Country of Origin</h4>
              <p className="text-sm font-normal text-gray-500">{originCountry}</p>
            </div>
          )}

          {/* Gas Cost */}
          {gasCost && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Gas Cost</h4>
              <p className="text-sm font-normal text-gray-500">{gasCost}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductInfo

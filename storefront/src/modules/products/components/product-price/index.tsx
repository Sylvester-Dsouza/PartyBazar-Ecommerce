import { clx } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
  region,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  region?: HttpTypes.StoreRegion
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  // Calculate discount percentage if on sale
  const discountPercentage = selectedPrice.price_type === "sale"
    ? Math.round(((selectedPrice.original_price_number - selectedPrice.calculated_price_number) / selectedPrice.original_price_number) * 100)
    : 0

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-2xl font-bold text-gray-900"
        data-testid="product-price"
        data-value={selectedPrice.calculated_price_number}
      >
        {!variant && "From "}
        {selectedPrice.calculated_price}
      </span>

      {selectedPrice.price_type === "sale" && (
        <>
          <span
            className="text-base text-gray-400 line-through"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
          <span className="px-2 py-0.5 bg-party-pink-400 text-white text-xs font-bold rounded-full">
            {discountPercentage}% OFF
          </span>
        </>
      )}
    </div>
  )
}

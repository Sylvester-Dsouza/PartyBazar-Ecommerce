import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  // Check if there's a discount (original price is higher than calculated price)
  const hasDiscount = price.original_price_number > price.calculated_price_number

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Sale/Calculated Price - Main price */}
      <Text
        className={clx("font-semibold text-base", {
          "text-party-pink-500": hasDiscount, // Pink if on sale
          "text-party-dark": !hasDiscount, // Dark if regular price
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>

      {/* Original Price (MRP) - Show with strikethrough if there's a discount */}
      {hasDiscount && (
        <>
          <Text
            className="line-through text-gray-400 text-sm"
            data-testid="original-price"
          >
            {price.original_price}
          </Text>
          {price.percentage_diff && (
            <span className="px-2 py-0.5 bg-party-pink-500 text-white text-xs font-bold rounded-full">
              {price.percentage_diff}% OFF
            </span>
          )}
        </>
      )}
    </div>
  )
}

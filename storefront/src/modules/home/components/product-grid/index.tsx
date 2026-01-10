import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import Thumbnail from "@modules/products/components/thumbnail"
import { convertToLocale } from "@lib/util/money"

const ProductGrid = async ({ 
  title = "Featured Products",
  countryCode 
}: { 
  title?: string
  countryCode: string
}) => {
  const region = await getRegion(countryCode)
  
  if (!region) {
    return null
  }

  const { response } = await listProducts({
    queryParams: { limit: 8 },
    countryCode,
  })

  const products = response.products

  return (
    <section className="py-12">
      <div className="content-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="party-heading-md">{title}</h2>
          <LocalizedClientLink href="/store" className="text-party-pink-500 font-medium hover:text-party-pink-600 transition-colors">
            View All →
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const price = product.variants?.[0]?.calculated_price
            
            return (
              <LocalizedClientLink
                key={product.id}
                href={`/products/${product.handle}`}
                className="group"
              >
                <div className="bg-grey-5 rounded-2xl overflow-hidden aspect-square flex items-center justify-center group-hover:shadow-lg transition-all duration-200">
                  <Thumbnail
                    thumbnail={product.thumbnail}
                    images={product.images}
                    size="square"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  <Text className="font-medium text-grey-80 line-clamp-2">{product.title}</Text>
                  {price && price.calculated_amount && (
                    <Text className="text-party-pink-500 font-bold mt-1">
                      {convertToLocale({
                        amount: price.calculated_amount,
                        currency_code: region.currency_code,
                      })}
                    </Text>
                  )}
                </div>
              </LocalizedClientLink>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ProductGrid

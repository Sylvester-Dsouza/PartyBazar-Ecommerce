import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"

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
    queryParams: {
      limit: 8,
      fields: "*variants.calculated_price",
    },
    countryCode,
  })

  const products = response.products

  return (
    <section className="py-12">
      <div className="content-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="party-heading-md">{title}</h2>
          <LocalizedClientLink href="/store" className="inline-flex items-center gap-2 px-4 py-2 border border-party-dark text-party-dark font-medium rounded-full hover:bg-party-dark hover:text-white transition-colors">
            <span>View All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </LocalizedClientLink>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ProductGrid

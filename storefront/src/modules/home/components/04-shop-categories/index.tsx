import { ChevronLeft, ChevronRight } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCategories } from "@lib/data/categories"

const ShopCategories = async () => {
  // Fetch all categories
  const categories = await listCategories({ limit: 20 })

  // Filter categories that have images in metadata
  const categoriesWithImages = categories.filter(
    (category) => category.metadata?.image_url
  )

  if (categoriesWithImages.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="content-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="party-heading-md">Shop by Category</h2>
            <p className="text-grey-50 mt-1">Browse our curated party collections</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-grey-20 flex items-center justify-center hover:bg-grey-5 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border border-grey-20 flex items-center justify-center hover:bg-grey-5 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {categoriesWithImages.map((category) => {
            const imageUrl = category.metadata?.image_url as string
            
            return (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${category.handle}`}
                className="flex-shrink-0 group"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-grey-5 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-3 text-center font-medium text-grey-70 group-hover:text-party-pink-500 transition-colors max-w-[160px]">
                  {category.name}
                </p>
              </LocalizedClientLink>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ShopCategories

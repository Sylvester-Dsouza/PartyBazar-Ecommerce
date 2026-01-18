import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listProducts } from "@lib/data/products"
import { Suspense } from "react"

type CoordinatedProductsProps = {
    product: HttpTypes.StoreProduct
    countryCode: string
}

async function CoordinatedProductsContent({ product, countryCode }: CoordinatedProductsProps) {
    let relatedProducts: HttpTypes.StoreProduct[] = []

    // Try to get products from the same category first
    if (product.categories && product.categories.length > 0) {
        const categoryId = product.categories[0].id

        const { response } = await listProducts({
            countryCode,
            queryParams: {
                category_id: [categoryId],
                limit: 9,
                fields: "id,title,thumbnail,handle",
            },
        })

        // Filter out the current product
        relatedProducts = response.products?.filter((p) => p.id !== product.id) || []
    }

    // If no products from category, get any products
    if (relatedProducts.length === 0) {
        const { response } = await listProducts({
            countryCode,
            queryParams: {
                limit: 9,
                fields: "id,title,thumbnail,handle",
            },
        })

        // Filter out the current product
        relatedProducts = response.products?.filter((p) => p.id !== product.id) || []
    }

    // Limit to 8 products
    relatedProducts = relatedProducts.slice(0, 8)

    if (relatedProducts.length === 0) {
        return null
    }

    return (
        <div className="mb-6">
            <h4 className="text-sm sm:text-[15px] font-semibold text-gray-900 mb-3 sm:mb-4">
                Coordinated:
            </h4>
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {relatedProducts.map((prod) => (
                    <LocalizedClientLink
                        key={prod.id}
                        href={`/products/${prod.handle}`}
                        className="w-full aspect-square rounded-full border-[3px] border-party-sky-200 bg-white overflow-hidden hover:scale-105 transition-transform cursor-pointer p-2 sm:p-3"
                    >
                        {prod.thumbnail && (
                            <Image
                                src={prod.thumbnail}
                                alt={prod.title || "Product"}
                                width={100}
                                height={100}
                                className="w-full h-full object-contain"
                            />
                        )}
                    </LocalizedClientLink>
                ))}
            </div>
        </div>
    )
}

const CoordinatedProducts = ({ product, countryCode }: CoordinatedProductsProps) => {
    return (
        <Suspense fallback={null}>
            <CoordinatedProductsContent product={product} countryCode={countryCode} />
        </Suspense>
    )
}

export default CoordinatedProducts

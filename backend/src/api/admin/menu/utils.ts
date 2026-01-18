import { Modules } from "@medusajs/framework/utils"

/**
 * Generate URL based on link type and entity
 */
export async function generateUrl(
    linkType: string,
    linkId: string | null | undefined,
    customUrl: string | undefined,
    container: any
): Promise<string> {
    switch (linkType) {
        case "home":
            return "/"
        case "store":
            return "/store"
        case "collection":
            if (linkId) {
                const productService = container.resolve(Modules.PRODUCT)
                const collection = await productService.retrieveProductCollection(linkId)
                return `/collections/${collection.handle}`
            }
            return "/store"
        case "category":
            if (linkId) {
                const productService = container.resolve(Modules.PRODUCT)
                const category = await productService.retrieveProductCategory(linkId)
                return `/categories/${category.handle}`
            }
            return "/store"
        case "product":
            if (linkId) {
                const productService = container.resolve(Modules.PRODUCT)
                const product = await productService.retrieveProduct(linkId)
                return `/products/${product.handle}`
            }
            return "/store"
        case "page":
            // Pages are custom routes - use link_id as the path
            return linkId ? `/${linkId}` : "/"
        case "custom":
        default:
            return customUrl || "/"
    }
}

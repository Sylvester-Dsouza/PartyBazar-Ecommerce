import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

/**
 * GET /admin/menu/entities
 * Get available entities for menu linking (collections, categories, products)
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService = req.scope.resolve(Modules.PRODUCT) as any
    const { type, q } = req.query as { type?: string; q?: string }

    try {
        switch (type) {
            case "collection": {
                const collections = await productService.listProductCollections(
                    {},
                    { take: 50, select: ["id", "title", "handle"] }
                )
                // Filter in memory for search
                const filtered = q
                    ? collections.filter((c: any) =>
                        c.title?.toLowerCase().includes(q.toLowerCase())
                    )
                    : collections
                return res.json({
                    entities: filtered.slice(0, 20).map((c: any) => ({
                        id: c.id,
                        label: c.title,
                        handle: c.handle,
                    })),
                })
            }

            case "category": {
                const categories = await productService.listProductCategories(
                    {},
                    { take: 50, select: ["id", "name", "handle"] }
                )
                const filtered = q
                    ? categories.filter((c: any) =>
                        c.name?.toLowerCase().includes(q.toLowerCase())
                    )
                    : categories
                return res.json({
                    entities: filtered.slice(0, 20).map((c: any) => ({
                        id: c.id,
                        label: c.name,
                        handle: c.handle,
                    })),
                })
            }

            case "product": {
                const products = await productService.listProducts(
                    {},
                    { take: 50, select: ["id", "title", "handle"] }
                )
                const filtered = q
                    ? products.filter((p: any) =>
                        p.title?.toLowerCase().includes(q.toLowerCase())
                    )
                    : products
                return res.json({
                    entities: filtered.slice(0, 20).map((p: any) => ({
                        id: p.id,
                        label: p.title,
                        handle: p.handle,
                    })),
                })
            }

            default:
                // Return all types summary
                return res.json({
                    types: [
                        { value: "custom", label: "Custom URL" },
                        { value: "home", label: "Home Page" },
                        { value: "store", label: "Store Page" },
                        { value: "collection", label: "Collection" },
                        { value: "category", label: "Category" },
                        { value: "product", label: "Product" },
                        { value: "page", label: "Page" },
                    ],
                })
        }
    } catch (error) {
        console.error("Error fetching entities:", error)
        return res.json({ entities: [] })
    }
}

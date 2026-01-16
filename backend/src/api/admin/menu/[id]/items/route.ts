import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { Modules } from "@medusajs/framework/utils"
import { MENU_MODULE } from "../../../../../modules/menu"
import MenuModuleService from "../../../../../modules/menu/service"

const LinkTypeEnum = z.enum(["custom", "home", "store", "collection", "category", "product", "page"])

const CreateMenuItemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    link_type: LinkTypeEnum.default("custom"),
    link_id: z.string().nullable().optional(),
    url: z.string().optional(), // Optional - auto-generated for non-custom types
    parent_id: z.string().nullable().optional(),
    open_in_new_tab: z.boolean().optional().default(false),
    highlight: z.boolean().optional().default(false),
    highlight_text: z.string().nullable().optional(),
    icon: z.string().nullable().optional(),
    sort_order: z.number().optional().default(0),
    is_active: z.boolean().optional().default(true),
})

/**
 * Generate URL based on link type and entity
 */
async function generateUrl(
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

/**
 * GET /admin/menu/:id/items
 * List all items for a menu
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { id } = req.params
    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    const items = await menuService.listMenuItems(
        { menu_id: id },
        { order: { sort_order: "ASC" } }
    )

    res.json({
        items,
    })
}

/**
 * POST /admin/menu/:id/items
 * Create a new menu item
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { id } = req.params
    const validated = CreateMenuItemSchema.parse(req.body)
    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    // Generate URL based on link type
    const url = await generateUrl(
        validated.link_type,
        validated.link_id,
        validated.url,
        req.scope
    )

    const item = await menuService.createMenuItems({
        ...validated,
        url,
        menu_id: id,
    })

    res.status(201).json({
        item,
    })
}


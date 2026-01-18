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

import { generateUrl } from "../../utils"

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


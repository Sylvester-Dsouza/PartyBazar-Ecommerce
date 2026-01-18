import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"
import { MENU_MODULE } from "../../../../../../modules/menu"
import MenuModuleService from "../../../../../../modules/menu/service"

const UpdateMenuItemSchema = z.object({
    title: z.string().min(1).optional(),
    link_type: z.enum(["custom", "home", "store", "collection", "category", "product", "page"]).optional(),
    link_id: z.string().nullable().optional(),
    url: z.string().min(1).optional(),
    parent_id: z.string().nullable().optional(),
    open_in_new_tab: z.boolean().optional(),
    highlight: z.boolean().optional(),
    highlight_text: z.string().nullable().optional(),
    icon: z.string().nullable().optional(),
    sort_order: z.number().optional(),
    is_active: z.boolean().optional(),
})

import { generateUrl } from "../../../utils"

/**
 * GET /admin/menu/:id/items/:itemId
 * Get a single menu item
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { itemId } = req.params
    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    const item = await menuService.retrieveMenuItem(itemId)

    if (!item) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, `Menu item ${itemId} not found`)
    }

    res.json({
        item,
    })
}

/**
 * PUT /admin/menu/:id/items/:itemId
 * Update a menu item
 */
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const { itemId } = req.params
    const validated = UpdateMenuItemSchema.parse(req.body)
    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    // If link info is changed, we might need to regenerate the URL
    let url = validated.url
    if (validated.link_type || validated.link_id !== undefined) {
        // Fetch current item to get existing values for regeneration if not provided in body
        const currentItem = await menuService.retrieveMenuItem(itemId)
        url = await generateUrl(
            validated.link_type || currentItem.link_type,
            validated.link_id !== undefined ? validated.link_id : currentItem.link_id,
            validated.url || currentItem.url,
            req.scope
        )
    }

    const item = await menuService.updateMenuItems({
        id: itemId,
        ...validated,
        ...(url ? { url } : {})
    })

    res.json({
        item,
    })
}

/**
 * DELETE /admin/menu/:id/items/:itemId
 * Delete a menu item
 */
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const { itemId } = req.params
    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    await menuService.deleteMenuItems(itemId)

    res.status(200).json({
        id: itemId,
        deleted: true,
    })
}

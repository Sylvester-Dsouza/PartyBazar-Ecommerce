import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { MENU_MODULE } from "../../../../../../modules/menu"
import MenuModuleService from "../../../../../../modules/menu/service"

const ReorderSchema = z.object({
    items: z.array(
        z.object({
            id: z.string(),
            sort_order: z.number(),
            parent_id: z.string().nullable().optional(),
        })
    ),
})

/**
 * POST /admin/menu/:id/items/reorder
 * Reorder menu items
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const validated = ReorderSchema.parse(req.body)
    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    console.log(`Reordering ${validated.items.length} items`)

    try {
        // Use upsertMenuItems for batch update
        // We map the validated items to the structure expected by upsert
        const itemsToUpsert = validated.items.map(item => {
            if (!item.id) return null

            const updatePayload: any = {
                id: item.id,
                sort_order: item.sort_order
            }
            if (item.parent_id !== undefined) {
                updatePayload.parent_id = item.parent_id
            }
            return updatePayload
        }).filter(Boolean)

        if (itemsToUpsert.length > 0) {
            // updateMenuItems accepts an array of objects to update
            await menuService.updateMenuItems(itemsToUpsert)
        }

        // Verification log
        const firstItem = validated.items[0]
        if (firstItem) {
            const verified = await menuService.retrieveMenuItem(firstItem.id)
            console.log(`Verified item ${firstItem.id}: sort_order=${verified.sort_order}, parent_id=${verified.parent_id}`)
        }

        res.json({
            success: true,
        })
    } catch (error) {
        console.error("Reorder failed:", error)
        throw error // This will return 400/404/500 depending on error type
    }
}

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"
import { MENU_MODULE } from "../../../../modules/menu"
import MenuModuleService from "../../../../modules/menu/service"

const UpdateMenuSchema = z.object({
    title: z.string().min(1).optional(),
    handle: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
    is_active: z.boolean().optional(),
})

/**
 * GET /admin/menu/:id
 * Get a single menu by ID
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { id } = req.params
    console.log(`GET /admin/menu/${id} - Fetching menu details`)

    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    try {
        const menu = await menuService.retrieveMenu(id, { relations: ["items"] })
        console.log(`Found menu: ${menu?.title} (${menu?.id})`)

        if (!menu) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, `Menu ${id} not found`)
        }

        res.json({
            menu,
        })
    } catch (error) {
        console.error(`Error fetching menu ${id}:`, error)
        throw error
    }
}

/**
 * PUT /admin/menu/:id
 * Update a menu
 */
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const { id } = req.params
    const validated = UpdateMenuSchema.parse(req.body)
    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    const menu = await menuService.updateMenus({ id }, validated)

    res.json({
        menu,
    })
}

/**
 * DELETE /admin/menu/:id
 * Delete a menu
 */
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const { id } = req.params
    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    console.log(`Deleting menu with ID: ${id}`)

    try {
        await menuService.deleteMenus([id])
        console.log(`Successfully deleted menu: ${id}`)

        res.status(200).json({
            id,
            deleted: true,
        })
    } catch (error) {
        console.error(`Error deleting menu ${id}:`, error)
        throw error
    }
}

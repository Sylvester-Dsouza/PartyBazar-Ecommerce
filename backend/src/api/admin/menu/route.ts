import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { MENU_MODULE } from "../../../modules/menu"
import MenuModuleService from "../../../modules/menu/service"

const CreateMenuSchema = z.object({
    title: z.string().min(1, "Title is required"),
    handle: z.string().min(1, "Handle is required").regex(/^[a-z0-9-]+$/, "Handle must be lowercase with hyphens only"),
    is_active: z.boolean().optional().default(true),
})

/**
 * GET /admin/menu
 * List all menus
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    const menus = await menuService.listMenus({}, { relations: ["items"] })

    res.json({
        menus,
    })
}

/**
 * POST /admin/menu
 * Create a new menu
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const validated = CreateMenuSchema.parse(req.body)
    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    const menu = await menuService.createMenus(validated)

    res.status(201).json({
        menu,
    })
}

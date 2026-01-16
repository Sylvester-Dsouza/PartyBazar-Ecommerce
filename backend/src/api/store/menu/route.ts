import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MENU_MODULE } from "../../../modules/menu"
import MenuModuleService from "../../../modules/menu/service"

/**
 * GET /store/menu
 * Get all active menus with their items
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    const menus = await menuService.getActiveMenus()

    res.json({
        menus,
    })
}

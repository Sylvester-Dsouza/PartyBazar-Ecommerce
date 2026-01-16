import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { MENU_MODULE } from "../../../../modules/menu"
import MenuModuleService from "../../../../modules/menu/service"

/**
 * GET /store/menu/:handle
 * Get a specific menu by handle with all active items
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { handle } = req.params
    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    const menu = await menuService.getMenuByHandle(handle)

    if (!menu) {
        throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Menu with handle "${handle}" not found`
        )
    }

    res.json({
        menu,
    })
}

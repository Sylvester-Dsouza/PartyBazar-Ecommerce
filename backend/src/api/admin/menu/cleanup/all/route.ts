import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MENU_MODULE } from "../../../../../modules/menu"
import MenuModuleService from "../../../../../modules/menu/service"

/**
 * GET /admin/menu/cleanup/all
 * FORCE DELETE all menus and items
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const menuService: MenuModuleService = req.scope.resolve(MENU_MODULE)

    console.log("Starting forced menu cleanup...")

    try {
        // 1. List all menus
        const menus = await menuService.listMenus({}, { take: 1000 })
        console.log(`Found ${menus.length} menus to delete`)

        // 2. List all items
        const items = await menuService.listMenuItems({}, { take: 10000 })
        console.log(`Found ${items.length} items to delete`)

        // 3. Delete all items first (to avoid FK issues)
        if (items.length > 0) {
            await menuService.deleteMenuItems(items.map(i => i.id))
            console.log("Deleted all menu items")
        }

        // 4. Delete all menus
        if (menus.length > 0) {
            await menuService.deleteMenus(menus.map(m => m.id))
            console.log("Deleted all menus")
        }

        res.json({
            success: true,
            deletedMenus: menus.length,
            deletedItems: items.length
        })
    } catch (error) {
        console.error("Cleanup failed:", error)
        res.status(500).json({ error: error.message })
    }
}

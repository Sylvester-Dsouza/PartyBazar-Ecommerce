import { MedusaService } from "@medusajs/framework/utils"
import { Menu, MenuItem } from "./models"

class MenuModuleService extends MedusaService({
    Menu,
    MenuItem,
}) {
    /**
     * Get a menu by its handle with all active items
     */
    async getMenuByHandle(handle: string) {
        const [menu] = await this.listMenus(
            { handle, is_active: true },
            { relations: ["items"] }
        ) as any[]

        if (!menu) {
            return null
        }

        // Filter and sort items
        const activeItems = (menu.items || [])
            .filter((item: any) => item.is_active)
            .sort((a: any, b: any) => a.sort_order - b.sort_order)

        return {
            ...menu,
            items: this.buildMenuTree(activeItems),
        }
    }

    /**
     * Build hierarchical menu tree from flat items
     */
    private buildMenuTree(items: any[]) {
        const itemMap = new Map<string, any>()
        const roots: any[] = []

        // First pass: create map of all items
        items.forEach((item) => {
            itemMap.set(item.id, { ...item, children: [] })
        })

        // Second pass: build tree structure
        items.forEach((item) => {
            const node = itemMap.get(item.id)
            if (item.parent_id && itemMap.has(item.parent_id)) {
                itemMap.get(item.parent_id).children.push(node)
            } else {
                roots.push(node)
            }
        })

        return roots
    }

    /**
     * Get all active menus
     */
    async getActiveMenus() {
        return this.listMenus(
            { is_active: true },
            { relations: ["items"] }
        )
    }
}

export default MenuModuleService

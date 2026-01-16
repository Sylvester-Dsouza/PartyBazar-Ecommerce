import { model } from "@medusajs/framework/utils"

const Menu = model.define("menu", {
    id: model.id().primaryKey(),
    handle: model.text().unique(),
    title: model.text(),
    is_active: model.boolean().default(true),
    items: model.hasMany(() => MenuItem),
}).cascades({
    delete: ["items"],
})

export default Menu

// Import after definition to avoid circular dependency
import MenuItem from "./menu-item"


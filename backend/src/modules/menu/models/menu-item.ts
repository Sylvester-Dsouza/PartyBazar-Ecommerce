import { model } from "@medusajs/framework/utils"

/**
 * Link types for menu items
 * - custom: Manual URL entry
 * - home: Links to /
 * - store: Links to /store
 * - collection: Links to a specific collection
 * - category: Links to a specific category
 * - product: Links to a specific product
 * - page: Links to a static page
 */
const MenuItem = model.define("menu_item", {
    id: model.id().primaryKey(),
    menu: model.belongsTo(() => Menu, { mappedBy: "items" }),
    parent_id: model.text().nullable(),
    title: model.text(),
    // Link type determines how URL is generated
    link_type: model.enum(["custom", "home", "store", "collection", "category", "product", "page"]).default("custom"),
    // ID of linked entity (collection_id, product_id, etc.) - null for custom/home/store
    link_id: model.text().nullable(),
    // URL - auto-generated for entity links, manual for custom
    url: model.text(),
    open_in_new_tab: model.boolean().default(false),
    highlight: model.boolean().default(false),
    highlight_text: model.text().nullable(),
    icon: model.text().nullable(),
    sort_order: model.number().default(0),
    is_active: model.boolean().default(true),
})

export default MenuItem

// Import after to avoid circular dependency
import Menu from "./menu"



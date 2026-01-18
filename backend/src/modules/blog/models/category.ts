import { model } from "@medusajs/framework/utils"

const Category = model.define("blog_category", {
    id: model.id().primaryKey(),
    name: model.text(),
    handle: model.text().unique(),
    description: model.text().nullable(),

    // Relations
    posts: model.hasMany(() => Post, {
        mappedBy: "category",
    }),
})

export default Category

// Import after definition to avoid circular dependency
import Post from "./post"

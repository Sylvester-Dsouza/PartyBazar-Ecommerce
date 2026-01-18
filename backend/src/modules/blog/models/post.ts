import { model } from "@medusajs/framework/utils"

const Post = model.define("blog_post", {
    id: model.id().primaryKey(),
    title: model.text(),
    handle: model.text().unique(),
    content: model.json(),
    excerpt: model.text().nullable(),
    thumbnail: model.text().nullable(),
    published_at: model.dateTime().nullable(),

    // SEO Fields
    meta_title: model.text().nullable(),
    meta_description: model.text().nullable(),
    keywords: model.text().nullable(),

    // Relations
    category: model.belongsTo(() => Category, {
        mappedBy: "posts",
    }).nullable(),
})

export default Post

// Import after definition to avoid circular dependency
import Category from "./category"

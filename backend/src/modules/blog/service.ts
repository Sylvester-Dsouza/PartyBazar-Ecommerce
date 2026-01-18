import { MedusaService } from "@medusajs/framework/utils"
import Post from "./models/post"
import Category from "./models/category"

class BlogModuleService extends MedusaService({
    Post,
    Category,
}) {
    /**
     * Get a published post by its handle
     */
    async getPublishedPostByHandle(handle: string) {
        const [post] = await this.listPosts(
            {
                handle,
                published_at: {
                    $lte: new Date(),
                }
            },
            { relations: ["category"] }
        ) as any[]

        return post || null
    }

    /**
     * Get all published posts
     */
    async getPublishedPosts(options: any = {}) {
        const { limit = 10, offset = 0, category_id } = options

        const filters: any = {
            published_at: {
                $lte: new Date(),
            }
        }

        if (category_id) {
            filters.category_id = category_id
        }

        return this.listPosts(filters, {
            relations: ["category"],
            skip: offset,
            take: limit,
            order: { published_at: "DESC" },
        })
    }

    /**
     * Get a category by handle with its posts
     */
    async getCategoryByHandle(handle: string) {
        const [category] = await this.listCategories(
            { handle },
            { relations: ["posts"] }
        ) as any[]

        return category || null
    }
}

export default BlogModuleService

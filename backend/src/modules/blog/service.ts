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
            { handle },
            { relations: ["category"] }
        ) as any[]

        // Check if post exists and is published
        if (!post || !post.published_at || new Date(post.published_at) > new Date()) {
            return null
        }

        return post
    }

    /**
     * Get all published posts
     */
    async getPublishedPosts(options: any = {}) {
        const { limit = 10, offset = 0, category_id } = options

        // Get all posts and filter in memory for published ones
        const filters: any = {}

        if (category_id) {
            filters.category_id = category_id
        }

        const allPosts = await this.listPosts(filters, {
            relations: ["category"],
            order: { created_at: "DESC" },
        }) as any[]

        // Filter for published posts (published_at exists and is in the past)
        const now = new Date()
        const publishedPosts = allPosts.filter((post: any) =>
            post.published_at && new Date(post.published_at) <= now
        )

        // Apply pagination
        return publishedPosts.slice(offset, offset + limit)
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

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BLOG_MODULE } from "../../../modules/blog"
import BlogModuleService from "../../../modules/blog/service"

/**
 * GET /store/blog/posts
 * Get all published blog posts
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

    const { limit, offset, category_id } = req.query

    const posts = await blogService.getPublishedPosts({
        limit: limit ? parseInt(limit as string) : 10,
        offset: offset ? parseInt(offset as string) : 0,
        category_id: category_id as string,
    })

    res.json({
        posts,
    })
}

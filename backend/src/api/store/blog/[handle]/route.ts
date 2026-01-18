import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BLOG_MODULE } from "../../../../modules/blog"
import BlogModuleService from "../../../../modules/blog/service"

/**
 * GET /store/blog/[handle]
 * Get a single published blog post by handle
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
    const { handle } = req.params

    const post = await blogService.getPublishedPostByHandle(handle)

    if (!post) {
        return res.status(404).json({
            message: "Post not found",
        })
    }

    res.json({
        post,
    })
}

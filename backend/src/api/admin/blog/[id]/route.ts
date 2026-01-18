import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { BLOG_MODULE } from "../../../../modules/blog"
import BlogModuleService from "../../../../modules/blog/service"

const UpdatePostSchema = z.object({
    title: z.string().optional(),
    handle: z.string().regex(/^[a-z0-9-]+$/, "Handle must be lowercase with hyphens only").optional(),
    content: z.any().optional(),
    excerpt: z.string().optional(),
    thumbnail: z.string().optional(),
    published_at: z.string().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    keywords: z.string().optional(),
    category_id: z.string().optional(),
})

/**
 * GET /admin/blog/[id]
 * Get a single blog post
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
    const { id } = req.params

    const post = await blogService.retrievePost(id, { relations: ["category"] })

    if (!post) {
        return res.status(404).json({
            message: "Post not found",
        })
    }

    res.json({
        post,
    })
}

/**
 * POST /admin/blog/[id]
 * Update a blog post
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const validated = UpdatePostSchema.parse(req.body)
    const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
    const { id } = req.params

    const post = await blogService.updatePosts(id, validated)

    res.json({
        post,
    })
}

/**
 * DELETE /admin/blog/[id]
 * Delete a blog post
 */
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
    const { id } = req.params

    await blogService.deletePosts(id)

    res.status(200).json({
        id,
        deleted: true,
    })
}

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { BLOG_MODULE } from "../../../modules/blog"
import BlogModuleService from "../../../modules/blog/service"

const CreatePostSchema = z.object({
    title: z.string().min(1, "Title is required"),
    handle: z.string().min(1, "Handle is required").regex(/^[a-z0-9-]+$/, "Handle must be lowercase with hyphens only"),
    content: z.any(),
    excerpt: z.string().optional(),
    thumbnail: z.string().optional(),
    published_at: z.string().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    keywords: z.string().optional(),
    category_id: z.string().optional(),
})

/**
 * GET /admin/blog
 * List all blog posts
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

    const posts = await blogService.listPosts({}, { relations: ["category"] })

    res.json({
        posts,
    })
}

/**
 * POST /admin/blog
 * Create a new blog post
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const validated = CreatePostSchema.parse(req.body)
    const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

    const post = await blogService.createPosts(validated)

    res.status(201).json({
        post,
    })
}

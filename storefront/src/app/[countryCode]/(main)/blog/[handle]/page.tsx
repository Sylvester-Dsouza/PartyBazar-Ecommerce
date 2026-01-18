import { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogPostTemplate from "@modules/blog/templates/blog-post"

type Params = {
    params: Promise<{
        countryCode: string
        handle: string
    }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params
    const { handle } = params

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/blog/${handle}`,
            {
                next: { revalidate: 60 },
            }
        )

        if (!response.ok) {
            return {
                title: "Post Not Found",
            }
        }

        const { post } = await response.json()

        return {
            title: post.meta_title || post.title,
            description: post.meta_description || post.excerpt,
            keywords: post.keywords,
        }
    } catch (error) {
        return {
            title: "Post Not Found",
        }
    }
}

export default async function BlogPostPage(props: Params) {
    const params = await props.params
    const { handle, countryCode } = params

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/blog/${handle}`,
            {
                next: { revalidate: 60 },
            }
        )

        if (!response.ok) {
            notFound()
        }

        const { post } = await response.json()

        return <BlogPostTemplate post={post} countryCode={countryCode} />
    } catch (error) {
        notFound()
    }
}

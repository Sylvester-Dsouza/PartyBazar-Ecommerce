"use client"

import { useEffect, useState } from "react"
import PageHeader from "@modules/common/components/page-header"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Post = {
    id: string
    title: string
    handle: string
    excerpt: string
    thumbnail: string | null
    published_at: string
    category?: { name: string }
}

export default function BlogListTemplate({ countryCode }: { countryCode: string }) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/blog`,
                    {
                        headers: {
                            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
                        },
                    }
                )
                const data = await response.json()
                setPosts(data.posts || [])
            } catch (error) {
                console.error("Failed to fetch posts:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    return (
        <>
            <PageHeader
                title="Blog"
                breadcrumbs={[{ label: "Blog", href: "/blog" }]}
                description="Read our latest articles and updates"
            />

            <div className="content-container py-12">
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-grey-50">Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-grey-50">No blog posts yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <LocalizedClientLink
                                key={post.id}
                                href={`/blog/${post.handle}`}
                                className="group"
                            >
                                <article className="bg-white rounded-lg overflow-hidden border border-grey-10 hover:shadow-lg transition-shadow">
                                    {post.thumbnail && (
                                        <div className="aspect-video bg-grey-5 overflow-hidden">
                                            <img
                                                src={post.thumbnail}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        {post.category && (
                                            <span className="text-xs font-medium text-party-pink-600 uppercase tracking-wide">
                                                {post.category.name}
                                            </span>
                                        )}
                                        <h2 className="text-xl font-semibold text-party-dark mt-2 group-hover:text-party-pink-600 transition-colors">
                                            {post.title}
                                        </h2>
                                        {post.excerpt && (
                                            <p className="text-grey-50 mt-2 line-clamp-3">{post.excerpt}</p>
                                        )}
                                        <div className="mt-4 flex items-center justify-between text-sm text-grey-40">
                                            <time dateTime={post.published_at}>
                                                {new Date(post.published_at).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </time>
                                            <span className="text-party-pink-600 font-medium group-hover:underline">
                                                Read more →
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </LocalizedClientLink>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

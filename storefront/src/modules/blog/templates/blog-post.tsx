import PageHeader from "@modules/common/components/page-header"

type Post = {
    id: string
    title: string
    handle: string
    content: any
    excerpt: string
    thumbnail: string | null
    published_at: string
    category?: { name: string; handle: string }
    meta_title?: string
    meta_description?: string
    keywords?: string
}

export default function BlogPostTemplate({
    post,
    countryCode,
}: {
    post: Post
    countryCode: string
}) {
    // Extract text content from JSON or use as-is
    const contentText = typeof post.content === "object" ? post.content.text : post.content

    return (
        <>
            <PageHeader
                title={post.title}
                breadcrumbs={[
                    { label: "Blog", href: "/blog" },
                    { label: post.title, href: `/blog/${post.handle}` },
                ]}
            />

            <article className="content-container py-12">
                <div className="max-w-3xl mx-auto">
                    {/* Article Header */}
                    <div className="mb-8">
                        {post.category && (
                            <span className="text-sm font-medium text-party-pink-600 uppercase tracking-wide">
                                {post.category.name}
                            </span>
                        )}
                        <h1 className="text-4xl font-bold text-party-dark mt-2">{post.title}</h1>
                        <div className="flex items-center gap-4 mt-4 text-grey-50">
                            <time dateTime={post.published_at}>
                                {new Date(post.published_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </time>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.thumbnail && (
                        <div className="mb-8 rounded-lg overflow-hidden">
                            <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-full h-auto"
                            />
                        </div>
                    )}

                    {/* Excerpt */}
                    {post.excerpt && (
                        <div className="text-xl text-grey-60 mb-8 pb-8 border-b border-grey-10">
                            {post.excerpt}
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <div
                            className="text-grey-70 leading-relaxed whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: contentText }}
                        />
                    </div>

                    {/* Back to Blog */}
                    <div className="mt-12 pt-8 border-t border-grey-10">
                        <a
                            href={`/${countryCode}/blog`}
                            className="text-party-pink-600 hover:text-party-pink-700 font-medium"
                        >
                            ← Back to all posts
                        </a>
                    </div>
                </div>
            </article>
        </>
    )
}

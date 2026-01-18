import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PencilSquare } from "@medusajs/icons"
import { Container, Heading, Button, Table, Badge, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const ITEMS_PER_PAGE = 9

type Post = {
    id: string
    title: string
    handle: string
    published_at: string | null
    category?: { name: string }
}

const BlogListPage = () => {
    const navigate = useNavigate()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)

    const fetchPosts = async () => {
        try {
            const response = await fetch("/admin/blog", {
                credentials: "include",
            })
            const data = await response.json()
            setPosts(data.posts || [])
        } catch (error) {
            console.error("Failed to fetch posts:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const isPublished = (post: Post) => {
        if (!post.published_at) return false
        return new Date(post.published_at) <= new Date()
    }

    // Pagination calculations
    const pageCount = Math.ceil(posts.length / ITEMS_PER_PAGE)
    const canNextPage = currentPage < pageCount - 1
    const canPreviousPage = currentPage > 0
    const paginatedPosts = posts.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    )

    return (
        <Container className="divide-y p-0">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h1">Blog Posts</Heading>
                <div className="flex items-center gap-2">
                    <Button variant="primary" onClick={() => navigate("create")}>
                        Create
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                    <Text className="text-ui-fg-subtle">Add filter</Text>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="h-8 w-64 rounded-md border border-ui-border-base bg-ui-bg-field px-3 text-sm placeholder:text-ui-fg-muted focus:border-ui-border-interactive focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div>
                {loading ? (
                    <div className="px-6 py-12 text-center">
                        <Text className="text-ui-fg-subtle">Loading...</Text>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <Text className="text-ui-fg-subtle">No blog posts yet.</Text>
                        <Text className="text-ui-fg-subtle text-sm mt-2">
                            Create your first blog post to get started.
                        </Text>
                    </div>
                ) : (
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Title</Table.HeaderCell>
                                <Table.HeaderCell>Handle</Table.HeaderCell>
                                <Table.HeaderCell>Category</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Published</Table.HeaderCell>
                                <Table.HeaderCell></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {paginatedPosts.map((post) => (
                                <Table.Row
                                    key={post.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(post.id)}
                                >
                                    <Table.Cell>
                                        <span className="font-medium text-ui-fg-base">
                                            {post.title}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <code className="text-sm bg-ui-bg-subtle px-2 py-1 rounded">
                                            {post.handle}
                                        </code>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {post.category?.name || <span className="text-ui-fg-subtle">—</span>}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge color={isPublished(post) ? "green" : "grey"}>
                                            {isPublished(post) ? "Published" : "Draft"}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {post.published_at
                                            ? new Date(post.published_at).toLocaleDateString()
                                            : "—"}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center justify-end">
                                            <button className="text-ui-fg-subtle hover:text-ui-fg-base">
                                                ...
                                            </button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </div>

            {/* Pagination */}
            {!loading && posts.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                    <Text className="text-ui-fg-subtle text-sm">
                        {currentPage * ITEMS_PER_PAGE + 1} — {Math.min((currentPage + 1) * ITEMS_PER_PAGE, posts.length)} of {posts.length} results
                    </Text>
                    <div className="flex items-center gap-2">
                        <Text className="text-ui-fg-subtle text-sm">
                            {currentPage + 1} of {pageCount} pages
                        </Text>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="transparent"
                                size="small"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={!canPreviousPage}
                            >
                                Prev
                            </Button>
                            <Button
                                variant="transparent"
                                size="small"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={!canNextPage}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Blog",
    icon: PencilSquare,
})

export default BlogListPage

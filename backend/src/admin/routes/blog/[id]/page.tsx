import { Container, Heading, Button, Input, Textarea, Label, Prompt } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TinyMCEEditor from "../../../widgets/tinymce-editor"

const EditBlogPostPage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        handle: "",
        content: "",
        excerpt: "",
        meta_title: "",
        meta_description: "",
        keywords: "",
        published_at: "",
    })

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/admin/blog/${id}`, {
                    credentials: "include",
                })
                const data = await response.json()
                const post = data.post

                setFormData({
                    title: post.title || "",
                    handle: post.handle || "",
                    content: typeof post.content === "object" ? post.content.text || "" : post.content || "",
                    excerpt: post.excerpt || "",
                    meta_title: post.meta_title || "",
                    meta_description: post.meta_description || "",
                    keywords: post.keywords || "",
                    published_at: post.published_at || "",
                })
            } catch (error) {
                console.error("Failed to fetch post:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const response = await fetch(`/admin/blog/${id}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    content: { text: formData.content },
                }),
            })

            if (response.ok) {
                navigate("/blog")
            }
        } catch (error) {
            console.error("Failed to update post:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        try {
            await fetch(`/admin/blog/${id}`, {
                method: "DELETE",
                credentials: "include",
            })
            navigate("/blog")
        } catch (error) {
            console.error("Failed to delete post:", error)
        }
    }

    const handlePublish = async () => {
        setSaving(true)
        try {
            await fetch(`/admin/blog/${id}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    content: { text: formData.content },
                    published_at: new Date().toISOString(),
                }),
            })
            navigate("/blog")
        } catch (error) {
            console.error("Failed to publish post:", error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <Container className="p-6">Loading...</Container>
    }

    return (
        <Container className="p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <Heading level="h1">Edit Blog Post</Heading>
                <div className="flex gap-2">
                    <Prompt>
                        <Prompt.Trigger asChild>
                            <Button variant="danger">Delete</Button>
                        </Prompt.Trigger>
                        <Prompt.Content>
                            <Prompt.Header>
                                <Prompt.Title>Delete Post</Prompt.Title>
                                <Prompt.Description>
                                    Are you sure? This cannot be undone.
                                </Prompt.Description>
                            </Prompt.Header>
                            <Prompt.Footer>
                                <Prompt.Cancel>Cancel</Prompt.Cancel>
                                <Prompt.Action onClick={handleDelete}>Delete</Prompt.Action>
                            </Prompt.Footer>
                        </Prompt.Content>
                    </Prompt>

                    {!formData.published_at && (
                        <Button variant="secondary" onClick={handlePublish} disabled={saving}>
                            Publish Now
                        </Button>
                    )}

                    <Button variant="secondary" onClick={() => navigate("/blog")}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={saving || !formData.title}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="handle">Handle (URL Slug) *</Label>
                        <Input
                            id="handle"
                            value={formData.handle}
                            onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="content">Content *</Label>
                        <div className="mt-2">
                            <TinyMCEEditor
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                                height={600}
                            />
                        </div>
                    </div>
                </div>

                {/* SEO Section */}
                <div className="border-t pt-6">
                    <Heading level="h2" className="mb-4">SEO Settings</Heading>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="meta_title">Meta Title</Label>
                            <Input
                                id="meta_title"
                                value={formData.meta_title}
                                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                maxLength={60}
                            />
                            <p className="text-xs text-ui-fg-subtle mt-1">
                                {formData.meta_title.length}/60 characters
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="meta_description">Meta Description</Label>
                            <Textarea
                                id="meta_description"
                                value={formData.meta_description}
                                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                rows={3}
                                maxLength={160}
                            />
                            <p className="text-xs text-ui-fg-subtle mt-1">
                                {formData.meta_description.length}/160 characters
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="keywords">Keywords</Label>
                            <Input
                                id="keywords"
                                value={formData.keywords}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Container>
    )
}

export default EditBlogPostPage

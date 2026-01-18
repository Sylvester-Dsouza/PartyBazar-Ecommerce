import { Container, Heading, Button, Input, Textarea, Label } from "@medusajs/ui"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import TinyMCEEditor from "../../../widgets/tinymce-editor"

const CreateBlogPostPage = () => {
    const navigate = useNavigate()
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        handle: "",
        content: "",
        excerpt: "",
        meta_title: "",
        meta_description: "",
        keywords: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const response = await fetch("/admin/blog", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    content: { text: formData.content }, // Store as JSON
                }),
            })

            if (response.ok) {
                navigate("/blog")
            }
        } catch (error) {
            console.error("Failed to create post:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleTitleChange = (value: string) => {
        setFormData({
            ...formData,
            title: value,
            handle: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        })
    }

    return (
        <Container className="p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <Heading level="h1">Create Blog Post</Heading>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => navigate("/blog")}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={saving || !formData.title}>
                        {saving ? "Creating..." : "Create Post"}
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
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="My Awesome Blog Post"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="handle">Handle (URL Slug) *</Label>
                        <Input
                            id="handle"
                            value={formData.handle}
                            onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                            placeholder="my-awesome-blog-post"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="A brief summary of your post..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <div>
                            <Label htmlFor="content">Content *</Label>
                            <div className="mt-2">
                                <TinyMCEEditor
                                    value={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    height={800}
                                />
                            </div>
                            <p className="text-xs text-ui-fg-subtle mt-1">
                                Use the rich text editor to format your blog post content.
                            </p>
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
                                placeholder={formData.title || "SEO title for search engines"}
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
                                placeholder="A compelling description for search results..."
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
                                placeholder="party, decorations, balloons"
                            />
                            <p className="text-xs text-ui-fg-subtle mt-1">
                                Comma-separated keywords for SEO
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </Container>
    )
}

export default CreateBlogPostPage

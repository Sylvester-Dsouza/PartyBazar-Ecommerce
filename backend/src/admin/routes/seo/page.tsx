import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Tabs, Table, Badge, Button, Drawer, Input, Textarea, Label, toast, IconButton, Tooltip } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { PencilSquare, CheckCircle, ExclamationCircle, MagnifyingGlass } from "@medusajs/icons"

// --- Types ---
type SEOData = {
    meta_title?: string
    meta_description?: string
    keywords?: string
}

type ProductImage = {
    id: string
    url: string
    metadata: {
        alt_text?: string
    } | null
}

type Product = {
    id: string
    title: string
    handle: string
    thumbnail: string
    metadata: SEOData | null
    images: ProductImage[]
}

// --- Fetcher Utility ---
const fetcher = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options)
    if (!res.ok) throw new Error("Failed to fetch")
    return res.json()
}

const SEOPage = () => {
    const [activeTab, setActiveTab] = useState("products")
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    // Data Lists
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [collections, setCollections] = useState<any[]>([])

    // Editor State
    const [selectedItem, setSelectedItem] = useState<any | null>(null)
    const [selectedType, setSelectedType] = useState<"product" | "category" | "collection">("product")
    const [editorOpen, setEditorOpen] = useState(false)
    const [saving, setSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState<SEOData & { images: ProductImage[], image_url?: string, image_alt_text?: string }>({ images: [] })

    // Load Data
    const loadData = async () => {
        try {
            setLoading(true)
            if (activeTab === 'products') {
                const data = await fetcher("/admin/products?limit=50&fields=id,title,handle,thumbnail,metadata,images.*")
                setProducts(data.products || [])
            } else if (activeTab === 'categories') {
                const data = await fetcher("/admin/product-categories?limit=50&fields=id,name,handle,metadata")
                setCategories(data.product_categories || [])
            } else if (activeTab === 'collections') {
                const data = await fetcher("/admin/collections?limit=50")
                setCollections(data.collections || [])
            }
        } catch (e) {
            toast.error(`Failed to load ${activeTab}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [activeTab])

    const handleEdit = (item: any, type: "product" | "category" | "collection") => {
        setSelectedItem(item)
        setSelectedType(type)

        // Initialize Form Data based on type
        if (type === 'product') {
            setFormData({
                meta_title: item.metadata?.meta_title || "",
                meta_description: item.metadata?.meta_description || "",
                keywords: item.metadata?.keywords || "",
                images: item.images?.map((img: any) => ({
                    id: img.id,
                    url: img.url,
                    metadata: { alt_text: img.metadata?.alt_text || "" }
                })) || []
            })
        } else if (type === 'category' || type === 'collection') {
            // Categories/Collections often store single image URL in metadata or handle it differently
            // Categories: metadata.image_url (string)
            // Collections: metadata.image_url (if used similarly, or handle standard image relation if V2 supports it well)
            // For now, consistent with plan:
            const meta = item.metadata || {}
            setFormData({
                meta_title: meta.meta_title || "",
                meta_description: meta.meta_description || "",
                keywords: meta.keywords || "",
                image_url: meta.image_url || "", // Display only
                image_alt_text: meta.image_alt_text || "",
                images: [] // Not used for this type
            })
        }
        setEditorOpen(true)
    }

    const handleSave = async () => {
        if (!selectedItem) return
        setSaving(true)

        try {
            let endpoint = ""
            let payload: any = {}

            if (selectedType === 'product') {
                endpoint = `/admin/products/${selectedItem.id}`
                payload = {
                    metadata: {
                        ...selectedItem.metadata,
                        meta_title: formData.meta_title,
                        meta_description: formData.meta_description,
                        keywords: formData.keywords
                    }
                }

                // Handle Product Images (Workflow)
                const imageUpdates = formData.images.filter((img, idx) => {
                    const original = selectedItem.images[idx]
                    return img.metadata?.alt_text !== original.metadata?.alt_text
                })

                if (imageUpdates.length > 0) {
                    await Promise.all(imageUpdates.map(img =>
                        fetcher('/admin/media', {
                            method: 'PUT',
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                key: img.id,
                                url: img.url,
                                alt: img.metadata?.alt_text || ""
                            })
                        })
                    ))
                }

            } else if (selectedType === 'category') {
                endpoint = `/admin/product-categories/${selectedItem.id}`
                payload = {
                    metadata: {
                        ...selectedItem.metadata,
                        meta_title: formData.meta_title,
                        meta_description: formData.meta_description,
                        keywords: formData.keywords,
                        image_alt_text: formData.image_alt_text // Save directly to category metadata
                    }
                }
            } else if (selectedType === 'collection') {
                endpoint = `/admin/collections/${selectedItem.id}`
                // Collections payload often wrap metadata update
                payload = {
                    metadata: {
                        ...selectedItem.metadata,
                        meta_title: formData.meta_title,
                        meta_description: formData.meta_description,
                        keywords: formData.keywords,
                        // If collections support image_alt_text in metadata
                        image_alt_text: formData.image_alt_text
                    }
                }
            }

            // Execute Main Metadata Update
            await fetcher(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            toast.success("SEO updated successfully")
            setEditorOpen(false)
            loadData() // Refresh
        } catch (e) {
            console.error(e)
            toast.error("Failed to save changes")
        } finally {
            setSaving(false)
        }
    }

    // Helper: Filter generic lists
    const filterList = (list: any[]) => {
        return list.filter(item => (item.title || item.name || "").toLowerCase().includes(search.toLowerCase()))
    }

    const getStatus = (text?: string, min?: number) => {
        if (!text) return 'missing'
        if (min && text.length < min) return 'warning'
        return 'good'
    }

    const renderTable = (data: any[], type: "product" | "category" | "collection") => (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Meta Title</Table.HeaderCell>
                    <Table.HeaderCell>Meta Desc</Table.HeaderCell>
                    <Table.HeaderCell>
                        {type === 'product' ? 'Images (Alt)' : 'Image Alt'}
                    </Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {loading ? (
                    <Table.Row><Table.Cell colSpan={5} className="text-center py-8">Loading...</Table.Cell></Table.Row>
                ) : (
                    filterList(data).map(item => (
                        <Table.Row key={item.id}>
                            <Table.Cell>
                                <div className="flex items-center gap-3">
                                    {/* Thumbnail Logic */}
                                    {type === 'product' && item.thumbnail && <img src={item.thumbnail} className="w-8 h-8 rounded object-cover" />}
                                    {/* Category Image Logic (from metadata) */}
                                    {type === 'category' && item.metadata?.image_url && <img src={item.metadata.image_url} className="w-8 h-8 rounded object-cover" />}
                                    <span className="font-medium truncate max-w-[200px]" title={item.title || item.name}>{item.title || item.name}</span>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                {getStatus(item.metadata?.meta_title) === 'good' ?
                                    <CheckCircle className="text-green-500" /> :
                                    <Tooltip content="Missing Meta Title"><ExclamationCircle className="text-orange-500" /></Tooltip>
                                }
                            </Table.Cell>
                            <Table.Cell>
                                {getStatus(item.metadata?.meta_description) === 'good' ?
                                    <CheckCircle className="text-green-500" /> :
                                    <Tooltip content="Missing Meta Description"><ExclamationCircle className="text-orange-500" /></Tooltip>
                                }
                            </Table.Cell>
                            <Table.Cell>
                                {type === 'product' ? (
                                    <div className="flex -space-x-2">
                                        {item.images?.slice(0, 3).map((img: any, i: number) => (
                                            <div key={i} className={`w-6 h-6 rounded-full border-2 border-white overflow-hidden ${img.metadata?.alt_text ? 'ring-1 ring-green-500' : 'ring-1 ring-orange-200'}`}>
                                                <img src={img.url} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        {item.images?.length > 3 && (
                                            <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px]">
                                                +{item.images.length - 3}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Categories/Collections Single Image Alt Status
                                    item.metadata?.image_url ? (
                                        item.metadata?.image_alt_text ? <CheckCircle className="text-green-500" /> : <Tooltip content="Missing Alt Text"><ExclamationCircle className="text-orange-500" /></Tooltip>
                                    ) : <span className="text-ui-fg-muted">-</span>
                                )}
                            </Table.Cell>
                            <Table.Cell>
                                <Button variant="secondary" size="small" onClick={() => handleEdit(item, type)}>
                                    <PencilSquare /> Edit
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))
                )}
            </Table.Body>
        </Table>
    )

    return (
        <Container className="p-0 flex flex-col min-h-screen bg-ui-bg-subtle">
            <div className="p-8 border-b bg-white">
                <Heading level="h1">SEO Management</Heading>
                <Text className="text-ui-fg-subtle">Optimize your store's search engine visibility</Text>
            </div>

            <div className="p-8 flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <Tabs.List className="mb-4">
                        <Tabs.Trigger value="products">Products</Tabs.Trigger>
                        <Tabs.Trigger value="categories">Categories</Tabs.Trigger>
                        <Tabs.Trigger value="collections">Collections</Tabs.Trigger>
                    </Tabs.List>

                    {/* Common Search Bar */}
                    <div className="flex justify-between mb-4">
                        <div className="relative w-64">
                            <span className="absolute left-2.5 top-2.5 text-ui-fg-muted">
                                <MagnifyingGlass />
                            </span>
                            <Input
                                placeholder={`Search ${activeTab}...`}
                                className="pl-9"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <Tabs.Content value="products">
                        <div className="bg-white rounded-lg border overflow-hidden">
                            {renderTable(products, 'product')}
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="categories">
                        <div className="bg-white rounded-lg border overflow-hidden">
                            {renderTable(categories, 'category')}
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="collections">
                        <div className="bg-white rounded-lg border overflow-hidden">
                            {renderTable(collections, 'collection')}
                        </div>
                    </Tabs.Content>
                </Tabs>
            </div>

            {/* Unified Editor Drawer */}
            <Drawer open={editorOpen} onOpenChange={setEditorOpen}>
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title>Edit SEO: {selectedItem?.title || selectedItem?.name}</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body className="p-6 space-y-8">
                        {/* Section 1: Meta Tags */}
                        <div className="space-y-4">
                            <Heading level="h2">Meta Tags</Heading>
                            <div className="space-y-2">
                                <Label>Meta Title</Label>
                                <Input
                                    value={formData.meta_title}
                                    onChange={e => setFormData({ ...formData, meta_title: e.target.value })}
                                    placeholder="SEO Title"
                                />
                                <div className="flex justify-between text-xs text-ui-fg-subtle">
                                    <span>Recommended: 50-60 chars</span>
                                    <span className={formData.meta_title?.length > 60 ? "text-orange-500" : ""}>{formData.meta_title?.length || 0}/60</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Meta Description</Label>
                                <Textarea
                                    value={formData.meta_description}
                                    onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                                    placeholder="SEO Description"
                                    rows={3}
                                />
                                <div className="flex justify-between text-xs text-ui-fg-subtle">
                                    <span>Recommended: 150-160 chars</span>
                                    <span className={formData.meta_description?.length > 160 ? "text-orange-500" : ""}>{formData.meta_description?.length || 0}/160</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Keywords (Comma separated)</Label>
                                <Input
                                    value={formData.keywords}
                                    onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                                    placeholder="party, balloons, birthday"
                                />
                            </div>
                        </div>

                        {/* Section 2: Image Alt Text */}
                        <div className="space-y-4 pt-4 border-t">
                            <Heading level="h2">Image Alt Text</Heading>

                            {selectedType === 'product' ? (
                                <div className="grid gap-6">
                                    <Text className="text-ui-fg-subtle mb-4">Add descriptive text for each image.</Text>
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="flex gap-4 items-start">
                                            <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 shrink-0 border">
                                                <img src={img.url} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-xs">Alt Text</Label>
                                                <Input
                                                    value={img.metadata?.alt_text || ""}
                                                    onChange={e => {
                                                        const newImages = [...formData.images]
                                                        newImages[idx] = {
                                                            ...newImages[idx],
                                                            metadata: { alt_text: e.target.value }
                                                        }
                                                        setFormData({ ...formData, images: newImages })
                                                    }}
                                                    placeholder="Describe this image..."
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {formData.images.length === 0 && (
                                        <Text className="text-ui-fg-muted italic">No images found.</Text>
                                    )}
                                </div>
                            ) : (
                                // Category/Collection Single Image Logic
                                <div>
                                    {formData.image_url ? (
                                        <div className="flex gap-4 items-start">
                                            <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 shrink-0 border">
                                                <img src={formData.image_url} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-xs">Main Image Alt Text</Label>
                                                <Input
                                                    value={formData.image_alt_text || ""}
                                                    onChange={e => setFormData({ ...formData, image_alt_text: e.target.value })}
                                                    placeholder="Describe the category image..."
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <Text className="text-ui-fg-muted italic">No main image assigned to this {selectedType}.</Text>
                                    )}
                                </div>
                            )}
                        </div>

                    </Drawer.Body>
                    <Drawer.Footer>
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setEditorOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave} isLoading={saving}>Save Changes</Button>
                        </div>
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "SEO",
    icon: MagnifyingGlass,
})

export default SEOPage

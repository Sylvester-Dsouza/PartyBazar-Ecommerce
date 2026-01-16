import { Container, Heading, Button, Badge, Text } from "@medusajs/ui"
import { useEffect, useState, useCallback } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { PencilSquare, Trash, ChevronRightMini, ChevronLeftMini, BarsThree, Plus } from "@medusajs/icons"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type MenuItem = {
    id: string
    title: string
    link_type: string
    link_id: string | null
    url: string
    parent_id: string | null
    open_in_new_tab: boolean
    highlight: boolean
    highlight_text: string | null
    icon: string | null
    sort_order: number
    is_active: boolean
}

type Menu = {
    id: string
    title: string
    handle: string
    is_active: boolean
    items: MenuItem[]
}

type Entity = {
    id: string
    label: string
    handle: string
}

type LinkType = {
    value: string
    label: string
}

const LINK_TYPES: LinkType[] = [
    { value: "custom", label: "Custom URL" },
    { value: "home", label: "Home Page" },
    { value: "store", label: "Store Page" },
    { value: "collection", label: "Collection" },
    { value: "category", label: "Category" },
    { value: "product", label: "Product" },
    { value: "page", label: "Page" },
]

// Sortable Item Component
function SortableItem({
    item,
    depth = 0,
    children,
    onEdit,
    onDelete,
    onAddSub,
    onIndent,
    onOutdent
}: {
    item: MenuItem,
    depth?: number,
    children?: React.ReactNode,
    onEdit: (item: MenuItem) => void,
    onDelete: (id: string) => void,
    onAddSub: (parentId: string) => void,
    onIndent: (item: MenuItem) => void,
    onOutdent: (item: MenuItem) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} className="touch-none relative">
            <div
                className={`
            flex items-center gap-3 py-3 px-3 bg-white border border-gray-200 rounded-md mb-2
            hover:border-gray-300 transition-colors group
            ${isDragging ? "ring-2 ring-blue-500 shadow-lg relative z-20" : "shadow-sm"}
        `}
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-gray-400 hover:text-gray-600 p-1"
                >
                    <div className="grid grid-cols-2 gap-[2px] w-[14px]">
                        <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
                        <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
                        <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
                        <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
                        <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
                        <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
                    </div>
                </div>

                <div className="flex-1 flex items-center gap-3">
                    <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                    {item.highlight && item.highlight_text && (
                        <Badge color="purple" size="small" className="text-[10px] px-1.5 py-0 h-4">{item.highlight_text}</Badge>
                    )}
                    {!item.is_active && (
                        <Badge color="grey" size="small" className="text-[10px] px-1.5 py-0 h-4">Draft</Badge>
                    )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Indent/Outdent Buttons */}
                    <div className="flex items-center mr-2 border-r pr-2 border-gray-200 gap-1">
                        <button
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-30"
                            onClick={() => onOutdent(item)}
                            title="Outdent (Move Left)"
                            disabled={depth === 0}
                        >
                            <ChevronLeftMini />
                        </button>
                        <button
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => onIndent(item)}
                            title="Indent (Move Right)"
                        >
                            <ChevronRightMini />
                        </button>
                    </div>

                    {depth === 0 && (
                        <button
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => onAddSub(item.id)}
                            title="Add Sub-item"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded"
                        onClick={() => onEdit(item)}
                        title="Edit"
                    >
                        <PencilSquare className="w-4 h-4" />
                    </button>
                    <button
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        onClick={() => onDelete(item.id)}
                        title="Delete"
                    >
                        <Trash className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {children && (
                <div className="ml-6 pl-4 border-l border-gray-200 relative">
                    {children}
                </div>
            )}
        </div>
    )
}
const MenuDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [menu, setMenu] = useState<Menu | null>(null)
    const [loading, setLoading] = useState(true)
    const [showItemModal, setShowItemModal] = useState(false)
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
    const [entities, setEntities] = useState<Entity[]>([])
    const [entitySearch, setEntitySearch] = useState("")
    const [loadingEntities, setLoadingEntities] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const [isDirty, setIsDirty] = useState(false)

    const [itemForm, setItemForm] = useState({
        title: "",
        link_type: "custom",
        link_id: null as string | null,
        url: "",
        parent_id: null as string | null,
        highlight: false,
        highlight_text: "",
        open_in_new_tab: false,
        is_active: true,
    })
    const [saving, setSaving] = useState(false)

    const fetchMenu = async () => {
        try {
            const response = await fetch(`/admin/menu/${id}`, {
                credentials: "include",
                headers: { "Cache-Control": "no-cache" }
            })
            const data = await response.json()
            // Ensure items are sorted initially so array indices match visual order
            if (data.menu?.items) {
                data.menu.items.sort((a: MenuItem, b: MenuItem) => a.sort_order - b.sort_order)
            }
            setMenu(data.menu)
        } catch (error) {
            console.error("Failed to fetch menu:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchEntities = useCallback(async (type: string, search: string = "") => {
        if (!["collection", "category", "product"].includes(type)) {
            setEntities([])
            return
        }

        setLoadingEntities(true)
        try {
            const response = await fetch(
                `/admin/menu/entities?type=${type}&q=${encodeURIComponent(search)}`,
                { credentials: "include" }
            )
            const data = await response.json()
            setEntities(data.entities || [])
        } catch (error) {
            console.error("Failed to fetch entities:", error)
            setEntities([])
        } finally {
            setLoadingEntities(false)
        }
    }, [])

    useEffect(() => {
        if (id) fetchMenu()
    }, [id])

    useEffect(() => {
        fetchEntities(itemForm.link_type, entitySearch)
    }, [itemForm.link_type, entitySearch, fetchEntities])

    const handleLinkTypeChange = (type: string) => {
        setItemForm({
            ...itemForm,
            link_type: type,
            link_id: null,
            url: type === "home" ? "/" : type === "store" ? "/store" : "",
        })
        setEntitySearch("")
    }

    const handleEntitySelect = (entity: Entity) => {
        const urlMap: Record<string, string> = {
            collection: `/collections/${entity.handle}`,
            category: `/categories/${entity.handle}`,
            product: `/products/${entity.handle}`,
        }

        setItemForm({
            ...itemForm,
            link_id: entity.id,
            url: urlMap[itemForm.link_type] || entity.handle,
            title: itemForm.title || entity.label,
        })
    }

    const handleSaveItem = async () => {
        setSaving(true)
        try {
            const endpoint = editingItem
                ? `/admin/menu/${id}/items/${editingItem.id}`
                : `/admin/menu/${id}/items`

            const response = await fetch(endpoint, {
                method: editingItem ? "PUT" : "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...itemForm,
                    sort_order: editingItem?.sort_order ?? (menu?.items?.length || 0),
                }),
            })

            if (response.ok) {
                closeModal()
                fetchMenu()
            }
        } catch (error) {
            console.error("Failed to save item:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteItem = async (itemId: string) => {
        if (!confirm("Are you sure you want to delete this menu item?")) return

        try {
            await fetch(`/admin/menu/${id}/items/${itemId}`, {
                method: "DELETE",
                credentials: "include",
            })
            fetchMenu()
        } catch (error) {
            console.error("Failed to delete item:", error)
        }
    }

    const handleIndent = (item: MenuItem) => {
        // Find item index in the complete list
        const index = menu?.items.findIndex(i => i.id === item.id)
        if (index === undefined || index === -1 || !menu) return

        // Predecessor is the item visually above (index - 1)
        const predecessor = menu.items[index - 1]

        // Basic validation: 
        if (!predecessor) return

        // New parent is the predecessor
        const updatedItem = { ...item, parent_id: predecessor.id }

        const newItems = [...menu.items]
        newItems[index] = updatedItem

        setMenu({ ...menu, items: newItems })
        setIsDirty(true)
    }

    const handleOutdent = (item: MenuItem) => {
        if (!item.parent_id || !menu) return

        // Find current parent to get grandparent
        const currentParent = menu.items.find(i => i.id === item.parent_id)

        // New parent is grandparent
        const newParentId = currentParent?.parent_id || null

        const updatedItem = { ...item, parent_id: newParentId }

        const index = menu.items.findIndex(i => i.id === item.id)
        const newItems = [...menu.items]
        newItems[index] = updatedItem

        setMenu({ ...menu, items: newItems })
        setIsDirty(true)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over, delta } = event

        if (!menu || !over || active.id === over.id) {
            return
        }

        // Find involved items
        const activeItem = menu.items.find(i => i.id === active.id)
        const overItem = menu.items.find(i => i.id === over.id)

        if (!activeItem || !overItem) return

        // Calculate new order
        const oldIndex = menu.items.findIndex((item) => item.id === active.id)
        const newIndex = menu.items.findIndex((item) => item.id === over.id)

        // Create new array with moved item
        const newItems = arrayMove(menu.items, oldIndex, newIndex)

        // Indentation Logic
        // We look at the item *visually above* the new position to act as a potential parent
        const predecessor = newItems[newIndex - 1]

        let newParentId = activeItem.parent_id // Default: keep current parent logic (or adopt sibling's parent below)

        // Logic A: Standard Reorder (adopt sibling's parent)
        // If we just swapped with 'over', we naturally want its parent.
        // However, if we moved significantly X-wise, we override this.
        if (Math.abs(delta.x) < 35) {
            // If vertical move only, assume we want to be a sibling of the item we dropped on/near
            newParentId = overItem.parent_id
        }

        // Logic B: Indent (Nest)
        // If dragged right (> 35px) and there is a predecessor, nest under it
        if (delta.x > 35 && predecessor) {
            // Prevent infinite nesting depth if needed, or specific rules (e.g. max 2 levels)
            // Also prevent nesting under itself (impossible via index) or its own children (handled by sortable constraint usually)
            newParentId = predecessor.id
        }

        // Logic C: Outdent (Un-nest)
        // If dragged left (< -35px)
        if (delta.x < -35) {
            // If currently nested, move to grandparent
            if (activeItem.parent_id) {
                const currentParent = menu.items.find(i => i.id === activeItem.parent_id)
                newParentId = currentParent?.parent_id || null
            }
        }

        const updatedActiveItem = {
            ...activeItem,
            parent_id: newParentId
        }

        // Update the item in the array
        newItems[newIndex] = updatedActiveItem

        // CRITICAL: Update sort_order for everyone
        const itemsWithNewOrder = newItems.map((item, index) => ({
            ...item,
            sort_order: index
        }))

        // Update local state
        setMenu({ ...menu, items: itemsWithNewOrder })
        setIsDirty(true)
    }

    const handleSaveOrder = async () => {
        if (!menu) return
        setSaving(true)

        const reorderedItems = menu.items.map(item => ({
            id: item.id,
            sort_order: item.sort_order,
            parent_id: item.parent_id
        }))

        try {
            const res = await fetch(`/admin/menu/${id}/items/reorder`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: reorderedItems }),
            })

            if (res.ok) {
                setIsDirty(false)
                // Optional: Show toast success
            } else {
                console.error("Save failed")
            }
        } catch (error) {
            console.error("Failed to persist order:", error)
            fetchMenu() // Revert on error
        } finally {
            setSaving(false)
        }
    }
    const closeModal = () => {
        setShowItemModal(false)
        setEditingItem(null)
        setEntitySearch("")
        setEntities([])
    }

    const openEditModal = (item: MenuItem) => {
        setEditingItem(item)
        setItemForm({
            title: item.title,
            link_type: item.link_type || "custom",
            link_id: item.link_id,
            url: item.url,
            parent_id: item.parent_id,
            highlight: item.highlight,
            highlight_text: item.highlight_text || "",
            open_in_new_tab: item.open_in_new_tab,
            is_active: item.is_active,
        })
        setShowItemModal(true)
    }

    const openCreateModal = (parentId: string | null = null) => {
        setEditingItem(null)
        setItemForm({
            title: "",
            link_type: "custom",
            link_id: null,
            url: "",
            parent_id: parentId,
            highlight: false,
            highlight_text: "",
            open_in_new_tab: false,
            is_active: true,
        })
        setShowItemModal(true)
    }


    if (loading) {
        return (
            <Container className="p-6">
                <Text>Loading...</Text>
            </Container>
        )
    }

    if (!menu) {
        return (
            <Container className="p-6">
                <Text>Menu not found</Text>
            </Container>
        )
    }

    const sortedItems = [...(menu.items || [])].sort((a, b) => a.sort_order - b.sort_order)

    const rootItems = sortedItems.filter((item) => !item.parent_id)
    const getChildren = (parentId: string) => sortedItems.filter((item) => item.parent_id === parentId)

    const renderSortableTree = (items: MenuItem[], depth = 0): React.ReactNode[] => {
        return items.map((item) => {
            const children = getChildren(item.id)
            return (
                <SortableItem
                    key={item.id}
                    item={item}
                    depth={depth}
                    onEdit={openEditModal}
                    onDelete={handleDeleteItem}
                    onAddSub={openCreateModal}
                    onIndent={handleIndent}
                    onOutdent={handleOutdent}
                >
                    {children.length > 0 && (
                        <div className="border-l border-gray-100 ml-4">
                            {renderSortableTree(children, depth + 1)}
                        </div>
                    )}
                </SortableItem>
            )
        })
    }

    const allItemIds = sortedItems.map(i => i.id)

    // Update header to show "Unsaved changes" or "Save" button
    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
                <div>
                    <button
                        onClick={() => navigate("/app/menu")}
                        className="text-sm text-ui-fg-subtle hover:text-ui-fg-base mb-1 block appearance-none bg-transparent border-none p-0 cursor-pointer text-left"
                    >
                        ← Back to Menus
                    </button>
                    <div className="flex items-center gap-3">
                        <Heading level="h1">{menu.title}</Heading>
                        {isDirty && (
                            <Badge color="orange" size="small">Unsaved Changes</Badge>
                        )}
                    </div>
                    <Text className="text-ui-fg-subtle">
                        Handle: <code className="bg-ui-bg-subtle px-2 py-0.5 rounded">{menu.handle}</code>
                    </Text>
                </div>
                <div className="flex gap-2">
                    {isDirty && (
                        <Button
                            variant="primary"
                            onClick={handleSaveOrder}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Order"}
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => openCreateModal()}>
                        Add Menu Item
                    </Button>
                </div>
            </div>

            <div className="py-8 max-w-4xl mx-auto">
                {sortedItems.length === 0 ? (
                    <div className="text-center py-8">
                        <Text className="text-ui-fg-subtle">No menu items yet.</Text>
                        <Text className="text-ui-fg-subtle text-sm mt-2">
                            Add items to build your navigation menu.
                        </Text>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={allItemIds}
                            strategy={verticalListSortingStrategy}
                        >
                            <div>
                                {renderSortableTree(rootItems)}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {showItemModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <Heading level="h2" className="mb-4">
                            {editingItem ? "Edit Menu Item" : "Add Menu Item"}
                        </Heading>

                        <div className="space-y-4">
                            {/* Link Type */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Link Type</label>
                                <select
                                    value={itemForm.link_type}
                                    onChange={(e) => handleLinkTypeChange(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md bg-white"
                                >
                                    {LINK_TYPES.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Entity Picker for collection/category/product */}
                            {["collection", "category", "product"].includes(itemForm.link_type) && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Select {itemForm.link_type.charAt(0).toUpperCase() + itemForm.link_type.slice(1)}
                                    </label>
                                    <input
                                        type="text"
                                        value={entitySearch}
                                        onChange={(e) => setEntitySearch(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md mb-2"
                                        placeholder={`Search ${itemForm.link_type}s...`}
                                    />
                                    <div className="max-h-40 overflow-y-auto border rounded-md">
                                        {loadingEntities ? (
                                            <div className="p-2 text-center text-ui-fg-subtle">Loading...</div>
                                        ) : entities.length === 0 ? (
                                            <div className="p-2 text-center text-ui-fg-subtle">No results</div>
                                        ) : (
                                            entities.map((entity) => (
                                                <button
                                                    key={entity.id}
                                                    type="button"
                                                    onClick={() => handleEntitySelect(entity)}
                                                    className={`w-full text-left px-3 py-2 hover:bg-ui-bg-subtle ${itemForm.link_id === entity.id ? "bg-ui-bg-subtle-hover font-medium" : ""
                                                        }`}
                                                >
                                                    {entity.label}
                                                    <span className="text-xs text-ui-fg-subtle ml-2">/{entity.handle}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={itemForm.title}
                                    onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Menu item text"
                                />
                            </div>

                            {/* URL (only for custom) */}
                            {itemForm.link_type === "custom" && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">URL *</label>
                                    <input
                                        type="text"
                                        value={itemForm.url}
                                        onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="/store or https://..."
                                    />
                                </div>
                            )}

                            {/* URL Preview (for non-custom) */}
                            {itemForm.link_type !== "custom" && itemForm.url && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Generated URL</label>
                                    <code className="block w-full px-3 py-2 bg-ui-bg-subtle rounded-md text-sm">
                                        {itemForm.url}
                                    </code>
                                </div>
                            )}

                            {/* Parent Item (for nesting) */}
                            {itemForm.parent_id === null && !editingItem && rootItems.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Parent Item (optional)</label>
                                    <select
                                        value={itemForm.parent_id || ""}
                                        onChange={(e) => setItemForm({ ...itemForm, parent_id: e.target.value || null })}
                                        className="w-full px-3 py-2 border rounded-md bg-white"
                                    >
                                        <option value="">— Top Level —</option>
                                        {rootItems.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Highlight */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={itemForm.highlight}
                                    onChange={(e) => setItemForm({ ...itemForm, highlight: e.target.checked })}
                                    className="rounded"
                                />
                                <label className="text-sm">Highlight this item (e.g., "New" badge)</label>
                            </div>

                            {itemForm.highlight && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Badge Text</label>
                                    <input
                                        type="text"
                                        value={itemForm.highlight_text}
                                        onChange={(e) => setItemForm({ ...itemForm, highlight_text: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="New"
                                    />
                                </div>
                            )}

                            {/* Options */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={itemForm.open_in_new_tab}
                                        onChange={(e) => setItemForm({ ...itemForm, open_in_new_tab: e.target.checked })}
                                        className="rounded"
                                    />
                                    Open in new tab
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={itemForm.is_active}
                                        onChange={(e) => setItemForm({ ...itemForm, is_active: e.target.checked })}
                                        className="rounded"
                                    />
                                    Active
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSaveItem}
                                disabled={saving || !itemForm.title || (!itemForm.url && itemForm.link_type === "custom")}
                            >
                                {saving ? "Saving..." : editingItem ? "Update" : "Add Item"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    )
}

export default MenuDetailPage

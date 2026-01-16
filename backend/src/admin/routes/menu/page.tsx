import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { Container, Heading, Button, Table, Badge, Text, Prompt } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
type Menu = {
    id: string
    title: string
    handle: string
    is_active: boolean
    items?: any[]
}

const MenuListPage = () => {
    const navigate = useNavigate()
    const [menus, setMenus] = useState<Menu[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newMenu, setNewMenu] = useState({ title: "", handle: "" })
    const [creating, setCreating] = useState(false)

    const fetchMenus = async () => {
        try {
            const response = await fetch("/admin/menu", {
                credentials: "include",
            })
            const data = await response.json()
            setMenus(data.menus || [])
        } catch (error) {
            console.error("Failed to fetch menus:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMenus()
    }, [])

    const handleCreateMenu = async () => {
        if (!newMenu.title || !newMenu.handle) return

        setCreating(true)
        try {
            const response = await fetch("/admin/menu", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMenu),
            })

            if (response.ok) {
                setShowCreateModal(false)
                setNewMenu({ title: "", handle: "" })
                fetchMenus()
            }
        } catch (error) {
            console.error("Failed to create menu:", error)
        } finally {
            setCreating(false)
        }
    }

    // We'll use the Prompt component directly in the render
    const handleDeleteMenu = async (id: string) => {
        try {
            await fetch(`/admin/menu/${id}`, {
                method: "DELETE",
                credentials: "include",
            })
            fetchMenus()
        } catch (error) {
            console.error("Failed to delete menu:", error)
        }
    }

    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h1">Navigation Menus</Heading>
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    Create Menu
                </Button>
            </div>

            <div className="px-6 py-4">
                {loading ? (
                    <Text className="text-ui-fg-subtle">Loading...</Text>
                ) : menus.length === 0 ? (
                    <div className="text-center py-8">
                        <Text className="text-ui-fg-subtle">No menus created yet.</Text>
                        <Text className="text-ui-fg-subtle text-sm mt-2">
                            Create a menu to manage your storefront navigation.
                        </Text>
                    </div>
                ) : (
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Title</Table.HeaderCell>
                                <Table.HeaderCell>Handle</Table.HeaderCell>
                                <Table.HeaderCell>Items</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {menus.map((menu) => (
                                <Table.Row
                                    key={menu.id}
                                    className="cursor-pointer hover:bg-ui-bg-subtle"
                                    onClick={() => navigate(menu.id)}
                                >
                                    <Table.Cell>
                                        <span className="font-medium text-ui-fg-base">
                                            {menu.title}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <code className="text-sm bg-ui-bg-subtle px-2 py-1 rounded">
                                            {menu.handle}
                                        </code>
                                    </Table.Cell>
                                    <Table.Cell>{menu.items?.length || 0} items</Table.Cell>
                                    <Table.Cell>
                                        <Badge color={menu.is_active ? "green" : "grey"}>
                                            {menu.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="text-right">
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Prompt>
                                                <Prompt.Trigger asChild>
                                                    <Button
                                                        variant="secondary"
                                                        size="small"
                                                    >
                                                        Delete
                                                    </Button>
                                                </Prompt.Trigger>
                                                <Prompt.Content>
                                                    <Prompt.Header>
                                                        <Prompt.Title>Delete Menu</Prompt.Title>
                                                        <Prompt.Description>
                                                            Are you sure? This cannot be undone.
                                                        </Prompt.Description>
                                                    </Prompt.Header>
                                                    <Prompt.Footer>
                                                        <Prompt.Cancel>Cancel</Prompt.Cancel>
                                                        <Prompt.Action onClick={() => handleDeleteMenu(menu.id)}>Delete</Prompt.Action>
                                                    </Prompt.Footer>
                                                </Prompt.Content>
                                            </Prompt>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </div>

            {/* Create Menu Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <Heading level="h2" className="mb-4">Create Menu</Heading>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newMenu.title}
                                    onChange={(e) => setNewMenu({ ...newMenu, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Main Menu"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Handle</label>
                                <input
                                    type="text"
                                    value={newMenu.handle}
                                    onChange={(e) => setNewMenu({ ...newMenu, handle: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="main-menu"
                                />
                                <Text className="text-xs text-ui-fg-subtle mt-1">
                                    Used to fetch the menu from the storefront
                                </Text>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleCreateMenu}
                                disabled={creating || !newMenu.title || !newMenu.handle}
                            >
                                {creating ? "Creating..." : "Create"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Navigation",
    icon: ChatBubbleLeftRight,
})

export default MenuListPage

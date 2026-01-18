import { Container, Heading, Button, Input, Textarea, Label, Prompt } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const EditVendorPage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        handle: "",
        description: "",
        logo: "",
        website: "",
        email: "",
        phone: "",
        address: "",
        is_active: true,
    })

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const response = await fetch(`/admin/vendors/${id}`, {
                    credentials: "include",
                })
                const data = await response.json()
                const vendor = data.vendor

                setFormData({
                    name: vendor.name || "",
                    handle: vendor.handle || "",
                    description: vendor.description || "",
                    logo: vendor.logo || "",
                    website: vendor.website || "",
                    email: vendor.email || "",
                    phone: vendor.phone || "",
                    address: vendor.address || "",
                    is_active: vendor.is_active ?? true,
                })
            } catch (error) {
                console.error("Failed to fetch vendor:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchVendor()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const response = await fetch(`/admin/vendors/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                navigate("/vendors")
            }
        } catch (error) {
            console.error("Failed to update vendor:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        try {
            await fetch(`/admin/vendors/${id}`, {
                method: "DELETE",
                credentials: "include",
            })
            navigate("/vendors")
        } catch (error) {
            console.error("Failed to delete vendor:", error)
        }
    }

    if (loading) {
        return <Container className="p-6">Loading...</Container>
    }

    return (
        <Container className="p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <Heading level="h1">Edit Vendor</Heading>
                <div className="flex gap-2">
                    <Prompt>
                        <Prompt.Trigger asChild>
                            <Button variant="danger">Delete</Button>
                        </Prompt.Trigger>
                        <Prompt.Content>
                            <Prompt.Header>
                                <Prompt.Title>Delete Vendor</Prompt.Title>
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

                    <Button variant="secondary" onClick={() => navigate("/vendors")}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={saving || !formData.name}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-2xl">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="handle">Handle *</Label>
                        <Input
                            id="handle"
                            value={formData.handle}
                            onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="logo">Logo URL</Label>
                        <Input
                            id="logo"
                            value={formData.logo}
                            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            rows={2}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="rounded"
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>
                </div>
            </form>
        </Container>
    )
}

export default EditVendorPage

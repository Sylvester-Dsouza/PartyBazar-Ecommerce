import { Container, Heading, Button, Input, Textarea, Label } from "@medusajs/ui"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const CreateVendorPage = () => {
    const navigate = useNavigate()
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const response = await fetch("/admin/vendors", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                navigate("/vendors")
            }
        } catch (error) {
            console.error("Failed to create vendor:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleNameChange = (value: string) => {
        setFormData({
            ...formData,
            name: value,
            handle: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        })
    }

    return (
        <Container className="p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <Heading level="h1">Create Vendor</Heading>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => navigate("/vendors")}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={saving || !formData.name}>
                        {saving ? "Creating..." : "Create Vendor"}
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
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Vendor Name"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="handle">Handle *</Label>
                        <Input
                            id="handle"
                            value={formData.handle}
                            onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                            placeholder="vendor-handle"
                            required
                        />
                        <p className="text-xs text-ui-fg-subtle mt-1">
                            Unique identifier for the vendor
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of the vendor..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="logo">Logo URL</Label>
                        <Input
                            id="logo"
                            value={formData.logo}
                            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                            placeholder="https://..."
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
                                placeholder="vendor@example.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 234 567 890"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="https://vendor-website.com"
                        />
                    </div>

                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Full address..."
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

export default CreateVendorPage

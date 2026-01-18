import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { Container, Heading, Select, Button, Text, Badge } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Vendor = {
    id: string
    name: string
    handle: string
}

const ProductVendorWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [selectedVendorId, setSelectedVendorId] = useState<string>("")
    const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all vendors
                const vendorsRes = await fetch("/admin/vendors", {
                    credentials: "include",
                })
                const vendorsData = await vendorsRes.json()
                setVendors(vendorsData.vendors || [])

                // Get current vendor from product metadata
                const vendorId = data.metadata?.vendor_id as string
                if (vendorId) {
                    setSelectedVendorId(vendorId)
                    const vendor = vendorsData.vendors?.find((v: Vendor) => v.id === vendorId)
                    if (vendor) {
                        setCurrentVendor(vendor)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch vendors:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [data.id, data.metadata])

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch(`/admin/products/${data.id}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    metadata: {
                        ...data.metadata,
                        vendor_id: selectedVendorId || null,
                    },
                }),
            })

            if (response.ok) {
                const vendor = vendors.find((v) => v.id === selectedVendorId)
                setCurrentVendor(vendor || null)
            }
        } catch (error) {
            console.error("Failed to save vendor:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleRemove = async () => {
        setSaving(true)
        try {
            const newMetadata = { ...data.metadata }
            delete newMetadata.vendor_id

            await fetch(`/admin/products/${data.id}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    metadata: newMetadata,
                }),
            })

            setSelectedVendorId("")
            setCurrentVendor(null)
        } catch (error) {
            console.error("Failed to remove vendor:", error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <Container className="divide-y p-0">
                <div className="px-6 py-4">
                    <Heading level="h2">Vendor</Heading>
                    <Text className="text-ui-fg-subtle">Loading...</Text>
                </div>
            </Container>
        )
    }

    return (
        <Container className="divide-y p-0">
            <div className="px-6 py-4">
                <Heading level="h2" className="mb-4">Vendor</Heading>

                {currentVendor ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-ui-bg-subtle rounded-lg">
                            <div>
                                <Text className="font-medium">{currentVendor.name}</Text>
                                <Text className="text-ui-fg-subtle text-sm">{currentVendor.handle}</Text>
                            </div>
                            <Badge color="green">Assigned</Badge>
                        </div>
                        <div className="flex gap-2">
                            <Select
                                value={selectedVendorId}
                                onValueChange={setSelectedVendorId}
                            >
                                <Select.Trigger>
                                    <Select.Value placeholder="Change vendor..." />
                                </Select.Trigger>
                                <Select.Content>
                                    {vendors.map((vendor) => (
                                        <Select.Item key={vendor.id} value={vendor.id}>
                                            {vendor.name}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select>
                            {selectedVendorId !== currentVendor.id && selectedVendorId && (
                                <Button
                                    variant="primary"
                                    size="small"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Update"}
                                </Button>
                            )}
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={handleRemove}
                                disabled={saving}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : vendors.length === 0 ? (
                    <div className="text-center py-4">
                        <Text className="text-ui-fg-subtle">No vendors available.</Text>
                        <Text className="text-ui-fg-subtle text-sm">
                            Create vendors first in the Vendors section.
                        </Text>
                    </div>
                ) : (
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <Select
                                value={selectedVendorId}
                                onValueChange={setSelectedVendorId}
                            >
                                <Select.Trigger>
                                    <Select.Value placeholder="Select a vendor..." />
                                </Select.Trigger>
                                <Select.Content>
                                    {vendors.map((vendor) => (
                                        <Select.Item key={vendor.id} value={vendor.id}>
                                            {vendor.name}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select>
                        </div>
                        <Button
                            variant="primary"
                            size="small"
                            onClick={handleSave}
                            disabled={saving || !selectedVendorId}
                        >
                            {saving ? "Saving..." : "Assign Vendor"}
                        </Button>
                    </div>
                )}
            </div>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "product.details.side.before",
})

export default ProductVendorWidget

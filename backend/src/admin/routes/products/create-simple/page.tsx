import { Button, Input, Label, Textarea, Text, toast, Heading } from "@medusajs/ui"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft } from "@medusajs/icons"
import { Container } from "../../../components/container"
import { Header } from "../../../components/header"
import { TwoColumnLayout } from "../../../layouts/two-column"

const CreateSimpleProductPage = () => {
    const navigate = useNavigate()
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        sku: "",
        price: "",
        inventory: "0",
        description: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        if (!formData.title || !formData.price) {
            toast.error("Title and Price are required")
            return
        }

        setIsSaving(true)
        try {
            // 1. Fetch Defaults with robust error handling
            const fetchJson = async (url: string) => {
                const res = await fetch(url, { credentials: "include" })
                if (!res.ok) {
                    const text = await res.text()
                    console.error(`Fetch failed for ${url}:`, res.status, text)
                    throw new Error(`Failed to fetch ${url} (Status: ${res.status})`)
                }
                return res.json()
            }

            const storeData = await fetchJson("/admin/stores")
            const shippingData = await fetchJson("/admin/shipping-profiles")
            const locationData = await fetchJson("/admin/stock-locations")
            const salesChannelData = await fetchJson("/admin/sales-channels")

            const store = storeData.stores?.[0]
            const defaultShippingProfile = shippingData.shipping_profiles?.[0]
            const defaultLocation = locationData.stock_locations?.[0]
            // STRICT LINKING: Use the very first sales channel found
            const defaultSalesChannel = salesChannelData.sales_channels?.[0]

            if (!defaultShippingProfile) throw new Error("No shipping profile found")
            if (!defaultLocation) throw new Error("No stock location found")
            if (!defaultSalesChannel) throw new Error("No sales channel found")

            // 2. Create Product
            // Map sales channels to payload for atomic linking
            const salesChannelsPayload = salesChannelData.sales_channels?.map((sc: any) => ({ id: sc.id })) || []
            console.log("Creating product with sales channels:", salesChannelsPayload)

            const productRes = await fetch("/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    handle: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    status: "published",
                    shipping_profile_id: defaultShippingProfile.id,
                    sales_channels: salesChannelsPayload,
                    options: [
                        {
                            title: "Default Option",
                            values: [formData.title]
                        }
                    ],
                    variants: [
                        {
                            title: formData.title,
                            sku: formData.sku || undefined,
                            manage_inventory: true,
                            options: { "Default Option": formData.title },
                            prices: [
                                {
                                    amount: Number(formData.price),
                                    currency_code: "inr"
                                }
                            ]
                        }
                    ]
                })
            })

            if (!productRes.ok) {
                const error = await productRes.json()
                throw new Error(error.message || "Failed to create product")
            }

            const { product } = await productRes.json()
            const variantId = product.variants?.[0]?.id

            // 3. Link to Inventory Location
            if (variantId && defaultLocation) {
                const variantRes = await fetchJson(`/admin/products/${product.id}/variants/${variantId}?fields=inventory_items.*`)
                const linkObject = variantRes.variant?.inventory_items?.[0]
                const inventoryItemId = linkObject?.inventory_item_id

                if (inventoryItemId) {
                    await fetch(`/admin/inventory-items/${inventoryItemId}/location-levels`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                            location_id: defaultLocation.id,
                            stocked_quantity: Number(formData.inventory) || 0
                        })
                    })
                }
            }

            toast.success("Product created successfully")
            navigate("/products")
        } catch (e: any) {
            console.error(e)
            toast.error(e.message || "Failed to create product")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-ui-bg-subtle p-8">
            {/* Page Header - Containerized with Actions */}
            <Container className="mb-6">
                <div className="flex items-center justify-between px-6 py-4">
                    <Heading level="h1" className="text-2xl font-medium text-ui-fg-base">
                        Create simple product
                    </Heading>
                    <div className="flex items-center gap-x-2">
                        <Link to="/products">
                            <Button
                                variant="secondary"
                                size="small"
                            >
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            isLoading={isSaving}
                            variant="primary"
                            size="small"
                        >
                            Create Product
                        </Button>
                    </div>
                </div>
            </Container>

            <TwoColumnLayout
                firstCol={
                    <div className="flex flex-col gap-y-4">
                        <Container>
                            <Header title="Product Details" />
                            <div className="p-6 grid gap-y-6">
                                <div className="grid gap-y-2">
                                    <Label htmlFor="title">Product Name</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g Blue Balloon"
                                    />
                                </div>

                                <div className="grid gap-y-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input
                                        id="sku"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        placeholder="e.g BALL-BLU-01"
                                    />
                                </div>

                                <div className="grid gap-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Add a short description..."
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </Container>
                    </div>
                }
                secondCol={
                    <div className="flex flex-col gap-y-4">
                        <Container>
                            <Header title="Pricing & Inventory" />
                            <div className="p-6 grid grid-cols-1 gap-y-4">
                                <div className="grid gap-y-2">
                                    <Label htmlFor="price">Price (INR)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="e.g 450"
                                    />
                                </div>
                                <div className="grid gap-y-2">
                                    <Label htmlFor="inventory">Inventory (On Hand)</Label>
                                    <Input
                                        id="inventory"
                                        name="inventory"
                                        type="number"
                                        value={formData.inventory}
                                        onChange={handleChange}
                                        placeholder="e.g 10"
                                    />
                                </div>
                            </div>
                        </Container>
                    </div>
                }
            />
        </div>
    )
}

export default CreateSimpleProductPage

import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Table, Input, Toaster, toast, Button, Avatar, Text } from "@medusajs/ui"
import { TagSolid } from "@medusajs/icons"
import { useEffect, useState, useMemo } from "react"

type InventoryLevel = {
    id: string
    location_id: string
    stocked_quantity: number
    reserved_quantity: number
    incoming_quantity: number
}

type InventoryItem = {
    id: string
    sku: string
    location_levels: InventoryLevel[]
}

type Price = {
    id: string
    currency_code: string
    amount: number
}

type Variant = {
    id: string
    title: string
    sku: string
    inventory_items?: {
        inventory_item_id: string
        inventory: InventoryItem
    }[]
    prices: Price[]
}

type Product = {
    id: string
    title: string
    thumbnail: string
    handle: string
    variants: Variant[]
}

type StockLocation = {
    id: string
    name: string
}

const FastInventoryPage = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [locations, setLocations] = useState<StockLocation[]>([])
    const [selectedLocationId, setSelectedLocationId] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)
    const [offset, setOffset] = useState(0)
    const [query, setQuery] = useState("")
    const limit = 20

    // Fetch Initial Data
    useEffect(() => {
        const init = async () => {
            try {
                // 1. Fetch Locations
                const locRes = await fetch("/admin/stock-locations", { credentials: "include" })
                const locData = await locRes.json()
                const locs = locData.stock_locations || []
                setLocations(locs)
                if (locs.length > 0) setSelectedLocationId(locs[0].id)

                // 2. Fetch Products
                await fetchProducts(0, "")
            } catch (e) {
                console.error(e)
                toast.error("Failed to load data")
            } finally {
                setIsLoading(false)
            }
        }
        init()
    }, [])

    // Debounced Search
    useEffect(() => {
        const handler = setTimeout(() => {
            setOffset(0)
            fetchProducts(0, query)
        }, 600)
        return () => clearTimeout(handler)
    }, [query])

    const fetchProducts = async (newOffset: number, searchQuery: string) => {
        setIsLoading(true)
        try {
            if (searchQuery) {
                // Fetch more products to search through (up to 100)
                const res = await fetch(`/admin/products?limit=100&offset=0&fields=id,title,thumbnail,variants.id,variants.title,variants.sku,variants.prices.*&expand=variants,variants.prices`, { credentials: "include" })
                const data = await res.json()
                const allProducts = data.products as Product[]

                // Filter client-side by product name OR variant SKU
                const searchLower = searchQuery.toLowerCase()
                const filtered = allProducts.filter(product => {
                    // Check product title
                    if (product.title.toLowerCase().includes(searchLower)) return true

                    // Check any variant SKU
                    return product.variants?.some(variant =>
                        variant.sku?.toLowerCase().includes(searchLower)
                    )
                })

                setProducts(filtered)
                setOffset(0)
            } else {
                // No search - normal pagination
                const res = await fetch(`/admin/products?limit=${limit}&offset=${newOffset}&fields=id,title,thumbnail,variants.id,variants.title,variants.sku,variants.prices.*&expand=variants,variants.prices`, { credentials: "include" })
                const data = await res.json()
                setProducts(data.products || [])
                setOffset(newOffset)
            }
        } catch (e) {
            console.error(e)
            toast.error("Failed to fetch products")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container className="p-0 h-full flex flex-col overflow-hidden">
            <Toaster />
            <div className="p-6 border-b flex justify-between items-center">
                <Heading>Fast Inventory</Heading>
                <div className="flex gap-2 items-center">
                    <div className="w-64">
                        <Input
                            placeholder="Search by Name or SKU..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            size="small"
                        />
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => fetchProducts(Math.max(0, offset - limit), query)}
                        disabled={offset === 0 || isLoading}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => fetchProducts(offset + limit, query)}
                        disabled={products.length < limit || isLoading}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Product</Table.HeaderCell>
                            <Table.HeaderCell>SKU</Table.HeaderCell>
                            <Table.HeaderCell>Unavailable</Table.HeaderCell>
                            <Table.HeaderCell>Available</Table.HeaderCell>
                            <Table.HeaderCell>On Hand</Table.HeaderCell>
                            <Table.HeaderCell>Price (INR)</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {products.map(product =>
                            product.variants.map(variant => (
                                <VariantRow
                                    key={variant.id}
                                    product={product}
                                    variant={variant}
                                    locationId={selectedLocationId}
                                />
                            ))
                        )}
                        {!isLoading && products.length === 0 && (
                            <Table.Row>
                                <td colSpan={7} className="text-center p-4 text-ui-fg-subtle text-small">
                                    No products found.
                                </td>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>
        </Container>
    )
}

// Dedicated Row Component to handle isolated Inventory Fetching/Updating
const VariantRow = ({ product, variant, locationId }: { product: Product, variant: Variant, locationId: string }) => {
    const [inventoryItem, setInventoryItem] = useState<InventoryItem | null>(null)
    const [price, setPrice] = useState<number | string>("")

    // Inventory Local State for Inputs
    const [onHand, setOnHand] = useState<number | string>("")
    const [sku, setSku] = useState<string>("")

    // Tracking for changes
    const [initialOnHand, setInitialOnHand] = useState<number | string>("")
    const [initialPrice, setInitialPrice] = useState<number | string>("")
    const [initialSku, setInitialSku] = useState<string>("")
    const [isSaving, setIsSaving] = useState(false)

    // Derived
    const reserved = useMemo(() => {
        return inventoryItem?.location_levels?.[0]?.reserved_quantity || 0
    }, [inventoryItem])

    const available = useMemo(() => {
        const stocked = typeof onHand === 'number' ? onHand : 0
        return Math.max(0, stocked - reserved) // simple calc
    }, [onHand, reserved])

    const hasChanges = useMemo(() => {
        return (onHand !== initialOnHand) || (price !== initialPrice) || (sku !== initialSku)
    }, [onHand, initialOnHand, price, initialPrice, sku, initialSku])

    useEffect(() => {
        // Init SKU
        setSku(variant.sku || "")
        setInitialSku(variant.sku || "")

        if (!locationId) return

        const fetchData = async () => {
            // Fetch Inventory Item
            if (variant.sku) {
                try {
                    const res = await fetch(`/admin/inventory-items?sku=${variant.sku}`, { credentials: "include" })
                    if (!res.ok) {
                        console.error(`Failed to fetch inventory item for SKU ${variant.sku}:`, res.statusText)
                        return
                    }
                    const data = await res.json()
                    console.log(`Inventory data for SKU ${variant.sku}:`, data)
                    const item = data.inventory_items?.[0]
                    if (item) {
                        const level = item.location_levels?.find((l: any) => l.location_id === locationId)
                        const stock = level ? level.stocked_quantity : 0
                        setInventoryItem({ ...item, location_levels: level ? [level] : [] })
                        setOnHand(stock)
                        setInitialOnHand(stock)
                    } else {
                        console.warn(`No inventory item found for SKU: ${variant.sku}`)
                    }
                } catch (e) {
                    console.error(`Error fetching inventory for SKU ${variant.sku}:`, e)
                }
            }

            // Set Price (find INR or first)
            const p = variant.prices?.find(p => p.currency_code === 'inr') || variant.prices?.[0]
            if (p) {
                setPrice(p.amount)
                setInitialPrice(p.amount)
            }
        }

        fetchData()
    }, [variant.id, locationId, variant.sku])

    const handleSave = async () => {
        setIsSaving(true)
        console.log("Saving changes for variant:", variant.sku || variant.id)
        try {
            // Update Inventory
            if (inventoryItem && onHand !== initialOnHand) {
                console.log(`Updating inventory for ${inventoryItem.id} at ${locationId} to ${onHand}`)
                const res = await fetch(`/admin/inventory-items/${inventoryItem.id}/location-levels/${locationId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        stocked_quantity: Number(onHand)
                    })
                })

                if (!res.ok) {
                    const error = await res.json()
                    console.error("Inventory update response error:", error)
                    throw new Error(error.message || "Failed to update inventory level")
                }
                console.log("Inventory update successful")
            }

            // Update Price & SKU
            const shouldUpdateVariant = (price !== initialPrice) || (sku !== initialSku)

            if (shouldUpdateVariant) {
                console.log(`Updating variant details: price=${price}, sku=${sku}`)
                const currencyToUpdate = 'inr'
                const existingPrices = variant.prices || []

                const otherPrices = existingPrices.filter(p => p.currency_code !== currencyToUpdate)
                const newPrices = [
                    ...otherPrices.map(p => ({ amount: p.amount, currency_code: p.currency_code })),
                    { amount: Number(price), currency_code: currencyToUpdate }
                ]

                const payload: any = {}
                if (price !== initialPrice) payload.prices = newPrices
                if (sku !== initialSku) payload.sku = sku

                const res = await fetch(`/admin/products/${product.id}/variants/${variant.id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(payload)
                })

                if (!res.ok) {
                    const error = await res.json()
                    console.error("Variant update response error:", error)
                    throw new Error(error.message || "Failed to update variant")
                }
                console.log("Variant update successful")
            }

            // Sync initial state
            setInitialOnHand(onHand)
            setInitialPrice(price)
            setInitialSku(sku)

            toast.success("Saved")
        } catch (e: any) {
            console.error("Save error:", e)
            toast.error(e.message || "Failed to save")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Table.Row>
            <Table.Cell className="flex items-center gap-3">
                {product.thumbnail ? (
                    <Avatar src={product.thumbnail} fallback={product.title[0]} size="small" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-medium">
                        {product.title[0]}
                    </div>
                )}
                <div className="flex flex-col">
                    <Text size="small" weight="plus">{product.title}</Text>
                    {variant.title !== 'Default Variant' && <Text size="xsmall" className="text-ui-fg-subtle">{variant.title}</Text>}
                </div>
            </Table.Cell>
            <Table.Cell>
                <Input
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    size="small"
                    className="w-32"
                />
            </Table.Cell>
            <Table.Cell>
                <Text size="small" className="text-ui-fg-subtle">{reserved}</Text>
            </Table.Cell>
            <Table.Cell>
                <Input
                    value={available}
                    onChange={(e) => {
                        const newAvail = Number(e.target.value)
                        setOnHand(newAvail + reserved)
                    }}
                    type="number"
                    className="w-20"
                />
            </Table.Cell>
            <Table.Cell>
                <Input
                    value={onHand}
                    onChange={(e) => setOnHand(Number(e.target.value))}
                    type="number"
                    className="w-20"
                />
            </Table.Cell>
            <Table.Cell>
                <Input
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    type="number"
                    className="w-24"
                />
            </Table.Cell>
            <Table.Cell>
                <Button size="small" onClick={handleSave} disabled={!hasChanges || isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </Table.Cell>
        </Table.Row>
    )
}

export const config = defineRouteConfig({
    label: "Fast Inventory",
    icon: TagSolid,
    nested: "/inventory",
})

export default FastInventoryPage

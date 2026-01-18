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
                await fetchProducts(0)
            } catch (e) {
                console.error(e)
                toast.error("Failed to load data")
            } finally {
                setIsLoading(false)
            }
        }
        init()
    }, [])

    const fetchProducts = async (newOffset: number) => {
        setIsLoading(true)
        try {
            const res = await fetch(`/admin/products?limit=${limit}&offset=${newOffset}&fields=id,title,thumbnail,handle,variants.id,variants.title,variants.sku,variants.prices.*&expand=variants,variants.prices`, { credentials: "include" })
            const data = await res.json()
            let prods = data.products as Product[]
            setProducts(prods)
            setOffset(newOffset)
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
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => fetchProducts(Math.max(0, offset - limit))}
                        disabled={offset === 0 || isLoading}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => fetchProducts(offset + limit)}
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
                    const data = await res.json()
                    const item = data.inventory_items?.[0]
                    if (item) {
                        const level = item.location_levels?.find((l: any) => l.location_id === locationId)
                        const stock = level ? level.stocked_quantity : 0
                        setInventoryItem({ ...item, location_levels: level ? [level] : [] })
                        setOnHand(stock)
                        setInitialOnHand(stock)
                    }
                } catch (e) {
                    // ignore
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
        try {
            // Update Inventory
            if (inventoryItem && onHand !== initialOnHand) {
                await fetch(`/admin/inventory-items/${inventoryItem.id}/location-levels/${locationId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        stocked_quantity: Number(onHand)
                    })
                })
            }

            // Update Price & SKU
            const shouldUpdateVariant = (price !== initialPrice) || (sku !== initialSku)

            if (shouldUpdateVariant) {
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

                await fetch(`/admin/products/${product.id}/variants/${variant.id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(payload)
                })
            }

            // Sync initial state
            setInitialOnHand(onHand)
            setInitialPrice(price)
            setInitialSku(sku)

            toast.success("Saved")
        } catch (e) {
            console.error(e)
            toast.error("Failed to save")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Table.Row>
            <Table.Cell className="flex items-center gap-3">
                {product.thumbnail && <Avatar src={product.thumbnail} fallback={product.title[0]} size="small" />}
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
})

export default FastInventoryPage

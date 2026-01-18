"use client"

import { useState, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@lib/data/cart"

// Party categories with modern icons
const PARTY_CATEGORIES = [
    { id: "balloons", name: "Balloons", icon: "🎈" },
    { id: "decorations", name: "Decorations", icon: "✨" },
    { id: "tableware", name: "Tableware", icon: "🍽️" },
    { id: "party-favors", name: "Party Favors", icon: "🎁" },
    { id: "banners", name: "Banners", icon: "🎊" },
    { id: "cake-toppers", name: "Cake Toppers", icon: "🎂" },
]

type SelectedItem = {
    productId: string
    variantId: string
    quantity: number
    category: string
    title: string
    price: number
    thumbnail?: string | null
}

export default function PlanMyPartyClient({
    products,
    countryCode,
}: {
    products: HttpTypes.StoreProduct[]
    countryCode: string
}) {
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
    const [activeCategory, setActiveCategory] = useState<string>("balloons")
    const [searchQuery, setSearchQuery] = useState("")
    const [isAdding, setIsAdding] = useState(false)

    // Calculate total
    const total = useMemo(() => {
        return selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }, [selectedItems])

    // Filter products by active category and search
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const title = product.title?.toLowerCase() || ""
            const search = searchQuery.toLowerCase()

            // Filter by search
            if (search && !title.includes(search)) return false

            // Filter by category
            switch (activeCategory) {
                case "balloons":
                    return title.includes("balloon") || title.includes("helium")
                case "decorations":
                    return title.includes("decoration") || title.includes("ornament") || title.includes("glass ball")
                case "tableware":
                    return title.includes("plate") || title.includes("cup") || title.includes("table") || title.includes("napkin")
                case "party-favors":
                    return title.includes("favor") || title.includes("gift")
                case "banners":
                    return title.includes("banner") || title.includes("sign") || title.includes("pick")
                case "cake-toppers":
                    return title.includes("cake") || title.includes("topper")
                default:
                    return false
            }
        })
    }, [products, activeCategory, searchQuery])

    const addItem = (product: HttpTypes.StoreProduct) => {
        const variant = product.variants?.[0]
        if (!variant) return

        const price = variant.calculated_price?.calculated_amount || 0

        setSelectedItems(prev => {
            const existing = prev.find(item => item.variantId === variant.id)
            if (existing) {
                return prev.map(item =>
                    item.variantId === variant.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [
                ...prev,
                {
                    productId: product.id!,
                    variantId: variant.id!,
                    quantity: 1,
                    category: activeCategory,
                    title: product.title || "",
                    price,
                    thumbnail: product.thumbnail,
                },
            ]
        })
    }

    const removeItem = (variantId: string) => {
        setSelectedItems(prev => prev.filter(item => item.variantId !== variantId))
    }

    const updateQuantity = (variantId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(variantId)
            return
        }
        setSelectedItems(prev =>
            prev.map(item =>
                item.variantId === variantId ? { ...item, quantity } : item
            )
        )
    }

    const handleAddAllToCart = async () => {
        setIsAdding(true)
        try {
            for (const item of selectedItems) {
                await addToCart({
                    variantId: item.variantId,
                    quantity: item.quantity,
                    countryCode,
                })
            }
            setSelectedItems([])
            alert("🎉 All items added to cart!")
        } catch (error) {
            console.error("Failed to add items to cart:", error)
            alert("Failed to add items. Please try again.")
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Plan My Party</h1>
                            <p className="text-gray-600 mt-1">Build your perfect party setup</p>
                        </div>
                        {selectedItems.length > 0 && (
                            <div className="hidden md:flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">
                                        {selectedItems.reduce((sum, item) => sum + item.quantity, 0)} items
                                    </p>
                                    <p className="text-xl font-bold text-gray-900">
                                        ₹{(total / 100).toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    onClick={handleAddAllToCart}
                                    disabled={isAdding}
                                    className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                >
                                    {isAdding ? "Adding..." : "Add to Cart"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {PARTY_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveCategory(cat.id)
                                    setSearchQuery("")
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeCategory === cat.id
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span className="font-medium">{cat.name}</span>
                                {selectedItems.filter(item => item.category === cat.id).length > 0 && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === cat.id ? "bg-white text-black" : "bg-black text-white"
                                        }`}>
                                        {selectedItems.filter(item => item.category === cat.id).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Products Section */}
                    <div className="lg:col-span-2">
                        {/* Search */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                        </div>

                        {/* Products Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {filteredProducts.map(product => {
                                    const variant = product.variants?.[0]
                                    const isSelected = selectedItems.some(
                                        item => item.variantId === variant?.id
                                    )
                                    const selectedItem = selectedItems.find(
                                        item => item.variantId === variant?.id
                                    )

                                    return (
                                        <div
                                            key={product.id}
                                            className={`bg-white rounded-lg overflow-hidden border-2 transition-all ${isSelected
                                                    ? "border-black shadow-lg"
                                                    : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            {/* Image */}
                                            <div className="aspect-square bg-gray-100 relative">
                                                {product.thumbnail ? (
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.title || ""}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-4xl">
                                                        {PARTY_CATEGORIES.find(c => c.id === activeCategory)?.icon}
                                                    </div>
                                                )}
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                                        ✓
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="p-4">
                                                <h3 className="font-medium text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                                                    {product.title}
                                                </h3>
                                                <p className="text-lg font-bold mb-3">
                                                    ₹{((variant?.calculated_price?.calculated_amount || 0) / 100).toFixed(2)}
                                                </p>

                                                {/* Actions */}
                                                {isSelected ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(variant!.id!, (selectedItem?.quantity || 1) - 1)}
                                                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded font-bold"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="flex-1 text-center font-bold">
                                                            {selectedItem?.quantity || 1}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(variant!.id!, (selectedItem?.quantity || 1) + 1)}
                                                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded font-bold"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => addItem(product)}
                                                        className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                                    >
                                                        Add
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg">No products found</p>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="mt-4 text-black hover:underline"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Cart Sidebar - Desktop */}
                    <div className="hidden lg:block">
                        <div className="sticky top-32 bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-xl font-bold mb-4">Your Selection</h3>

                            {selectedItems.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <p className="text-4xl mb-2">🛒</p>
                                    <p className="text-sm">No items selected</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                                        {selectedItems.map(item => (
                                            <div key={item.variantId} className="flex items-start gap-3 pb-3 border-b">
                                                <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                                    {item.thumbnail ? (
                                                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl">
                                                            {PARTY_CATEGORIES.find(c => c.id === item.category)?.icon}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{item.title}</p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Qty: {item.quantity} × ₹{(item.price / 100).toFixed(2)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.variantId)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4 mb-4">
                                        <div className="flex justify-between items-center text-lg font-bold">
                                            <span>Total</span>
                                            <span>₹{(total / 100).toFixed(2)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {selectedItems.reduce((sum, item) => sum + item.quantity, 0)} items
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleAddAllToCart}
                                        disabled={isAdding}
                                        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors mb-2"
                                    >
                                        {isAdding ? "Adding..." : "Add All to Cart"}
                                    </button>

                                    <button
                                        onClick={() => setSelectedItems([])}
                                        className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Cart Footer */}
            {selectedItems.length > 0 && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-600">
                                {selectedItems.reduce((sum, item) => sum + item.quantity, 0)} items
                            </p>
                            <p className="text-xl font-bold">₹{(total / 100).toFixed(2)}</p>
                        </div>
                        <button
                            onClick={handleAddAllToCart}
                            disabled={isAdding}
                            className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                            {isAdding ? "Adding..." : "Add to Cart"}
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Padding */}
            {selectedItems.length > 0 && <div className="lg:hidden h-24" />}
        </div>
    )
}

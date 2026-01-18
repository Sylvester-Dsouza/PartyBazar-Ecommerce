import { Metadata } from "next"
import { listCollections } from "@lib/data/collections"
import PageHeader from "@modules/common/components/page-header"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
    title: "Collections | Party Bazaar Store",
    description: "Explore our curated collections of party supplies and decorations. Find the perfect theme for your celebration.",
}

export default async function CollectionsPage() {
    const { collections } = await listCollections({
        fields: "*products",
    })

    return (
        <>
            <PageHeader
                title="Shop by Collection"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Collections", href: "/collections" },
                ]}
                description="Discover our handpicked collections of party essentials, themed decorations, and celebration supplies."
            />

            <div className="content-container py-12">
                {!collections || collections.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-ui-fg-subtle">No collections available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {collections.map((collection: any) => (
                            <LocalizedClientLink
                                key={collection.id}
                                href={`/collections/${collection.handle}`}
                                className="group"
                            >
                                <div className="border border-ui-border-base rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    {/* Collection Image */}
                                    <div className="aspect-square bg-ui-bg-subtle relative overflow-hidden">
                                        {collection.metadata?.image_url ? (
                                            <img
                                                src={collection.metadata.image_url as string}
                                                alt={collection.title}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-ui-fg-muted">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-16 w-16"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Collection Info */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-medium text-ui-fg-base group-hover:text-ui-fg-interactive transition-colors">
                                            {collection.title}
                                        </h3>
                                        {collection.metadata?.meta_description && (
                                            <p className="text-sm text-ui-fg-subtle mt-1 line-clamp-2">
                                                {collection.metadata.meta_description as string}
                                            </p>
                                        )}
                                        {collection.products && collection.products.length > 0 && (
                                            <p className="text-xs text-ui-fg-muted mt-2">
                                                {collection.products.length} {collection.products.length === 1 ? 'product' : 'products'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </LocalizedClientLink>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

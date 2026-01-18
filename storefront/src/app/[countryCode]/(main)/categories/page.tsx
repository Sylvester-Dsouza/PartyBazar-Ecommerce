import { Metadata } from "next"
import { listCategories } from "@lib/data/categories"
import PageHeader from "@modules/common/components/page-header"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
    title: "Categories | Party Bazaar Store",
    description: "Browse all product categories at Party Bazaar Store. Find everything you need for your party and celebrations.",
}

export default async function CategoriesPage() {
    const categories = await listCategories()

    // Filter only parent categories (no parent_category_id)
    const parentCategories = categories?.filter(
        (category: any) => !category.parent_category_id
    ) || []

    return (
        <>
            <PageHeader
                title="Shop by Category"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Categories", href: "/categories" },
                ]}
                description="Explore our wide range of party supplies and decorations organized by category."
            />

            <div className="content-container py-12">
                {parentCategories.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-ui-fg-subtle">No categories available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {parentCategories.map((category: any) => (
                            <LocalizedClientLink
                                key={category.id}
                                href={`/categories/${category.handle}`}
                                className="group"
                            >
                                <div className="border border-ui-border-base rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    {/* Category Image */}
                                    <div className="aspect-square bg-ui-bg-subtle relative overflow-hidden">
                                        {category.metadata?.image_url ? (
                                            <img
                                                src={category.metadata.image_url as string}
                                                alt={category.name}
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
                                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Category Info */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-medium text-ui-fg-base group-hover:text-ui-fg-interactive transition-colors">
                                            {category.name}
                                        </h3>
                                        {category.description && (
                                            <p className="text-sm text-ui-fg-subtle mt-1 line-clamp-2">
                                                {category.description}
                                            </p>
                                        )}
                                        {category.category_children && category.category_children.length > 0 && (
                                            <p className="text-xs text-ui-fg-muted mt-2">
                                                {category.category_children.length} subcategories
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

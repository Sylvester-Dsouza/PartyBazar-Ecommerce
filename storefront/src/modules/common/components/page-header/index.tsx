import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface PageHeaderProps {
    title: string
    breadcrumbs?: BreadcrumbItem[]
    description?: string
}

const PageHeader = ({ title, breadcrumbs, description }: PageHeaderProps) => {
    // Default breadcrumbs with Home
    const defaultBreadcrumbs: BreadcrumbItem[] = [
        { label: "Home", href: "/" },
    ]

    const allBreadcrumbs = breadcrumbs
        ? [...defaultBreadcrumbs, ...breadcrumbs]
        : [...defaultBreadcrumbs, { label: title }]

    return (
        <div className="bg-gradient-to-r from-party-pink-50 via-white to-party-sky-50 border-b border-grey-10">
            <div className="content-container py-8 md:py-12 text-center">
                {/* Breadcrumb */}
                <nav className="flex items-center justify-center gap-2 text-sm mb-4">
                    {allBreadcrumbs.map((crumb, index) => (
                        <span key={index} className="flex items-center gap-2">
                            {index > 0 && (
                                <svg
                                    className="w-4 h-4 text-grey-40"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                            {crumb.href ? (
                                <LocalizedClientLink
                                    href={crumb.href}
                                    className="text-grey-60 hover:text-party-dark transition-colors"
                                >
                                    {crumb.label}
                                </LocalizedClientLink>
                            ) : (
                                <span className="text-party-dark font-medium">{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </nav>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-party-dark">
                    {title}
                </h1>

                {/* Optional Description */}
                {description && (
                    <p className="mt-3 text-grey-60 max-w-2xl mx-auto">
                        {description}
                    </p>
                )}
            </div>
        </div>
    )
}

export default PageHeader

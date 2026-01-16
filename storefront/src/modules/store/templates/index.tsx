import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import GridToggle from "@modules/store/components/grid-toggle"

import PaginatedProducts from "./paginated-products"

import PageHeader from "@modules/common/components/page-header"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  gridColumns = 4,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  gridColumns?: 3 | 4
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <>
      <PageHeader
        title="Store"
        breadcrumbs={[{ label: "Store", href: "/store" }]}
        description="Explore our wide range of party supplies."
      />
      <div className="py-8 content-container">
        {/* Two Column Layout: Sidebar + Content */}
        <div className="flex flex-col small:flex-row gap-8">
          {/* Left Sidebar */}
          <RefinementList sortBy={sort} />

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              <p className="text-grey-70 text-sm mb-4">
                Showing <span className="font-semibold text-party-dark">12</span> results from total of <span className="font-semibold text-party-dark">300</span> for &quot;<span className="font-semibold text-party-dark">All Products</span>&quot;
              </p>

              {/* Sort Options & Grid Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-grey-60">Sort by</span>
                  <select className="text-sm border border-grey-20 rounded-lg px-3 py-2 bg-white text-party-dark focus:ring-2 focus:ring-party-sky-500 focus:border-transparent">
                    <option>Popularity</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <select className="text-sm border border-grey-20 rounded-lg px-3 py-2 bg-white text-party-dark focus:ring-2 focus:ring-party-sky-500 focus:border-transparent">
                    <option>Reviews</option>
                    <option>Rating: High to Low</option>
                  </select>
                  <select className="text-sm border border-grey-20 rounded-lg px-3 py-2 bg-white text-party-dark focus:ring-2 focus:ring-party-sky-500 focus:border-transparent">
                    <option>New Arrivals</option>
                    <option>Date: Old to New</option>
                  </select>
                </div>

                {/* Grid Toggle - Client Component */}
                <GridToggle gridColumns={gridColumns} />
              </div>
            </div>

            {/* Product Grid */}
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                gridColumns={gridColumns}
              />
            </Suspense>
          </div>
        </div>
      </div>

    </>
  )
}

export default StoreTemplate

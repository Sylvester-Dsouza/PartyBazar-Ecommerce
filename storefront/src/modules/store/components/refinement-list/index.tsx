"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useEffect } from "react"
import { ChevronDown, ChevronRight, X } from "lucide-react"

import SortProducts, { SortOptions } from "./sort-products"

type Category = {
  id: string
  name: string
  handle: string
  parent_category_id: string | null
  category_children?: Category[]
}

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  categories?: Category[]
  'data-testid'?: string
}

const RefinementList = ({ sortBy, categories = [], 'data-testid': dataTestId }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [appliedFiltersOpen, setAppliedFiltersOpen] = useState(true)
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Mock applied filters for demo - in real implementation, these would come from URL params
  const appliedFilters = [
    { id: "1", label: "High Backrest", type: "attribute" },
    { id: "2", label: "In Stock", type: "availability" },
    { id: "3", label: "Price from $100 to $500", type: "price" },
    { id: "4", label: "Blue", type: "color", color: "#3B82F6" },
  ]

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const removeFilter = (filterId: string) => {
    // In real implementation, this would update URL params
    console.log("Remove filter:", filterId)
  }

  const resetFilters = () => {
    router.push(pathname)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  // Mock categories for demo
  const mockCategories: Category[] = [
    {
      id: "1",
      name: "Birthday Supplies",
      handle: "birthday-supplies",
      parent_category_id: null,
      category_children: [
        { id: "1-1", name: "Candles", handle: "candles", parent_category_id: "1" },
        { id: "1-2", name: "Banners", handle: "banners", parent_category_id: "1" },
        { id: "1-3", name: "Cake Toppers", handle: "cake-toppers", parent_category_id: "1" },
        { id: "1-4", name: "Confetti", handle: "confetti", parent_category_id: "1" },
        { id: "1-5", name: "Streamers", handle: "streamers", parent_category_id: "1" },
        { id: "1-6", name: "Party Favors", handle: "party-favors", parent_category_id: "1" },
      ]
    },
    {
      id: "2",
      name: "Tableware",
      handle: "tableware",
      parent_category_id: null,
      category_children: []
    }
  ]

  const displayCategories = categories.length > 0 ? categories : mockCategories

  const renderCategory = (category: Category, depth = 0) => {
    const hasChildren = category.category_children && category.category_children.length > 0
    const isExpanded = expandedCategories.has(category.id)

    return (
      <div key={category.id} className={depth > 0 ? "ml-6" : ""}>
        <div className="flex items-center gap-2 py-2">
          {hasChildren ? (
            <button
              onClick={() => toggleCategory(category.id)}
              className="flex items-center gap-2 w-full text-left"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-grey-50" />
              ) : (
                <ChevronRight className="w-4 h-4 text-grey-50" />
              )}
              <span className="text-sm font-medium text-party-dark">{category.name}</span>
            </button>
          ) : (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-grey-30 text-party-sky-500 focus:ring-party-sky-500"
              />
              <span className="text-sm text-grey-70">{category.name}</span>
            </label>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {category.category_children!.map(child => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full small:w-[280px] small:min-w-[280px] small:pr-8 mb-8 small:mb-0">
      {/* Applied Filters Section */}
      <div className="border border-grey-20 rounded-lg mb-6">
        <button
          onClick={() => setAppliedFiltersOpen(!appliedFiltersOpen)}
          className="flex items-center justify-between w-full p-4"
        >
          <span className="font-medium text-party-dark">Applied Filters</span>
          <ChevronDown className={`w-5 h-5 text-grey-50 transition-transform ${appliedFiltersOpen ? 'rotate-0' : '-rotate-90'}`} />
        </button>

        {appliedFiltersOpen && (
          <div className="px-4 pb-4">
            <div className="space-y-2 mb-4">
              {appliedFilters.map(filter => (
                <div key={filter.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    {filter.color && (
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: filter.color }}
                      />
                    )}
                    <span className="text-sm text-grey-70">{filter.label}</span>
                  </div>
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="text-grey-50 hover:text-party-dark"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={resetFilters}
              className="w-full py-3 bg-party-dark hover:bg-grey-80 text-white font-medium rounded-full transition-colors uppercase text-sm tracking-wide"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-grey-20 mb-6" />

      {/* Category Section */}
      <div className="border border-grey-20 rounded-lg">
        <button
          onClick={() => setCategoryOpen(!categoryOpen)}
          className="flex items-center justify-between w-full p-4"
        >
          <span className="font-medium text-party-dark">Category</span>
          <ChevronDown className={`w-5 h-5 text-grey-50 transition-transform ${categoryOpen ? 'rotate-0' : '-rotate-90'}`} />
        </button>

        {categoryOpen && (
          <div className="px-4 pb-4">
            {displayCategories.map(category => renderCategory(category))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RefinementList

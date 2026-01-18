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
    <div className="w-full small:w-[280px] small:min-w-[280px] small:pr-8 mb-8 small:mb-0 space-y-6">
      {/* Applied Filters Section */}
      <div className="bg-white border border-grey-20 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => setAppliedFiltersOpen(!appliedFiltersOpen)}
          className="flex items-center justify-between w-full p-4 bg-party-cream/30 hover:bg-party-cream/50 transition-colors"
        >
          <span className="font-semibold text-party-dark">Applied Filters</span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${appliedFiltersOpen ? 'rotate-0' : '-rotate-90'}`} />
        </button>

        {appliedFiltersOpen && (
          <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {appliedFilters.map(filter => (
                <div key={filter.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-party-sky-50 border border-party-sky-200 rounded-full">
                  {filter.color && (
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-gray-100"
                      style={{ backgroundColor: filter.color }}
                    />
                  )}
                  <span className="text-xs font-medium text-party-dark">{filter.label}</span>
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="text-party-sky-300 hover:text-red-400 transition-colors ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={resetFilters}
              className="w-full py-2.5 bg-white border border-party-pink-200 text-party-pink-500 hover:bg-party-pink-50 font-medium rounded-lg transition-colors text-sm"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="bg-white border border-grey-20 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => setCategoryOpen(!categoryOpen)}
          className="flex items-center justify-between w-full p-4 bg-white hover:bg-gray-50 transition-colors border-b border-grey-10"
        >
          <span className="font-semibold text-party-dark">Categories</span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${categoryOpen ? 'rotate-0' : '-rotate-90'}`} />
        </button>

        {categoryOpen && (
          <div className="p-4 max-h-[300px] overflow-y-auto scrollbar-thin">
            {displayCategories.map(category => renderCategory(category))}
          </div>
        )}
      </div>

      {/* Price Range Section (UI Only) */}
      <div className="bg-white border border-grey-20 rounded-xl overflow-hidden shadow-sm">
        <button
          className="flex items-center justify-between w-full p-4 bg-white hover:bg-gray-50 transition-colors border-b border-grey-10"
        >
          <span className="font-semibold text-party-dark">Price Range</span>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </button>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min</label>
              <input type="number" placeholder="0" className="w-full px-3 py-2 border border-grey-20 rounded-lg text-sm focus:ring-party-sky-200 focus:border-party-sky-300" />
            </div>
            <div className="pt-4 text-gray-400">-</div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max</label>
              <input type="number" placeholder="1000" className="w-full px-3 py-2 border border-grey-20 rounded-lg text-sm focus:ring-party-sky-200 focus:border-party-sky-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Colors Section (UI Only) */}
      <div className="bg-white border border-grey-20 rounded-xl overflow-hidden shadow-sm">
        <button
          className="flex items-center justify-between w-full p-4 bg-white hover:bg-gray-50 transition-colors border-b border-grey-10"
        >
          <span className="font-semibold text-party-dark">Colors</span>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </button>
        <div className="p-4">
          <div className="flex flex-wrap gap-3">
            {["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#111827", "#FFFFFF"].map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform focus:ring-2 focus:ring-offset-2 focus:ring-party-sky-300"
                style={{ backgroundColor: color }}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RefinementList

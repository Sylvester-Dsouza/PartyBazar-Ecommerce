"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Grid3X3, LayoutGrid } from "lucide-react"

export default function GridToggle({
    gridColumns
}: {
    gridColumns: 3 | 4
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const setGridColumns = (cols: 3 | 4) => {
        const params = new URLSearchParams(searchParams)
        params.set("grid", cols.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="hidden small:flex items-center gap-1 border border-grey-20 rounded-lg p-1">
            <button
                onClick={() => setGridColumns(3)}
                className={`p-2 rounded transition-colors ${gridColumns === 3 ? 'bg-party-dark text-white' : 'text-grey-50 hover:bg-grey-10'}`}
                title="3 columns"
            >
                <Grid3X3 className="w-4 h-4" />
            </button>
            <button
                onClick={() => setGridColumns(4)}
                className={`p-2 rounded transition-colors ${gridColumns === 4 ? 'bg-party-dark text-white' : 'text-grey-50 hover:bg-grey-10'}`}
                title="4 columns"
            >
                <LayoutGrid className="w-4 h-4" />
            </button>
        </div>
    )
}

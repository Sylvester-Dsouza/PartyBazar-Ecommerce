import { sdk } from "@lib/config"

export type MenuItem = {
    id: string
    title: string
    url: string
    parent_id: string | null
    open_in_new_tab: boolean
    highlight: boolean
    highlight_text: string | null
    icon: string | null
    sort_order: number
    is_active: boolean
    children?: MenuItem[]
}

export type Menu = {
    id: string
    title: string
    handle: string
    is_active: boolean
    items: MenuItem[]
}

/**
 * Fetch a menu by its handle from the backend
 */
export async function getMenu(handle: string): Promise<Menu | null> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/menu/${handle}`,
            {
                headers: {
                    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
                },
                next: {
                    revalidate: 60, // Cache for 60 seconds
                    tags: [`menu-${handle}`],
                },
            }
        )

        if (!response.ok) {
            if (response.status === 404) {
                return null
            }
            throw new Error(`Failed to fetch menu: ${response.statusText}`)
        }

        const data = await response.json()
        return data.menu
    } catch (error) {
        console.error(`Failed to fetch menu "${handle}":`, error)
        return null
    }
}

/**
 * Fetch all active menus
 */
export async function getAllMenus(): Promise<Menu[]> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/menu`,
            {
                headers: {
                    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
                },
                next: {
                    revalidate: 60,
                    tags: ["menus"],
                },
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to fetch menus: ${response.statusText}`)
        }

        const data = await response.json()
        return data.menus || []
    } catch (error) {
        console.error("Failed to fetch menus:", error)
        return []
    }
}

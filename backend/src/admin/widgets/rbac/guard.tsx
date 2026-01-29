import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

/**
 * RBACGuard Widget
 * 
 * This widget acts as a security & UI guard for the "Ecom Manager" role.
 * Action:
 * 1. Hides the main "Settings" link in the sidebar.
 * 2. Hides restricted menu sections (Developer, General, Extensions) via CSS and MutationObserver.
 * 3. Redirects if trying to access restricted developer paths directly.
 */

const RBACGuard = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        let observer: MutationObserver | null = null;

        const checkAccess = async () => {
            try {
                // Fetch current session (using /admin/users/me which is confirmed valid)
                const res = await fetch("/admin/users/me")
                if (!res.ok) return

                const data = await res.json()
                const user = data.user

                if (!user) return

                const role = user.metadata?.role

                // Define restricted paths for "ecom_manager"
                const restrictedPaths = [
                    "/settings/api-key",
                    "/settings/publishable-api-keys",
                    "/settings/secret-api-keys",
                    "/settings/workflows",
                    "/settings/store",
                    "/settings/users",
                    "/settings/regions",
                ]

                if (role === "ecom_manager") {
                    const currentPath = location.pathname

                    // 1. Path Redirection Check
                    // Redirect away from any settings page that isn't profile
                    if (currentPath.includes("/settings") && !currentPath.includes("/settings/profile")) {
                        toast.error("Access Denied: You do not have permission to view this page.")
                        navigate("/products")
                    }

                    // 2. CSS Injection for persistence
                    const styleId = "rbac-sidebar-hider"
                    if (!document.getElementById(styleId)) {
                        console.log("Injecting RBAC Hiding Styles for Ecom Manager")
                        const style = document.createElement("style")
                        style.id = styleId
                        style.innerHTML = `
                            /* Hide main sidebar settings link */
                            a[href="/app/settings"],
                            a[href="/settings"] {
                                display: none !important;
                            }

                            /* Hide specific settings items for deep links */
                            a[href*="api-key"], 
                            a[href*="workflows"] {
                                display: none !important;
                            }
                        `
                        document.head.appendChild(style)
                    }

                    // 3. MutationObserver for aggressive hiding of Section Headers
                    const hideItems = () => {
                        // Hide main settings link and sub-links
                        const settingsMain = document.querySelectorAll('a[href="/app/settings"], a[href="/settings"]')
                        settingsMain.forEach(l => (l as HTMLElement).style.setProperty('display', 'none', 'important'))

                        const links = document.querySelectorAll('a[href*="api-key"], a[href*="workflows"]')
                        links.forEach(l => (l as HTMLElement).style.setProperty('display', 'none', 'important'))

                        // Restricted section headers in settings page
                        const restrictedHeaders = ['Developer', 'General', 'Extensions']
                        const allElements = document.querySelectorAll('p, div, span, h3, h4')
                        allElements.forEach(el => {
                            const text = el.textContent?.trim()
                            if (text && restrictedHeaders.includes(text) && el.children.length === 0) {
                                const section = el.closest('div[data-state], div.py-3') || el.parentElement;
                                if (section) {
                                    (section as HTMLElement).style.setProperty('display', 'none', 'important')
                                }
                            }
                        })
                    }

                    hideItems()
                    observer = new MutationObserver(hideItems)
                    observer.observe(document.body, { childList: true, subtree: true })
                }

            } catch (e) {
                console.error("RBAC Check failed", e)
            } finally {
                setChecking(false)
            }
        }

        checkAccess()

        return () => {
            if (observer) observer.disconnect()
        }
    }, [location.pathname, navigate])

    return null
}

export const config = defineWidgetConfig({
    zone: [
        "product.list.before", "product.details.before",
        "order.list.before", "order.details.before",
        "customer.list.before", "customer.details.before",
        "user.list.before", "user.details.before",
        "region.list.before",
        "sales_channel.list.before", "sales_channel.details.before",
        "promotion.list.before", "promotion.details.before",
        "price_list.list.before", "price_list.details.before",
        "inventory_item.list.before",
        "store.details.before",
        "api_key.list.before",
        "workflow.list.before",
        "tax.list.before",
        "return_reason.list.before",
        "location.list.before",
        "profile.details.before",
        "login.before",
    ],
})

export default RBACGuard

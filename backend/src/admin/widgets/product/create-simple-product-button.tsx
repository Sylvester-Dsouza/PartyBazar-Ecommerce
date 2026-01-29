import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button } from "@medusajs/ui"
import { Plus } from "@medusajs/icons"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

const CreateSimpleProductButton = () => {
    const navigate = useNavigate()
    const [container, setContainer] = useState<HTMLElement | null>(null)

    useEffect(() => {
        const findContainer = () => {
            // Strategy: Look for specific header action buttons
            const candidates = Array.from(document.querySelectorAll("button, a"))
            const targetBtn = candidates.find(b => {
                const text = b.textContent?.trim()
                return text === "Export" || text === "Import" || text === "Create"
            })

            if (targetBtn && targetBtn.parentElement) {
                // Ensure we are in the main header actions container (usually a flex box)
                // We might want to verify it has multiple children or specific classes if possible
                // For now, parentElement of these buttons is the safest bet for the "row"
                if (targetBtn.parentElement.tagName === "DIV") {
                    setContainer(targetBtn.parentElement)
                    return true
                }
            }
            return false
        }

        // Initial check
        if (findContainer()) return

        // Observer for dynamic loading
        const observer = new MutationObserver(() => {
            if (findContainer()) {
                observer.disconnect()
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })

        return () => observer.disconnect()
    }, [])

    if (!container) {
        // Fallback: Render in standard zone if we can't find the header
        return (
            <div className="flex items-center justify-end mb-4">
                <Button
                    size="small"
                    className="!bg-black !text-white !border-none hover:!bg-neutral-800"
                    onClick={() => navigate("/products/create-simple")}
                >
                    Simple product
                </Button>
            </div>
        )
    }

    return createPortal(
        <Button
            size="small"
            className="mr-2 !bg-black !text-white !border-none hover:!bg-neutral-800"
            onClick={() => navigate("/products/create-simple")}
        >
            Simple product
        </Button>,
        container
    )
}

export const config = defineWidgetConfig({
    zone: "product.list.before",
})

export default CreateSimpleProductButton

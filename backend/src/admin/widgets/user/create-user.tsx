import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Drawer, Input, Label, toast, Select } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Plus } from "@medusajs/icons"
import { createPortal } from "react-dom"

const CreateUserWidget = () => {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [container, setContainer] = useState<HTMLElement | null>(null)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role: "ecom_manager"
    })

    useEffect(() => {
        const findContainer = () => {
            const candidates = Array.from(document.querySelectorAll("button, a"))
            const targetBtn = candidates.find(b => {
                const text = b.textContent?.trim()
                return text === "Invite"
            })

            if (targetBtn && targetBtn.parentElement) {
                if (targetBtn.parentElement.tagName === "DIV") {
                    setContainer(targetBtn.parentElement)
                    return true
                }
            }
            return false
        }

        if (findContainer()) return

        const observer = new MutationObserver(() => {
            if (findContainer()) {
                observer.disconnect()
            }
        })

        observer.observe(document.body, { childList: true, subtree: true })
        return () => observer.disconnect()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleRoleChange = (value: string) => {
        setFormData({ ...formData, role: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.email || !formData.password) {
            toast.error("Email and Password are required")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch("/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || "Failed to create user")
            }

            toast.success("User created successfully")
            setOpen(false)
            setFormData({ email: "", password: "", first_name: "", last_name: "", role: "ecom_manager" })
            window.location.reload()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const content = (
        <Drawer open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                <Button variant="secondary" size="small" className="mr-2">
                    <Plus className="mr-1" />
                    Create User
                </Button>
            </Drawer.Trigger>
            <Drawer.Content>
                <Drawer.Header>
                    <Drawer.Title>Create User</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body className="p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label size="small">Email</Label>
                            <Input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="user@example.com"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label size="small">Password</Label>
                            <Input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="********"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label size="small">Role</Label>
                            <Select value={formData.role} onValueChange={handleRoleChange}>
                                <Select.Trigger>
                                    <Select.Value placeholder="Select role" />
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Item value="admin">Admin (Unrestricted)</Select.Item>
                                    <Select.Item value="ecom_manager">Ecom Manager (Restricted)</Select.Item>
                                </Select.Content>
                            </Select>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2 w-full">
                                <Label size="small">First Name</Label>
                                <Input
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="John"
                                />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <Label size="small">Last Name</Label>
                                <Input
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                    </form>
                </Drawer.Body>
                <Drawer.Footer>
                    <Drawer.Close asChild>
                        <Button variant="secondary">Cancel</Button>
                    </Drawer.Close>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        isLoading={isLoading}
                    >
                        Create
                    </Button>
                </Drawer.Footer>
            </Drawer.Content>
        </Drawer>
    )

    if (!container) {
        return <div className="flex justify-end p-4">{content}</div>
    }

    return createPortal(content, container)
}

export const config = defineWidgetConfig({
    zone: "user.list.before",
})

export default CreateUserWidget

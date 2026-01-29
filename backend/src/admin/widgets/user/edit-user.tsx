import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Input, Label, Select, toast, Text } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

const EditUserWidget = () => {
    const { id } = useParams()
    const [user, setUser] = useState<any>(null)
    const [role, setRole] = useState("ecom_manager")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!id) return
        const fetchUser = async () => {
            try {
                // We need to fetch the user details. Assuming standard admin route exists or we use our own if needed.
                // Standard admin usually exposes /admin/users/:id
                const res = await fetch(`/admin/users/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setUser(data.user)
                    setRole(data.user.metadata?.role || "ecom_manager")
                }
            } catch (e) {
                console.error("Failed to fetch user", e)
            }
        }
        fetchUser()
    }, [id])

    const handleUpdate = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/admin/users/${id}/access`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role,
                    ...(password ? { password } : {})
                }),
            })

            if (!res.ok) throw new Error("Failed to update user")

            toast.success("User updated successfully")
            setPassword("") // Clear password field
        } catch (e) {
            toast.error("Failed to update user")
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) return null

    return (
        <Container className="p-8 border-ui-border-base border-t">
            <Heading level="h2" className="mb-4">Manage User Access</Heading>
            <form className="grid grid-cols-1 gap-6 max-w-[400px]" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                <div className="flex flex-col gap-2">
                    <Label>Role</Label>
                    <Select value={role} onValueChange={setRole}>
                        <Select.Trigger>
                            <Select.Value placeholder="Select role" />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value="admin">Admin (Unrestricted)</Select.Item>
                            <Select.Item value="ecom_manager">Ecom Manager (Restricted)</Select.Item>
                        </Select.Content>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Reset Password</Label>
                    <Input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <Text size="small" className="text-ui-fg-subtle">
                        Leave blank to keep current password.
                    </Text>
                </div>

                <Button type="submit" isLoading={isLoading}>
                    Update User
                </Button>
            </form>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "user.details.after",
})

export default EditUserWidget

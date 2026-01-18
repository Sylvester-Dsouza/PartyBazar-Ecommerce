import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront } from "@medusajs/icons"
import { Container, Heading, Button, Table, Badge, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type Vendor = {
    id: string
    name: string
    handle: string
    email: string | null
    is_active: boolean
}

const VendorListPage = () => {
    const navigate = useNavigate()
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [loading, setLoading] = useState(true)

    const fetchVendors = async () => {
        try {
            const response = await fetch("/admin/vendors", {
                credentials: "include",
            })
            const data = await response.json()
            setVendors(data.vendors || [])
        } catch (error) {
            console.error("Failed to fetch vendors:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVendors()
    }, [])

    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
                <div>
                    <Heading level="h1">Vendors</Heading>
                    <Text className="text-ui-fg-subtle">
                        Manage your product vendors and suppliers
                    </Text>
                </div>
                <Button variant="primary" onClick={() => navigate("/vendors/create")}>
                    Add Vendor
                </Button>
            </div>

            <div className="px-6 py-4">
                {loading ? (
                    <Text>Loading...</Text>
                ) : vendors.length === 0 ? (
                    <div className="text-center py-8">
                        <Text className="text-ui-fg-subtle">No vendors yet.</Text>
                        <Text className="text-ui-fg-subtle text-sm mt-2">
                            Add vendors to associate them with your products.
                        </Text>
                    </div>
                ) : (
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Handle</Table.HeaderCell>
                                <Table.HeaderCell>Email</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {vendors.map((vendor) => (
                                <Table.Row
                                    key={vendor.id}
                                    className="cursor-pointer hover:bg-ui-bg-subtle"
                                    onClick={() => navigate(`/vendors/${vendor.id}`)}
                                >
                                    <Table.Cell className="font-medium">
                                        {vendor.name}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <code className="text-xs bg-ui-bg-subtle px-2 py-1 rounded">
                                            {vendor.handle}
                                        </code>
                                    </Table.Cell>
                                    <Table.Cell>{vendor.email || "-"}</Table.Cell>
                                    <Table.Cell>
                                        <Badge color={vendor.is_active ? "green" : "grey"}>
                                            {vendor.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(`/vendors/${vendor.id}`)
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </div>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Vendors",
    icon: BuildingStorefront,
})

export default VendorListPage

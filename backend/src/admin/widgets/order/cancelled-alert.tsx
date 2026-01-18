import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"
import { Container, Heading, Text, StatusBadge } from "@medusajs/ui"
import { XCircle } from "@medusajs/icons"

const OrderCancelledAlert = ({ data }: DetailWidgetProps<AdminOrder>) => {
    if (data.status !== "canceled") {
        return null
    }

    return (
        <Container className="bg-ui-bg-error-subtle border-ui-border-error mb-4">
            <div className="flex items-center gap-x-3">
                <div className="p-1 bg-ui-bg-error rounded-md flex items-center justify-center">
                    <XCircle className="text-ui-fg-on-color" />
                </div>
                <div>
                    <Heading level="h2" className="text-ui-fg-error">
                        Order Cancelled
                    </Heading>
                    <Text className="text-ui-fg-error-subtle">
                        This order has been cancelled and requires no further action.
                    </Text>
                </div>
            </div>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "order.details.before",
})

export default OrderCancelledAlert

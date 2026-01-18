import { listProducts } from "@lib/data/products"
import PlanMyPartyClient from "./client"

export default async function PlanMyPartyPage({
    params,
}: {
    params: Promise<{ countryCode: string }>
}) {
    const { countryCode } = await params

    // Fetch initial products
    const { response } = await listProducts({
        countryCode,
        queryParams: {
            limit: 100,
        },
    })

    return <PlanMyPartyClient products={response.products} countryCode={countryCode} />
}

import { Metadata } from "next"
import PageHeader from "@modules/common/components/page-header"

export const metadata: Metadata = {
    title: "Shipping Policy | Party Bazaar",
    description: "Learn about Party Bazaar's shipping guidelines, delivery times, and policies.",
}

const shippingFeatures = [
    {
        icon: "🇮🇳",
        title: "Pan-India Delivery",
        description: "We deliver to nearly every region in India"
    },
    {
        icon: "📦",
        title: "Quick Dispatch",
        description: "Orders dispatched within 1-7 business days"
    },
    {
        icon: "💰",
        title: "Inclusive Pricing",
        description: "All prices include applicable taxes"
    },
    {
        icon: "🚚",
        title: "Fast Shipping",
        description: "1-3 days delivery timeline"
    }
]

export default function ShippingPolicyPage() {
    return (
        <div>
            <PageHeader
                title="Shipping Policy"
                description="Everything you need to know about shipping and delivery"
            />

            <div className="content-container py-12 md:py-16">
                <div className="max-w-3xl mx-auto">
                    {/* Shipping Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {shippingFeatures.map((feature, index) => (
                            <div key={index} className="bg-grey-5 rounded-2xl p-6 text-center">
                                <div className="text-3xl mb-3">{feature.icon}</div>
                                <h3 className="font-semibold text-party-dark text-sm mb-1">{feature.title}</h3>
                                <p className="text-grey-60 text-xs">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Shipping Guidelines */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-party-dark mb-4 flex items-center gap-2">
                            <span className="text-2xl">📋</span> Shipping Guidelines
                        </h2>
                        <div className="bg-white rounded-2xl border border-grey-10 p-6">
                            <ul className="space-y-4 text-grey-60">
                                <li className="flex items-start gap-3">
                                    <span className="text-party-dark">•</span>
                                    <span>partybazaar.com distributes its goods to nearly every region in India.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-party-dark">•</span>
                                    <span>Orders will be dispatched within 7 days of placement.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-party-dark">•</span>
                                    <span>We ship on all days except Sundays and federal holidays.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-party-dark">•</span>
                                    <span>All costs listed on the website are inclusive of taxes.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-party-dark">•</span>
                                    <span>For international shipping, relevant shipping costs, customs, and taxes will be calculated and added to your order.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Return & Refund Policy */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-party-dark mb-4 flex items-center gap-2">
                            <span className="text-2xl">↩️</span> Return & Refund Policy
                        </h2>
                        <div className="bg-party-pink-50 rounded-2xl p-6">
                            <p className="text-grey-70 leading-relaxed">
                                partybazaar.com packages and ships products with the utmost care to ensure they reach you in perfect condition. Since our products are unique luxury items, <strong>all sales are final</strong> and there are no refunds or returns accepted.
                            </p>
                        </div>
                    </section>

                    {/* Non-Returnable Items */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-party-dark mb-4 flex items-center gap-2">
                            <span className="text-2xl">🚫</span> Non-Returnable Items
                        </h2>
                        <div className="bg-white rounded-2xl border border-grey-10 p-6">
                            <p className="text-grey-60 leading-relaxed">
                                Due to the nature of our products, which frequently include bespoke, limited edition, and luxury items, we are unable to handle returns or refunds once an order has been placed.
                            </p>
                        </div>
                    </section>

                    {/* Exceptions */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-party-dark mb-4 flex items-center gap-2">
                            <span className="text-2xl">✅</span> Exceptions
                        </h2>
                        <div className="bg-green-50 rounded-2xl p-6">
                            <p className="text-grey-70 leading-relaxed mb-4">
                                If you receive a damaged or defective product, please contact our customer care within <strong>48 hours</strong> of receiving the item, providing relevant images and order data.
                            </p>
                            <p className="text-grey-70 leading-relaxed">
                                After reviewing the matter, we will offer a suitable solution.
                            </p>
                        </div>
                    </section>

                    {/* Contact Box */}
                    <div className="bg-gradient-to-r from-party-pink-50 to-party-sky-50 rounded-3xl p-8 text-center">
                        <h3 className="text-xl font-semibold text-party-dark mb-4">Have Questions?</h3>
                        <p className="text-grey-60 mb-6">
                            Contact us for any shipping-related queries.
                        </p>
                        <a
                            href="mailto:support@partybazaar.com"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-party-dark text-white font-medium rounded-full hover:bg-grey-80 transition-colors"
                        >
                            support@partybazaar.com
                        </a>
                        <p className="text-grey-50 text-sm mt-4">
                            Thank you for choosing partybazaar.com 🎉
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

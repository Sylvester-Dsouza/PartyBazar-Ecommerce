import { Metadata } from "next"
import PageHeader from "@modules/common/components/page-header"

export const metadata: Metadata = {
    title: "Return Policy | Party Bazaar",
    description: "Learn about Party Bazaar's return and refund policy for party supplies.",
}

const policyItems = [
    {
        number: "1",
        title: "Refunds & Returns",
        content: "We do not offer refunds or returns on any purchases. Our products are one-time use items, and for safety and hygiene reasons, they cannot be returned or resold once delivered."
    },
    {
        number: "2",
        title: "Digital Products",
        content: "All digital purchases (if any) are final and non-refundable."
    },
    {
        number: "3",
        title: "Order Cancellations",
        content: "Orders can be cancelled only before they are processed or shipped. To request a cancellation, please contact us immediately with your order number. Once an order has been shipped, it cannot be cancelled."
    },
    {
        number: "4",
        title: "Processing Time for Approved Cancellations",
        content: "If your cancellation request is approved, your refund (if applicable) will be processed within 3–5 business days."
    },
    {
        number: "5",
        title: "Contact Us",
        content: "If you have any questions or concerns regarding your purchase, please reach out to us."
    }
]

export default function ReturnPolicyPage() {
    return (
        <div>
            <PageHeader
                title="Return Policy"
                description="Our policy regarding returns, refunds, and order cancellations"
            />

            <div className="content-container py-12 md:py-16">
                <div className="max-w-3xl mx-auto">
                    {/* Important Notice */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-10">
                        <div className="flex items-start gap-4">
                            <div className="text-2xl">⚠️</div>
                            <div>
                                <h3 className="font-semibold text-grey-80 mb-2">Important Notice</h3>
                                <p className="text-grey-60 text-sm">
                                    Please read this policy carefully before making a purchase. By placing an order with Party Bazaar, you agree to these terms.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Policy Items */}
                    <div className="space-y-8">
                        {policyItems.map((item, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-party-dark text-white flex items-center justify-center font-semibold">
                                    {item.number}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-party-dark mb-2">{item.title}</h3>
                                    <p className="text-grey-60 leading-relaxed">{item.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Box */}
                    <div className="mt-12 bg-grey-5 rounded-3xl p-8 text-center">
                        <h3 className="text-xl font-semibold text-party-dark mb-4">Need Help?</h3>
                        <p className="text-grey-60 mb-6">
                            Contact us for any questions about returns or cancellations.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="https://wa.me/918130097893"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 transition-colors"
                            >
                                💬 WhatsApp: +91 81300 97893
                            </a>
                            <a
                                href="mailto:support@partybazaar.com"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-party-dark text-white font-medium rounded-full hover:bg-grey-80 transition-colors"
                            >
                                ✉️ Email Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

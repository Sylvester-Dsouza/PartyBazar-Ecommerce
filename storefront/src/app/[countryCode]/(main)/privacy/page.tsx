import { Metadata } from "next"
import PageHeader from "@modules/common/components/page-header"

export const metadata: Metadata = {
    title: "Privacy Policy | Party Bazaar",
    description: "Learn how Party Bazaar collects, uses, and protects your personal information.",
}

const sections = [
    {
        title: "Collecting Personal Information",
        content: "When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support. In this Privacy Policy, we refer to any information that can uniquely identify an individual as \"Personal Information\"."
    },
    {
        title: "Device Information",
        items: [
            { label: "Examples of Personal Information collected", value: "Version of web browser, IP address, time zone, cookie information, what sites or products you view, search terms, and how you interact with the Site." },
            { label: "Purpose of collection", value: "To load the Site accurately for you, and to perform analytics on Site usage to optimize our Site." },
            { label: "Source of collection", value: "Collected automatically when you access our Site using cookies, log files, web beacons, tags, or pixels." },
            { label: "Disclosure for business purpose", value: "Shared with Shopify, Razorpay, DTDC, Trackon, Bluedart." }
        ]
    },
    {
        title: "Order Information",
        items: [
            { label: "Examples of Personal Information collected", value: "Name, billing address, shipping address, payment information, email address, and phone number." },
            { label: "Purpose of collection", value: "To provide products or services to you, process your payment information, arrange for shipping, provide invoices and order confirmations, communicate with you, screen orders for potential risk or fraud, and provide you with information relating to our products or services." },
            { label: "Source of collection", value: "Collected from you." },
            { label: "Disclosure for business purpose", value: "Shared with Shopify, Razorpay, DTDC, Trackon, Bluedart." }
        ]
    }
]

const additionalSections = [
    {
        icon: "🤝",
        title: "Sharing Personal Information",
        content: "We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you. We use Shopify to power our online store. We may share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights."
    },
    {
        icon: "🔧",
        title: "Using Personal Information",
        content: "We use your Personal Information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers."
    },
    {
        icon: "🗄️",
        title: "Retention",
        content: "When you place an order through the Site, we will retain your Personal Information for our records unless and until you ask us to erase this information."
    },
    {
        icon: "🔄",
        title: "Changes",
        content: "We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons."
    }
]

export default function PrivacyPage() {
    return (
        <div>
            <PageHeader
                title="Privacy Policy"
                description="How we collect, use, and protect your personal information"
            />

            <div className="content-container py-12 md:py-16">
                <div className="max-w-3xl mx-auto">
                    {/* Introduction */}
                    <div className="bg-party-sky-50 rounded-2xl p-6 mb-10">
                        <p className="text-grey-70 leading-relaxed">
                            This Privacy Policy describes how partybazaar.com (the "Site" or "we") collects, uses, and discloses your Personal Information when you visit or make a purchase from the Site.
                        </p>
                    </div>

                    {/* Main Sections */}
                    {sections.map((section, index) => (
                        <section key={index} className="mb-10">
                            <h2 className="text-xl font-bold text-party-dark mb-4">{section.title}</h2>

                            {section.content && (
                                <p className="text-grey-60 leading-relaxed mb-4">{section.content}</p>
                            )}

                            {section.items && (
                                <div className="bg-white rounded-2xl border border-grey-10 overflow-hidden">
                                    {section.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className={`p-4 ${itemIndex < section.items.length - 1 ? 'border-b border-grey-10' : ''}`}>
                                            <div className="font-medium text-party-dark text-sm mb-1">{item.label}</div>
                                            <div className="text-grey-60 text-sm">{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    ))}

                    {/* Additional Sections */}
                    <div className="space-y-6 mt-12">
                        {additionalSections.map((section, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="text-2xl">{section.icon}</div>
                                <div>
                                    <h3 className="text-lg font-semibold text-party-dark mb-2">{section.title}</h3>
                                    <p className="text-grey-60 leading-relaxed">{section.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Last Updated */}
                    <div className="mt-12 text-center text-grey-50 text-sm">
                        <p>Last updated: January 2025</p>
                    </div>

                    {/* Contact Box */}
                    <div className="mt-8 bg-gradient-to-r from-party-pink-50 to-party-sky-50 rounded-3xl p-8 text-center">
                        <h3 className="text-lg font-semibold text-party-dark mb-3">Questions about your data?</h3>
                        <p className="text-grey-60 mb-4">
                            If you have any questions about this policy or wish to request erasure of your data, contact us.
                        </p>
                        <a
                            href="mailto:support@partybazaar.com"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-party-dark text-white font-medium rounded-full hover:bg-grey-80 transition-colors"
                        >
                            Contact Privacy Team
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

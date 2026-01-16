import { Metadata } from "next"
import PageHeader from "@modules/common/components/page-header"

export const metadata: Metadata = {
    title: "Terms and Conditions | Party Bazaar",
    description: "Read the terms and conditions for using Party Bazaar's website and services.",
}

const sections = [
    {
        icon: "©️",
        title: "Copyright",
        content: "These Terms of Agreement do not give you any right to reproduce, distribute, transmit, publish, or commercially exploit any information and content contained on partybazaar.com."
    },
    {
        icon: "📊",
        title: "Data Integrity",
        content: "partybazaar.com makes best efforts to ensure the integrity and timeliness of our data. While we make every effort to ensure that all information displayed on our Website and in our catalog is correct, sometimes errors can occur. We cannot be responsible for any inaccuracies, typos, misspellings or errors contained within these pages."
    },
    {
        icon: "⚖️",
        title: "Liability Policy",
        content: "Your sole and exclusive remedy against Party Bazaar is limited to the refund or replacement of said merchandise. You shall have no right against Party Bazaar for incidental or consequential damages."
    },
    {
        icon: "♿",
        title: "Accessibility",
        content: "At Party Bazaar, we are committed to ensuring that individuals with disabilities can access the goods, services, and privileges offered on partybazaar.com."
    },
    {
        icon: "🎨",
        title: "Product Colour Disclaimer",
        content: "Due to the many variations in monitors and browsers, colour samples may appear different on different monitors. Computer monitors are not all calibrated equally and colour reproduction on the Internet is not precise. Since it is not possible to guarantee our online colours will look the same on all computers, we do not guarantee that what you see accurately portrays the colour of the actual product. We do our very best to make sure our pictures are as close to the exact product as possible, but cannot guarantee that what you see is an exact sample."
    }
]

export default function TermsPage() {
    return (
        <div>
            <PageHeader
                title="Terms and Conditions"
                description="Please read these terms carefully before using our website"
            />

            <div className="content-container py-12 md:py-16">
                <div className="max-w-3xl mx-auto">
                    {/* Introduction */}
                    <div className="mb-10 text-center">
                        <p className="text-grey-60">
                            By accessing and using partybazaar.com, you agree to be bound by these Terms and Conditions.
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="space-y-8">
                        {sections.map((section, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-grey-10 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="text-3xl">{section.icon}</div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-party-dark mb-3">{section.title}</h3>
                                        <p className="text-grey-60 leading-relaxed">{section.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Last Updated */}
                    <div className="mt-12 text-center text-grey-50 text-sm">
                        <p>Last updated: January 2025</p>
                    </div>

                    {/* Contact Box */}
                    <div className="mt-8 bg-grey-5 rounded-3xl p-8 text-center">
                        <h3 className="text-lg font-semibold text-party-dark mb-3">Questions about our Terms?</h3>
                        <p className="text-grey-60 mb-4">
                            If you have any questions regarding these terms, please contact us.
                        </p>
                        <a
                            href="mailto:support@partybazaar.com"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-party-dark text-white font-medium rounded-full hover:bg-grey-80 transition-colors"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

import { Metadata } from "next"
import PageHeader from "@modules/common/components/page-header"

export const metadata: Metadata = {
    title: "Contact Us | Party Bazaar",
    description: "Get in touch with Party Bazaar. We're here to help with your party supply needs.",
}

export default function ContactPage() {
    return (
        <div>
            <PageHeader
                title="Contact Us"
                description="We'd love to hear from you! Get in touch with our team."
            />

            <div className="content-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-party-dark mb-6">Get In Touch</h2>

                            <div className="space-y-6">
                                {/* WhatsApp */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                                        💬
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-party-dark mb-1">WhatsApp</h3>
                                        <a
                                            href="https://wa.me/918130097893"
                                            className="text-grey-60 hover:text-party-dark transition-colors"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            +91 81300 97893
                                        </a>
                                        <p className="text-grey-40 text-sm mt-1">Fastest response</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-party-sky-50 flex items-center justify-center text-2xl">
                                        ✉️
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-party-dark mb-1">Email</h3>
                                        <a
                                            href="mailto:support@partybazaar.com"
                                            className="text-grey-60 hover:text-party-dark transition-colors"
                                        >
                                            support@partybazaar.com
                                        </a>
                                        <p className="text-grey-40 text-sm mt-1">We reply within 24 hours</p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-party-pink-50 flex items-center justify-center text-2xl">
                                        📍
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-party-dark mb-1">Address</h3>
                                        <p className="text-grey-60">
                                            Party Bazaar (BDC Overseas)<br />
                                            Mumbai, Maharashtra<br />
                                            India
                                        </p>
                                    </div>
                                </div>

                                {/* Business Hours */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
                                        🕐
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-party-dark mb-1">Business Hours</h3>
                                        <p className="text-grey-60">
                                            Monday - Saturday: 10:00 AM - 7:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-grey-5 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-party-dark mb-6">Send a Message</h2>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-grey-70 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-grey-20 focus:border-party-dark focus:ring-1 focus:ring-party-dark outline-none transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-grey-70 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl border border-grey-20 focus:border-party-dark focus:ring-1 focus:ring-party-dark outline-none transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-grey-70 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-grey-20 focus:border-party-dark focus:ring-1 focus:ring-party-dark outline-none transition-colors"
                                        placeholder="Order Inquiry"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-grey-70 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-grey-20 focus:border-party-dark focus:ring-1 focus:ring-party-dark outline-none transition-colors resize-none"
                                        placeholder="Tell us how we can help..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-party-dark text-white font-medium rounded-full hover:bg-grey-80 transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* FAQ Teaser */}
                    <div className="mt-16 text-center bg-gradient-to-r from-party-pink-50 to-party-sky-50 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold text-party-dark mb-4">Have Questions?</h2>
                        <p className="text-grey-60 mb-6">Check out our frequently asked questions for quick answers.</p>
                        <a
                            href="/faq"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-party-dark text-white font-medium rounded-full hover:bg-grey-80 transition-colors"
                        >
                            View FAQs
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

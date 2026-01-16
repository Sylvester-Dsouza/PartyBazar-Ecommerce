import { Metadata } from "next"
import PageHeader from "@modules/common/components/page-header"

export const metadata: Metadata = {
    title: "About Us | Party Bazaar",
    description: "Step into the world of luxury celebrations with Party Bazaar — India's premier destination for premium party supplies with 18+ years of experience.",
}

const coreValues = [
    {
        title: "Exceptional Quality",
        description: "Only the finest materials and brands make it to our store.",
        icon: "✨"
    },
    {
        title: "Seamless Experience",
        description: "Fast, reliable delivery with unmatched customer service.",
        icon: "🚀"
    },
    {
        title: "Conscious Celebrations",
        description: "Committed to eco-friendly materials & sustainable sourcing.",
        icon: "🌱"
    },
    {
        title: "Design Meets Value",
        description: "Unique, on-trend designs at competitive prices.",
        icon: "💎"
    }
]

const partners = ["Grabo", "Folat", "Anagram"]

export default function AboutPage() {
    return (
        <div>
            <PageHeader
                title="About Us"
                description="India's premier destination for premium party supplies"
            />

            <div className="content-container py-12 md:py-16">
                {/* Welcome Section */}
                <section className="mb-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-party-dark mb-6">
                            Welcome to Party Bazaar
                        </h2>
                        <p className="text-grey-60 text-lg leading-relaxed mb-6">
                            Step into the world of luxury celebrations with Party Bazaar, a brand by BDC OVERSEAS — India's premier destination for premium party supplies. With <strong className="text-party-dark">18+ years of trade experience</strong>, we bring you handpicked, top-quality decor sourced globally to make every celebration stylish, elegant, and unforgettable.
                        </p>
                        <p className="text-grey-60 text-lg leading-relaxed">
                            We blend creativity with conscious choices — offering eco-friendly alternatives without compromising on charm or quality. We're also proud to be the official online partner for <strong className="text-party-dark">Party In A Box</strong>, making premium party kits and curated themes more accessible than ever.
                        </p>
                    </div>
                </section>

                {/* Core Values */}
                <section className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-party-dark text-center mb-10">
                        Our Core Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreValues.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 border border-grey-10 hover:shadow-lg transition-shadow text-center"
                            >
                                <div className="text-4xl mb-4">{value.icon}</div>
                                <h3 className="text-lg font-semibold text-party-dark mb-2">{value.title}</h3>
                                <p className="text-grey-60 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Partners */}
                <section className="mb-16 bg-grey-5 rounded-3xl p-8 md:p-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-party-dark text-center mb-6">
                        Our Partners
                    </h2>
                    <p className="text-grey-60 text-center max-w-2xl mx-auto mb-8">
                        We proudly collaborate with world-renowned brands — offering globally trusted, certified products designed to deliver a premium experience for every celebration.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {partners.map((partner, index) => (
                            <span
                                key={index}
                                className="px-6 py-3 bg-white rounded-full border border-grey-20 text-party-dark font-medium"
                            >
                                {partner}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Sustainability */}
                <section className="mb-16">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-party-dark mb-6">
                                Our Promise of Sustainability
                            </h2>
                            <p className="text-grey-60 leading-relaxed mb-4">
                                At Party Bazaar, sustainability isn't just a trend — it's a promise. We're committed to responsible sourcing, ethical practices, and eco-conscious packaging.
                            </p>
                            <p className="text-grey-60 leading-relaxed">
                                Every decision we make — from the materials we use to the partners we choose — reflects our mission to protect the planet while spreading joy. We're proud to lead the change in the party industry, offering greener options without compromising on fun.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 text-center">
                            <div className="text-6xl mb-4">🌍</div>
                            <h3 className="text-lg font-semibold text-grey-80 mb-2">Eco-Friendly Materials</h3>
                            <p className="text-grey-60 text-sm">Our balloons are crafted using recycled materials, meeting the highest safety and sustainability standards.</p>
                        </div>
                    </div>
                </section>

                {/* CBA Section */}
                <section className="bg-gradient-to-r from-party-pink-50 to-party-sky-50 rounded-3xl p-8 md:p-12 text-center">
                    <div className="text-5xl mb-4">🎈</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-party-dark mb-4">
                        Certified Balloon Artist (CBA)
                    </h2>
                    <p className="text-grey-60 max-w-2xl mx-auto">
                        At Party Bazaar, every balloon is handpicked and quality-checked by a Certified Balloon Artist (CBA) — ensuring top-tier design, safety, and durability. With a deep understanding of global balloon standards and techniques, our in-house expertise guarantees that what you get is not just a product, but a professionally curated experience made to impress.
                    </p>
                </section>
            </div>
        </div>
    )
}

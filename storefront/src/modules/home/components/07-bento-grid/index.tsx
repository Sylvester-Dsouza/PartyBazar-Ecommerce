"use client"

import { useState } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const BentoGrid = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const bentoItems = [
    {
      id: "express-delivery",
      title: "Express Delivery",
      description: "Same day delivery for last-minute party needs",
      icon: "🚚",
      color: "from-party-sky-400 to-party-sky-600",
      image: "/b1.png",
      size: "full",
      link: "/pages/delivery"
    },
    {
      id: "party-planning",
      title: "Party Planning Guide",
      description: "Complete step-by-step guides for perfect celebrations",
      icon: "📋",
      color: "from-party-pink-400 to-party-pink-600",
      image: "/b2.jpg",
      size: "full",
      link: "/plan-my-event"
    },
    {
      id: "bulk-orders",
      title: "Bulk Orders",
      description: "Special pricing for large events and corporate parties",
      icon: "📦",
      color: "from-purple-400 to-purple-600",
      image: "/b3.jpg",
      size: "top",
      link: "/pages/bulk-orders"
    },
    {
      id: "gift-cards",
      title: "Gift Cards",
      description: "Perfect gift for party lovers and planners",
      icon: "🎁",
      color: "from-yellow-400 to-orange-500",
      image: "/b4.jpg",
      size: "bottom",
      link: "/pages/gift-cards"
    }
  ]

  return (
    <section className="py-12">
      <div className="content-container">
        <div className="mb-8">
          <h2 className="party-heading-md mb-2">Everything You Need for Perfect Parties</h2>
          <p className="text-grey-50">Discover our services and special features designed to make your celebrations unforgettable</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[200px] lg:auto-rows-[250px]">
          {/* First Column - Full Height */}
          <div
            className="relative col-span-1 row-span-2 lg:row-span-2 rounded-3xl overflow-hidden cursor-pointer group"
            onMouseEnter={() => setHoveredItem(bentoItems[0].id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Background Image */}
            <div className={`absolute inset-0 transition-transform duration-500 ${hoveredItem === bentoItems[0].id ? "scale-110" : "scale-100"}`}>
              <Image
                src={bentoItems[0].image}
                alt={bentoItems[0].title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            {/* Content Overlay */}
            <div className="relative z-10 p-8 flex flex-col justify-end h-full text-white drop-shadow-md">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-2">{bentoItems[0].title}</h3>
                <p className="text-white/90 mb-4">{bentoItems[0].description}</p>
                <LocalizedClientLink href={bentoItems[0].link}>
                  <div className="inline-flex items-center gap-2 bg-white text-party-sky-600 px-4 py-2 rounded-full hover:bg-grey-5 transition-colors">
                    <span className="font-medium">Learn More</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </LocalizedClientLink>
              </div>
            </div>
          </div>

          {/* Second Column - Full Height */}
          <div
            className="relative col-span-1 row-span-2 lg:row-span-2 rounded-3xl overflow-hidden cursor-pointer group"
            onMouseEnter={() => setHoveredItem(bentoItems[1].id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Background Image */}
            <div className={`absolute inset-0 transition-transform duration-500 ${hoveredItem === bentoItems[1].id ? "scale-110" : "scale-100"}`}>
              <Image
                src={bentoItems[1].image}
                alt={bentoItems[1].title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            {/* Content Overlay */}
            <div className="relative z-10 p-8 flex flex-col justify-end h-full text-white drop-shadow-md">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-2">{bentoItems[1].title}</h3>
                <p className="text-white/90 mb-4">{bentoItems[1].description}</p>
                <LocalizedClientLink href={bentoItems[1].link}>
                  <div className="inline-flex items-center gap-2 bg-white text-party-pink-600 px-4 py-2 rounded-full hover:bg-grey-5 transition-colors">
                    <span className="font-medium">Start Planning</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </LocalizedClientLink>
              </div>
            </div>
          </div>

          {/* Third Column - Split Layout */}
          <div className="col-span-1 row-span-2 lg:row-span-2 grid grid-rows-2 gap-6">
            {/* Top Item */}
            <div
              className="relative rounded-3xl overflow-hidden cursor-pointer group"
              onMouseEnter={() => setHoveredItem(bentoItems[2].id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Background Image */}
              <div className={`absolute inset-0 transition-transform duration-500 ${hoveredItem === bentoItems[2].id ? "scale-110" : "scale-100"}`}>
                <Image
                  src={bentoItems[2].image}
                  alt={bentoItems[2].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              {/* Content Overlay */}
              <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white drop-shadow-md">
                <div>
                  <h3 className="text-xl font-bold mb-1">{bentoItems[2].title}</h3>
                  <p className="text-white/90 text-sm mb-3">{bentoItems[2].description}</p>
                  <LocalizedClientLink href={bentoItems[2].link}>
                    <div className="inline-flex items-center gap-2 bg-white text-purple-600 px-3 py-1.5 rounded-full hover:bg-grey-5 transition-colors text-sm">
                      <span>Get Quote</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </LocalizedClientLink>
                </div>
              </div>
            </div>

            {/* Bottom Item */}
            <div
              className="relative rounded-3xl overflow-hidden cursor-pointer group"
              onMouseEnter={() => setHoveredItem(bentoItems[3].id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Background Image */}
              <div className={`absolute inset-0 transition-transform duration-500 ${hoveredItem === bentoItems[3].id ? "scale-110" : "scale-100"}`}>
                <Image
                  src={bentoItems[3].image}
                  alt={bentoItems[3].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              {/* Content Overlay */}
              <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white drop-shadow-md">
                <div>
                  <h3 className="text-xl font-bold mb-1">{bentoItems[3].title}</h3>
                  <p className="text-white/90 text-sm mb-3">{bentoItems[3].description}</p>
                  <LocalizedClientLink href={bentoItems[3].link}>
                    <div className="inline-flex items-center gap-2 bg-white text-orange-600 px-3 py-1.5 rounded-full hover:bg-grey-5 transition-colors text-sm">
                      <span>Buy Now</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BentoGrid

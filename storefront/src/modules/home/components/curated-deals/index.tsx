"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CuratedDeals = () => {
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})

  const handleImageError = (imageKey: string) => {
    setImageErrors(prev => ({ ...prev, [imageKey]: true }))
  }

  return (
    <section className="py-12">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Banner - Curated Deals */}
          <div className={`relative rounded-3xl overflow-hidden h-[300px] md:h-[400px] ${
            imageErrors['deals'] 
              ? 'bg-gradient-to-br from-party-sky-400 to-party-sky-600' 
              : 'bg-party-sky-400'
          }`}>
            {!imageErrors['deals'] && (
              <img
                src="https://images.unsplash.com/photo-1545147508-91576a5343a2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Party decorations and supplies"
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => handleImageError('deals')}
              />
            )}
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start text-left relative z-10">
              <span className="text-white/90 text-sm font-medium mb-2 tracking-wide">SPECIAL OFFER</span>
              <h3 className="text-white text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Curated Deals
              </h3>
              <LocalizedClientLink href="/collections/deals">
                <button className="bg-white text-party-sky-600 px-6 py-3 rounded-full font-semibold hover:bg-grey-5 transition-colors shadow-lg">
                  Shop Now
                </button>
              </LocalizedClientLink>
            </div>
          </div>

          {/* Right Banner - New Arrivals */}
          <div className={`relative rounded-3xl overflow-hidden h-[300px] md:h-[400px] ${
            imageErrors['arrivals'] 
              ? 'bg-gradient-to-br from-party-pink-200 to-party-pink-400' 
              : 'bg-party-pink-100'
          }`}>
            {!imageErrors['arrivals'] && (
              <img
                src="https://images.unsplash.com/photo-1767669685189-f745b16342db?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Birthday party celebration with balloons and decorations"
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => handleImageError('arrivals')}
              />
            )}
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start text-left relative z-10">
              <span className="text-white/90 text-sm font-medium mb-2 tracking-wide">JUST ARRIVED</span>
              <h3 className="text-white text-3xl md:text-4xl font-bold mb-4 leading-tight">
                New Arrivals
              </h3>
              <LocalizedClientLink href="/collections/new-arrivals">
                <button className="bg-white text-party-pink-600 px-6 py-3 rounded-full font-semibold hover:bg-grey-5 transition-colors shadow-lg">
                  Explore Collection
                </button>
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CuratedDeals

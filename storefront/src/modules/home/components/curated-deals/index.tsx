import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CuratedDeals = () => {
  return (
    <section className="py-12">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Banner - Curated Deals */}
          <div className="relative bg-party-sky-400 rounded-3xl overflow-hidden h-[300px] md:h-[400px]">
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <span className="text-white/80 text-sm font-medium mb-2">SPECIAL OFFER</span>
              <h3 className="text-white text-3xl md:text-4xl font-bold mb-4">
                Curated Deals
              </h3>
              <LocalizedClientLink href="/collections/deals">
                <button className="bg-white text-party-sky-600 px-6 py-3 rounded-full font-semibold hover:bg-grey-5 transition-colors">
                  Shop Now
                </button>
              </LocalizedClientLink>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-white/20 rounded-full"></div>
            <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full"></div>
          </div>

          {/* Right Banner - New Arrivals */}
          <div className="relative bg-party-pink-100 rounded-3xl overflow-hidden h-[300px] md:h-[400px]">
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <span className="text-party-pink-600 text-sm font-medium mb-2">JUST ARRIVED</span>
              <h3 className="text-grey-90 text-3xl md:text-4xl font-bold mb-4">
                New Arrivals
              </h3>
              <LocalizedClientLink href="/collections/new-arrivals">
                <button className="bg-party-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-party-pink-600 transition-colors">
                  Explore Collection
                </button>
              </LocalizedClientLink>
            </div>
            {/* Decorative party items */}
            <div className="absolute top-5 right-5 text-6xl">🎉</div>
            <div className="absolute top-20 right-20 text-4xl">🎈</div>
            <div className="absolute bottom-20 right-10 text-5xl">🎁</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CuratedDeals

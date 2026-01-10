import LocalizedClientLink from "@modules/common/components/localized-client-link"

const KawaiiBanner = () => {
  return (
    <section className="py-12">
      <div className="content-container">
        <div className="relative bg-party-sky-50 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            {/* Left - Content */}
            <div className="p-8 md:p-12 order-2 md:order-1">
              <span className="text-party-sky-600 text-sm font-medium uppercase tracking-wide">Kids Favorite</span>
              <h3 className="text-3xl md:text-4xl font-bold text-grey-90 mt-2 mb-4">
                Kawaii Party
                <br />
                Essentials
              </h3>
              <p className="text-grey-60 mb-6 max-w-md">
                Adorable and fun party supplies that kids absolutely love. Perfect for birthday parties and special celebrations.
              </p>
              <LocalizedClientLink href="/collections/kawaii">
                <button className="party-btn-primary">
                  Shop Now
                </button>
              </LocalizedClientLink>
            </div>

            {/* Right - Image placeholder */}
            <div className="h-[300px] md:h-[400px] relative flex items-center justify-center order-1 md:order-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-6xl">👧</div>
                <div className="text-6xl">🎂</div>
                <div className="text-6xl">🧁</div>
                <div className="text-6xl">🎈</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default KawaiiBanner

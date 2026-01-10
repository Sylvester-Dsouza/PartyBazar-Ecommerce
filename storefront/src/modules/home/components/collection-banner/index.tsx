import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CollectionBanner = () => {
  return (
    <section className="py-12">
      <div className="content-container">
        <div className="relative bg-gradient-to-r from-party-pink-200 to-party-pink-100 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            {/* Left - Image placeholder */}
            <div className="h-[300px] md:h-[400px] relative flex items-center justify-center">
              <div className="text-8xl">🌸</div>
              <div className="absolute top-10 left-10 text-4xl">✨</div>
              <div className="absolute bottom-10 right-10 text-4xl">🎀</div>
            </div>

            {/* Right - Content */}
            <div className="p-8 md:p-12">
              <span className="text-party-pink-600 text-sm font-medium uppercase tracking-wide">Featured Collection</span>
              <h3 className="text-3xl md:text-4xl font-bold text-grey-90 mt-2 mb-4">
                Ambient Blossom
                <br />
                Collection
              </h3>
              <p className="text-grey-60 mb-6 max-w-md">
                Elegant floral-themed party supplies perfect for spring celebrations, garden parties, and romantic events.
              </p>
              <LocalizedClientLink href="/collections/ambient-blossom">
                <button className="party-btn-primary">
                  Shop Collection
                </button>
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CollectionBanner

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden -mt-16" style={{ backgroundColor: '#F2EDE9' }}>
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] py-4 pt-20">
          {/* Left Content */}
          <div className="z-10 space-y-6 flex flex-col justify-center lg:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-grey-90 leading-tight">
              <span className="block">Make Your Next Party</span>
              <span className="text-pink-500">Unforgettable.</span>
            </h1>
            <p className="text-grey-70 text-lg md:text-xl max-w-lg">
              Shop curated party essentials designed to make hosting effortless. Discover everything you need for magical moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <LocalizedClientLink href="/store">
                <button className="party-btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 18.333a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666zM16.667 18.333a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666zM.833 1.667h2.5L5.4 11.992a1.667 1.667 0 0 0 1.667 1.341h8.1a1.667 1.667 0 0 0 1.666-1.341l1.334-7H4.167" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Browse Shop
                </button>
              </LocalizedClientLink>
              <LocalizedClientLink href="/plan-my-event">
                <button className="party-btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.833 3.333H4.167c-.92 0-1.667.746-1.667 1.667v11.667c0 .92.746 1.666 1.667 1.666h11.666c.92 0 1.667-.746 1.667-1.666V5c0-.92-.746-1.667-1.667-1.667zM13.333 1.667V5M6.667 1.667V5M2.5 8.333h15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Plan Your Party
                </button>
              </LocalizedClientLink>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative flex items-center justify-center lg:justify-end h-[400px] md:h-[500px] lg:h-[600px]">
            {/* Decorative shapes behind image */}
            <div className="absolute top-10 left-10 w-20 h-20 md:w-32 md:h-32 bg-pink-300 rounded-full opacity-40 blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 md:w-24 md:h-24 bg-cyan-300 rounded-full opacity-40 blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-purple-300 rounded-full opacity-30 blur-2xl"></div>
            
            {/* Hero Image */}
            <div className="relative z-10 w-full max-w-md md:max-w-lg lg:max-w-xl">
              <img
                src="/hero-image.png"
                alt="Party Bazaar - Party Supplies and Decorations"
                className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

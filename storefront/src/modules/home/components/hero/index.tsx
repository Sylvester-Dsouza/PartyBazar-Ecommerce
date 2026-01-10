import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: '#F2EDE9' }}>
      {/* Decorative confetti elements */}
      <div className="absolute top-20 left-10 text-pink-400 text-2xl animate-pulse">~</div>
      <div className="absolute top-40 left-20 text-purple-400 text-xl">~</div>
      <div className="absolute bottom-32 left-16 text-pink-400 text-2xl">~</div>
      <div className="absolute top-32 right-1/3 text-yellow-400 text-3xl">✦</div>
      <div className="absolute bottom-40 right-1/4 text-cyan-400 text-2xl">~</div>
      
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[600px] py-4">
          {/* Left Content */}
          <div className="z-10 space-y-6 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-grey-90 leading-tight">
              Make Your Next Party
              <br />
              <span className="text-pink-500">Unforgettable.</span>
            </h1>
            <p className="text-grey-70 text-lg max-w-md">
              Shop curated party essentials designed to make hosting effortless.
            </p>
            <div className="flex flex-wrap gap-4">
              <LocalizedClientLink href="/store">
                <button className="party-btn-primary flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 18.333a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666zM16.667 18.333a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666zM.833 1.667h2.5L5.4 11.992a1.667 1.667 0 0 0 1.667 1.341h8.1a1.667 1.667 0 0 0 1.666-1.341l1.334-7H4.167" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Browse Shop
                </button>
              </LocalizedClientLink>
              <LocalizedClientLink href="/plan-my-event">
                <button className="party-btn-secondary flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.833 3.333H4.167c-.92 0-1.667.746-1.667 1.667v11.667c0 .92.746 1.666 1.667 1.666h11.666c.92 0 1.667-.746 1.667-1.666V5c0-.92-.746-1.667-1.667-1.667zM13.333 1.667V5M6.667 1.667V5M2.5 8.333h15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Plan Your Party
                </button>
              </LocalizedClientLink>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative h-[650px] lg:h-[750px] -mb-12 -mt-16">
            <img
              src="/hero-image.png"
              alt="Party Bazaar - Party Supplies and Decorations"
              className="w-full h-full object-contain object-center scale-125"
            />
            {/* Decorative shapes behind image */}
            <div className="absolute top-10 right-20 w-32 h-32 bg-pink-300 rounded-full opacity-40 -z-10"></div>
            <div className="absolute top-32 right-10 w-24 h-24 bg-cyan-300 rounded-full opacity-40 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

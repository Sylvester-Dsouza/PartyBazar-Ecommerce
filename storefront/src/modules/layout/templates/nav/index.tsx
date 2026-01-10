import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto duration-200" style={{ backgroundColor: '#F2EDE9' }}>
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Logo - Left */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              <img
                src="/pb-logo.webp"
                alt="Party Bazaar"
                className="h-16 w-auto"
              />
            </LocalizedClientLink>
          </div>

          {/* Center Navigation - Desktop Only */}
          <div className="hidden lg:flex items-center gap-x-8 h-full">
            <LocalizedClientLink
              href="/store"
              className="text-sm font-medium text-grey-70 hover:text-party-dark transition-colors flex items-center gap-1"
            >
              Shop All
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/occasions"
              className="text-sm font-medium text-grey-70 hover:text-party-dark transition-colors flex items-center gap-1"
            >
              Occasions
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/themes"
              className="text-sm font-medium text-grey-70 hover:text-party-dark transition-colors flex items-center gap-1"
            >
              Themes
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/party-supplies"
              className="text-sm font-medium text-grey-70 hover:text-party-dark transition-colors flex items-center gap-1"
            >
              Party Supplies
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/plan-my-event"
              className="text-sm font-medium text-white bg-party-sky-500 px-4 py-2 rounded-full hover:bg-party-sky-600 transition-colors flex items-center gap-1"
            >
              Plan My Event
              <span className="bg-white text-party-sky-500 text-xs px-2 py-0.5 rounded-full font-bold">New</span>
            </LocalizedClientLink>
          </div>

          {/* Right Side - Search, Account, Cart, Menu */}
          <div className="flex items-center gap-x-4 h-full">
            {/* Search Icon */}
            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-grey-5 transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Account Icon */}
            <LocalizedClientLink
              href="/account"
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-grey-5 transition-colors"
              data-testid="nav-account-link"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.667 17.5v-1.667a3.333 3.333 0 0 0-3.334-3.333H6.667a3.333 3.333 0 0 0-3.334 3.333V17.5M10 9.167A3.333 3.333 0 1 0 10 2.5a3.333 3.333 0 0 0 0 6.667z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </LocalizedClientLink>

            {/* Cart Button */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-party-dark text-white hover:bg-grey-80 transition-colors relative"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 18.333a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666zM16.667 18.333a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666zM.833 1.667h2.5L5.4 11.992a1.667 1.667 0 0 0 1.667 1.341h8.1a1.667 1.667 0 0 0 1.666-1.341l1.334-7H4.167" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>

            {/* Mobile Menu - Right Side */}
            <div className="lg:hidden h-full">
              <SideMenu regions={regions} />
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

"use client"

import { Suspense, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { listRegions } from "@lib/data/regions"
import { getMenu, MenuItem } from "@lib/data/menu"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import SearchButton from "@modules/layout/components/search-button"

export default function Nav() {
  const pathname = usePathname()
  const [regions, setRegions] = useState<StoreRegion[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Check if we're on the home page (root path or just country code like /us, /in)
  const isHomePage = pathname === "/" || /^\/[a-z]{2}$/.test(pathname)

  useEffect(() => {
    listRegions().then((regions: StoreRegion[]) => setRegions(regions))

    // Fetch dynamic menu
    getMenu("main-menu").then((menu) => {
      if (menu && menu.items) {
        setMenuItems(menu.items)
      }
    })

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Set scrolled state for background/shadow
      setIsScrolled(currentScrollY > 10)

      // Hide/show header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide header
        setIsVisible(false)
      } else {
        // Scrolling up or at top - show header
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <>
      <div className={`
        ${isHomePage ? 'fixed' : 'sticky'} top-0 inset-x-0 z-50 group transition-transform duration-300 
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      `}>
        <header
          className={`
            relative h-16 mx-auto duration-200 transition-all duration-300
            ${isHomePage
              ? (isScrolled
                ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-grey-10'
                : 'bg-transparent')
              : 'bg-white shadow-md border-b border-grey-10'
            }
          `}
        >
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

            {/* Center Navigation - Desktop Only - Dynamic from API */}
            <div className="hidden lg:flex items-center gap-x-8 h-full">
              {menuItems.map((item) => (
                <div key={item.id} className="relative group h-full flex items-center">
                  <LocalizedClientLink
                    href={item.url}
                    className={`text-sm font-medium transition-colors flex items-center gap-1 py-2 ${isScrolled
                      ? 'text-grey-70 hover:text-party-dark'
                      : 'text-party-dark hover:text-party-darker'
                      }`}
                    target={item.open_in_new_tab ? "_blank" : undefined}
                    rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                  >
                    {item.title}
                    {item.children && item.children.length > 0 && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className="transition-transform group-hover:rotate-180"
                      >
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </LocalizedClientLink>

                  {/* Dropdown for items with children */}
                  {item.children && item.children.length > 0 && (
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-xl shadow-lg border border-grey-10 py-2 min-w-[200px]">
                        {item.children.map((child) => (
                          <LocalizedClientLink
                            key={child.id}
                            href={child.url}
                            className="block px-4 py-2 text-sm text-grey-70 hover:text-party-dark hover:bg-grey-5 transition-colors"
                            target={child.open_in_new_tab ? "_blank" : undefined}
                            rel={child.open_in_new_tab ? "noopener noreferrer" : undefined}
                          >
                            {child.title}
                          </LocalizedClientLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side - Search, Account, Cart, Menu */}
            <div className="flex items-center gap-x-4 h-full">
              {/* Search Button - Client Component */}
              <SearchButton countryCode={regions[0]?.countries?.[0]?.iso_2 || "us"} />

              {/* Account Icon */}
              <LocalizedClientLink
                href="/account"
                className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isScrolled ? 'hover:bg-grey-5' : 'hover:bg-white/20'
                  }`}
                data-testid="nav-account-link"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.667 17.5v-1.667a3.333 3.333 0 0 0-3.334-3.333H6.667a3.333 3.333 0 0 0-3.334 3.333V17.5M10 9.167A3.333 3.333 0 1 0 10 2.5a3.333 3.333 0 0 0 0 6.667z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </LocalizedClientLink>

              {/* Cart Button */}
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors relative ${isScrolled
                      ? 'bg-party-dark text-white hover:bg-grey-80'
                      : 'bg-party-dark text-white hover:bg-grey-80'
                      }`}
                    href="/cart"
                    data-testid="nav-cart-link"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 18.333a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666zM16.667 18.333a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666zM.833 1.667h2.5L5.4 11.992a1.667 1.667 0 0 0 1.667 1.341h8.1a1.667 1.667 0 0 0 1.666-1.341l1.334-7H4.167" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>

              {/* Mobile Menu - Right Side */}
              <div className="lg:hidden h-full">
                <SideMenu regions={regions} menuItems={menuItems} />
              </div>
            </div>
          </nav>
        </header>
      </div>
    </>
  )
}


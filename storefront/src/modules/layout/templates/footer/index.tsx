import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Clean SVG Icons
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

// Trust badge icons
const TruckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
)

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
)

const ReturnIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
  </svg>
)

const SupportIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
  </svg>
)

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-grey-5 border-t border-grey-20">
      {/* Main Footer Content */}
      <div className="content-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <LocalizedClientLink href="/" className="inline-block mb-4">
              <Image
                src="/pb-logo.webp"
                alt="Party Bazaar"
                width={150}
                height={40}
              />
            </LocalizedClientLink>
            <p className="text-grey-60 text-sm mb-6 max-w-xs">
              Your one-stop shop for all party supplies. Making celebrations memorable since 2024.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-grey-20 flex items-center justify-center text-grey-60 hover:bg-party-sky-500 hover:text-white hover:border-party-sky-500 transition-all">
                <FacebookIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-grey-20 flex items-center justify-center text-grey-60 hover:bg-gradient-to-br hover:from-party-pink-500 hover:to-party-pink-600 hover:text-white hover:border-transparent transition-all">
                <InstagramIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-grey-20 flex items-center justify-center text-grey-60 hover:bg-party-dark hover:text-white hover:border-party-dark transition-all">
                <TwitterIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-grey-20 flex items-center justify-center text-grey-60 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-semibold text-party-dark mb-4">Shop</h4>
            <ul className="space-y-3 text-grey-60 text-sm">
              <li>
                <LocalizedClientLink href="/store" className="hover:text-party-sky-500 transition-colors">
                  All Products
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections/new-arrivals" className="hover:text-party-sky-500 transition-colors">
                  New Arrivals
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections/best-sellers" className="hover:text-party-sky-500 transition-colors">
                  Best Sellers
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections/sale" className="hover:text-party-sky-500 transition-colors">
                  Sale
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections/bundles" className="hover:text-party-sky-500 transition-colors">
                  Party Bundles
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="font-semibold text-party-dark mb-4">Categories</h4>
            <ul className="space-y-3 text-grey-60 text-sm">
              <li>
                <LocalizedClientLink href="/categories/balloons" className="hover:text-party-sky-500 transition-colors">
                  Balloons
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/categories/decorations" className="hover:text-party-sky-500 transition-colors">
                  Decorations
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/categories/tableware" className="hover:text-party-sky-500 transition-colors">
                  Tableware
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/categories/party-favors" className="hover:text-party-sky-500 transition-colors">
                  Party Favors
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/categories/costumes" className="hover:text-party-sky-500 transition-colors">
                  Costumes
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-semibold text-party-dark mb-4">Support</h4>
            <ul className="space-y-3 text-grey-60 text-sm">
              <li>
                <LocalizedClientLink href="/contact" className="hover:text-party-sky-500 transition-colors">
                  Contact Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/faq" className="hover:text-party-sky-500 transition-colors">
                  FAQs
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/shipping" className="hover:text-party-sky-500 transition-colors">
                  Shipping Info
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/returns" className="hover:text-party-sky-500 transition-colors">
                  Returns & Refunds
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/track-order" className="hover:text-party-sky-500 transition-colors">
                  Track Order
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-party-dark mb-4">Company</h4>
            <ul className="space-y-3 text-grey-60 text-sm">
              <li>
                <LocalizedClientLink href="/about" className="hover:text-party-sky-500 transition-colors">
                  About Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/blog" className="hover:text-party-sky-500 transition-colors">
                  Party Blog
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/careers" className="hover:text-party-sky-500 transition-colors">
                  Careers
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/privacy" className="hover:text-party-sky-500 transition-colors">
                  Privacy Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/terms" className="hover:text-party-sky-500 transition-colors">
                  Terms of Service
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-grey-20">
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-3 text-grey-70">
              <div className="w-12 h-12 rounded-full bg-party-sky-50 flex items-center justify-center text-party-sky-500">
                <TruckIcon />
              </div>
              <span className="text-sm font-medium">Free Shipping over ₹499</span>
            </div>
            <div className="flex items-center gap-3 text-grey-70">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <ShieldIcon />
              </div>
              <span className="text-sm font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-3 text-grey-70">
              <div className="w-12 h-12 rounded-full bg-party-pink-50 flex items-center justify-center text-party-pink-500">
                <ReturnIcon />
              </div>
              <span className="text-sm font-medium">Easy Returns</span>
            </div>
            <div className="flex items-center gap-3 text-grey-70">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <SupportIcon />
              </div>
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <span className="text-grey-50 text-sm">We Accept:</span>
            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-white border border-grey-20 rounded text-xs font-medium text-grey-60">VISA</div>
              <div className="px-3 py-1.5 bg-white border border-grey-20 rounded text-xs font-medium text-grey-60">Mastercard</div>
              <div className="px-3 py-1.5 bg-white border border-grey-20 rounded text-xs font-medium text-grey-60">UPI</div>
              <div className="px-3 py-1.5 bg-white border border-grey-20 rounded text-xs font-medium text-grey-60">GPay</div>
              <div className="px-3 py-1.5 bg-white border border-grey-20 rounded text-xs font-medium text-grey-60">PhonePe</div>
              <div className="px-3 py-1.5 bg-white border border-grey-20 rounded text-xs font-medium text-grey-60">COD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-grey-20">
        <div className="content-container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-grey-50 text-sm">
            <Text>
              © {new Date().getFullYear()} Party Bazaar. All rights reserved.
            </Text>
            <div className="flex items-center gap-6">
              <LocalizedClientLink href="/privacy" className="hover:text-party-dark transition-colors">
                Privacy
              </LocalizedClientLink>
              <LocalizedClientLink href="/terms" className="hover:text-party-dark transition-colors">
                Terms
              </LocalizedClientLink>
              <LocalizedClientLink href="/sitemap" className="hover:text-party-dark transition-colors">
                Sitemap
              </LocalizedClientLink>
            </div>
            <Text className="text-grey-40">
              Made with ❤️ in India
            </Text>
          </div>
        </div>
      </div>
    </footer>
  )
}

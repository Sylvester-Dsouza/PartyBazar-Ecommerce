import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-grey-90 text-white">
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
                className="brightness-0 invert"
              />
            </LocalizedClientLink>
            <p className="text-grey-30 text-sm mb-6 max-w-xs">
              Your one-stop shop for all party supplies. Making celebrations memorable since 2024.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-grey-70 flex items-center justify-center hover:bg-party-pink-500 transition-colors">
                <span className="text-lg">📘</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-grey-70 flex items-center justify-center hover:bg-party-pink-500 transition-colors">
                <span className="text-lg">📸</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-grey-70 flex items-center justify-center hover:bg-party-pink-500 transition-colors">
                <span className="text-lg">🐦</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-grey-70 flex items-center justify-center hover:bg-party-pink-500 transition-colors">
                <span className="text-lg">📌</span>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-3 text-grey-30 text-sm">
              <li>
                <LocalizedClientLink href="/store" className="hover:text-party-pink-400 transition-colors">
                  All Products
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections/new-arrivals" className="hover:text-party-pink-400 transition-colors">
                  New Arrivals
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections/best-sellers" className="hover:text-party-pink-400 transition-colors">
                  Best Sellers
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections/sale" className="hover:text-party-pink-400 transition-colors">
                  Sale
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections/bundles" className="hover:text-party-pink-400 transition-colors">
                  Party Bundles
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-3 text-grey-30 text-sm">
              <li>
                <LocalizedClientLink href="/categories/balloons" className="hover:text-party-pink-400 transition-colors">
                  Balloons
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/categories/decorations" className="hover:text-party-pink-400 transition-colors">
                  Decorations
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/categories/tableware" className="hover:text-party-pink-400 transition-colors">
                  Tableware
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/categories/party-favors" className="hover:text-party-pink-400 transition-colors">
                  Party Favors
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/categories/costumes" className="hover:text-party-pink-400 transition-colors">
                  Costumes
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3 text-grey-30 text-sm">
              <li>
                <LocalizedClientLink href="/contact" className="hover:text-party-pink-400 transition-colors">
                  Contact Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/faq" className="hover:text-party-pink-400 transition-colors">
                  FAQs
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/shipping" className="hover:text-party-pink-400 transition-colors">
                  Shipping Info
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/returns" className="hover:text-party-pink-400 transition-colors">
                  Returns & Refunds
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/track-order" className="hover:text-party-pink-400 transition-colors">
                  Track Order
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-grey-30 text-sm">
              <li>
                <LocalizedClientLink href="/about" className="hover:text-party-pink-400 transition-colors">
                  About Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/blog" className="hover:text-party-pink-400 transition-colors">
                  Party Blog
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/careers" className="hover:text-party-pink-400 transition-colors">
                  Careers
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/privacy" className="hover:text-party-pink-400 transition-colors">
                  Privacy Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/terms" className="hover:text-party-pink-400 transition-colors">
                  Terms of Service
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-grey-70">
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-grey-30">
              <span className="text-2xl">🚚</span>
              <span className="text-sm">Free Shipping over ₹499</span>
            </div>
            <div className="flex items-center gap-2 text-grey-30">
              <span className="text-2xl">🔒</span>
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-grey-30">
              <span className="text-2xl">↩️</span>
              <span className="text-sm">Easy Returns</span>
            </div>
            <div className="flex items-center gap-2 text-grey-30">
              <span className="text-2xl">💬</span>
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <span className="text-grey-40 text-sm">We Accept:</span>
            <div className="flex gap-3">
              <div className="w-12 h-8 bg-grey-70 rounded flex items-center justify-center text-xs text-grey-30">VISA</div>
              <div className="w-12 h-8 bg-grey-70 rounded flex items-center justify-center text-xs text-grey-30">MC</div>
              <div className="w-12 h-8 bg-grey-70 rounded flex items-center justify-center text-xs text-grey-30">UPI</div>
              <div className="w-12 h-8 bg-grey-70 rounded flex items-center justify-center text-xs text-grey-30">GPay</div>
              <div className="w-12 h-8 bg-grey-70 rounded flex items-center justify-center text-xs text-grey-30">PhonePe</div>
              <div className="w-12 h-8 bg-grey-70 rounded flex items-center justify-center text-xs text-grey-30">COD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-grey-80">
        <div className="content-container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-grey-40 text-sm">
            <Text>
              © {new Date().getFullYear()} Party Bazaar. All rights reserved.
            </Text>
            <div className="flex items-center gap-6">
              <LocalizedClientLink href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </LocalizedClientLink>
              <LocalizedClientLink href="/terms" className="hover:text-white transition-colors">
                Terms
              </LocalizedClientLink>
              <LocalizedClientLink href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </LocalizedClientLink>
            </div>
            <Text className="text-grey-50">
              Made with 🎉 in India
            </Text>
          </div>
        </div>
      </div>
    </footer>
  )
}

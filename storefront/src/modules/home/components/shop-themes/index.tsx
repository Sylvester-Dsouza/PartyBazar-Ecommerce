"use client"

import { ChevronLeft, ChevronRight } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const themes = [
  { id: 1, name: "Pastel Dreams", color: "bg-party-pink-100", emoji: "🎀" },
  { id: 2, name: "Ocean Blue", color: "bg-party-sky-100", emoji: "🌊" },
  { id: 3, name: "Golden Glam", color: "bg-yellow-100", emoji: "✨" },
  { id: 4, name: "Tropical Vibes", color: "bg-green-100", emoji: "🌴" },
  { id: 5, name: "Princess Party", color: "bg-purple-100", emoji: "👑" },
  { id: 6, name: "Safari Adventure", color: "bg-orange-100", emoji: "🦁" },
  { id: 7, name: "Space Explorer", color: "bg-indigo-100", emoji: "🚀" },
  { id: 8, name: "Unicorn Magic", color: "bg-pink-100", emoji: "🦄" },
]

const ShopThemes = () => {
  return (
    <section className="py-12">
      <div className="content-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="party-heading-md">Shop Party Themes</h2>
            <p className="text-grey-50 mt-1">Find the perfect theme for your celebration</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-grey-20 flex items-center justify-center hover:bg-grey-5 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border border-grey-20 flex items-center justify-center hover:bg-grey-5 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {themes.map((theme) => (
            <LocalizedClientLink
              key={theme.id}
              href={`/collections/${theme.name.toLowerCase().replace(" ", "-")}`}
              className="flex-shrink-0 group"
            >
              <div className={`w-32 h-32 md:w-40 md:h-40 ${theme.color} rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-shadow`}>
                <span className="text-5xl">{theme.emoji}</span>
              </div>
              <p className="mt-3 text-center font-medium text-grey-70 group-hover:text-party-pink-500 transition-colors">
                {theme.name}
              </p>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopThemes

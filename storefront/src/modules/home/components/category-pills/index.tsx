"use client"

import { useState } from "react"
import { ChevronRight } from "@medusajs/icons"

const categories = [
  { id: "birthday", label: "Birthday Party", emoji: "🎂", bgColor: "bg-pink-100" },
  { id: "baby-shower", label: "Baby Shower", emoji: "🍼", bgColor: "bg-cyan-100" },
  { id: "graduation", label: "Graduation", emoji: "🎓", bgColor: "bg-purple-100" },
  { id: "anniversary", label: "Anniversary", emoji: "💍", bgColor: "bg-orange-100" },
  { id: "prom", label: "Prom Night", emoji: "🎭", bgColor: "bg-teal-100" },
  { id: "wedding", label: "Wedding", emoji: "💒", bgColor: "bg-rose-100" },
  { id: "christmas", label: "Christmas", emoji: "🎄", bgColor: "bg-green-100" },
  { id: "halloween", label: "Halloween", emoji: "🎃", bgColor: "bg-yellow-100" },
]

const CategoryPills = () => {
  const [activeCategory, setActiveCategory] = useState("birthday")

  return (
    <section className="pb-16" style={{ backgroundColor: '#F2EDE9' }}>
      <div className="content-container">
        {/* White rounded container */}
        <div className="bg-white rounded-3xl shadow-lg px-8 py-12 md:px-12 md:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-grey-90 mb-3">
              Let&apos;s Get the Party Started.
            </h2>
            <p className="text-grey-50 text-lg">Pick an occasion to explore matching party supplies.</p>
          </div>

          <div className="relative">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-3 px-5 py-3 rounded-full whitespace-nowrap font-medium transition-all duration-200 flex-shrink-0 bg-grey-5 hover:bg-grey-10"
                >
                  <div className={`w-10 h-10 rounded-full ${category.bgColor} flex items-center justify-center text-xl`}>
                    {category.emoji}
                  </div>
                  <span className="text-sm font-medium text-grey-90">{category.label}</span>
                </button>
              ))}
              
              {/* Next Arrow Button */}
              <button className="flex-shrink-0 w-12 h-12 rounded-full bg-party-dark text-white flex items-center justify-center hover:bg-grey-80 transition-colors ml-2">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategoryPills

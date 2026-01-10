import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@medusajs/ui"

const bestSellers = [
  { id: 1, name: "Princess Crown Set", price: "₹349", emoji: "👑", bg: "bg-party-pink-50" },
  { id: 2, name: "Rainbow Streamers", price: "₹129", emoji: "🌈", bg: "bg-party-sky-50" },
  { id: 3, name: "Party Cups Pack", price: "₹199", emoji: "🥤", bg: "bg-yellow-50" },
  { id: 4, name: "Balloon Garland Kit", price: "₹499", emoji: "🎈", bg: "bg-party-lavender" },
  { id: 5, name: "Cake Candles Set", price: "₹79", emoji: "🕯️", bg: "bg-party-peach" },
  { id: 6, name: "Photo Booth Props", price: "₹249", emoji: "📸", bg: "bg-party-mint" },
  { id: 7, name: "Party Banners", price: "₹179", emoji: "🎊", bg: "bg-party-pink-100" },
  { id: 8, name: "Gift Bags Set", price: "₹159", emoji: "🎁", bg: "bg-party-sky-100" },
]

const BestSellers = () => {
  return (
    <section className="py-12 bg-grey-5">
      <div className="content-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="party-heading-md">Best Sellers</h2>
          <LocalizedClientLink href="/collections/best-sellers" className="text-party-pink-500 font-medium hover:text-party-pink-600 transition-colors">
            View All →
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {bestSellers.map((product) => (
            <LocalizedClientLink
              key={product.id}
              href={`/products/${product.name.toLowerCase().replace(/ /g, "-")}`}
              className="group"
            >
              <div className={`${product.bg} rounded-2xl p-4 aspect-square flex items-center justify-center group-hover:shadow-md transition-shadow`}>
                <span className="text-4xl">{product.emoji}</span>
              </div>
              <div className="mt-3 text-center">
                <Text className="font-medium text-grey-80 text-sm line-clamp-1">{product.name}</Text>
                <Text className="text-party-pink-500 font-bold mt-1">{product.price}</Text>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSellers

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@medusajs/ui"

const saleProducts = [
  { id: 1, name: "Heart Balloons Set", price: "₹299", originalPrice: "₹499", discount: "40%", emoji: "❤️", bg: "bg-party-pink-50" },
  { id: 2, name: "Silver Balloon Arch", price: "₹599", originalPrice: "₹899", discount: "33%", emoji: "🎈", bg: "bg-grey-5" },
  { id: 3, name: "Party Tableware Set", price: "₹199", originalPrice: "₹349", discount: "43%", emoji: "🍽️", bg: "bg-party-sky-50" },
  { id: 4, name: "Flower Decorations", price: "₹449", originalPrice: "₹699", discount: "36%", emoji: "🌸", bg: "bg-party-pink-50" },
  { id: 5, name: "Party Hats Pack", price: "₹149", originalPrice: "₹249", discount: "40%", emoji: "🎩", bg: "bg-yellow-50" },
  { id: 6, name: "Confetti Poppers", price: "₹99", originalPrice: "₹179", discount: "45%", emoji: "🎊", bg: "bg-party-lavender" },
]

const OnSale = () => {
  return (
    <section className="py-12">
      <div className="content-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="party-heading-md">On Sale</h2>
          <LocalizedClientLink href="/collections/sale" className="text-party-pink-500 font-medium hover:text-party-pink-600 transition-colors">
            View All →
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {saleProducts.map((product) => (
            <LocalizedClientLink
              key={product.id}
              href={`/products/${product.name.toLowerCase().replace(/ /g, "-")}`}
              className="group"
            >
              <div className={`${product.bg} rounded-2xl p-4 aspect-square flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-shadow`}>
                <span className="text-5xl">{product.emoji}</span>
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{product.discount}
                </span>
              </div>
              <div className="mt-3">
                <Text className="font-medium text-grey-80 text-sm line-clamp-1">{product.name}</Text>
                <div className="flex items-center gap-2 mt-1">
                  <Text className="text-party-pink-500 font-bold">{product.price}</Text>
                  <Text className="text-grey-40 text-sm line-through">{product.originalPrice}</Text>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OnSale

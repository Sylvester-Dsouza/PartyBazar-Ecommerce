import { Metadata } from "next"

import Hero from "@modules/home/components/01-hero"
import CategoryPills from "@modules/home/components/02-category-pills"
import ShopThemes from "@modules/home/components/03-shop-themes"
import ShopCategories from "@modules/home/components/04-shop-categories"
import ProductGrid from "@modules/home/components/05-featured-products"
import CuratedDeals from "@modules/home/components/06-curated-deals"
import BentoGrid from "@modules/home/components/07-bento-grid"
import CollectionBanner from "@modules/home/components/08-collection-banner"

export const metadata: Metadata = {
  title: "Party Bazaar - Make Your Party Unforgettable",
  description:
    "Discover amazing party supplies, decorations, and everything you need to create magical moments. Shop balloons, banners, tableware and more.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Category Pills - Let's Get the Party Started */}
      <CategoryPills />

      {/* Shop Party Themes */}
      <ShopThemes />

      {/* Shop by Category */}
      <ShopCategories />

      {/* Featured Products Grid */}
      <ProductGrid title="Featured Products" countryCode={countryCode} />

      {/* Curated Deals & New Arrivals Banners */}
      <CuratedDeals />



      {/* Bento Grid Features */}
      <BentoGrid />

      {/* Ambient Blossom Collection Banner */}
      <CollectionBanner />
    </>
  )
}

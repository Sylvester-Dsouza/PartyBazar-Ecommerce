import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import CategoryPills from "@modules/home/components/category-pills"
import ShopThemes from "@modules/home/components/shop-themes"
import ShopCategories from "@modules/home/components/shop-categories"
import ProductGrid from "@modules/home/components/product-grid"
import CuratedDeals from "@modules/home/components/curated-deals"
import OnSale from "@modules/home/components/on-sale"
import CollectionBanner from "@modules/home/components/collection-banner"
import BestSellers from "@modules/home/components/best-sellers"
import KawaiiBanner from "@modules/home/components/kawaii-banner"
import PromoFooter from "@modules/home/components/promo-footer"

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
      
      {/* On Sale Products */}
      <OnSale />
      
      {/* Ambient Blossom Collection Banner */}
      <CollectionBanner />
      
      {/* Best Sellers */}
      <BestSellers />
      
      {/* Kawaii Party Essentials Banner */}
      <KawaiiBanner />
      
      {/* Bottom Promo Section */}
      <PromoFooter />
    </>
  )
}

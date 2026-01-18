import React, { Suspense } from "react"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"
import CoordinatedProducts from "@modules/products/components/coordinated-products"
import CustomerReviews from "@modules/products/components/customer-reviews"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div className="min-h-screen bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-6 sm:py-4 lg:py-6">

          {/* Breadcrumbs - Hidden on mobile */}
          <div className="hidden sm:block mb-6 animate-fade-in">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="hover:text-gray-900 cursor-pointer transition-colors">Home</span>
              <span>/</span>
              <span className="hover:text-gray-900 cursor-pointer transition-colors">Products</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">{product.title}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Left: Gallery */}
            <div className="lg:col-span-6 lg:sticky lg:top-24 h-fit animate-slide-in-left">
              <ImageGallery images={images} />
            </div>

            {/* Right: Product Details */}
            <div className="lg:col-span-6 animate-slide-in-right">
              <div className="lg:sticky lg:top-6 lg:bg-party-cream lg:rounded-[50px] lg:p-8">

                {/* Product Info */}
                <ProductInfo product={product} />

                {/* Product Actions */}
                <div className="mt-6">
                  <Suspense
                    fallback={
                      <ProductActions
                        disabled={true}
                        product={product}
                        region={region}
                      />
                    }
                  >
                    <ProductActionsWrapper id={product.id} region={region} />
                  </Suspense>
                </div>

                {/* Coordinated Products */}
                <CoordinatedProducts product={product} countryCode={countryCode} />

                {/* Customer Reviews */}
                <CustomerReviews />

                {/* Product Description - Moved here after coordinated */}
                {product.description && (
                  <div className="pb-6 mt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">PRODUCT DESCRIPTION</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Product Tabs */}
                <div className="mt-6">
                  <ProductTabs product={product} />
                </div>

                {/* Onboarding CTA */}
                <ProductOnboardingCta />
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div
          className="content-container my-16 small:my-32"
          data-testid="related-products-container"
        >
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default ProductTemplate

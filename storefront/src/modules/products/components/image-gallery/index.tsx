"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"
import { Heart, Sparkles } from "lucide-react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [mainImage, setMainImage] = useState(images[0])
  const [mobileIndex, setMobileIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  if (!images || images.length === 0) {
    return null
  }

  return (
    <>
      {/* Mobile Gallery - Full Screen Hero with Thumbnails */}
      <div className="lg:hidden relative -mt-1">
        {/* Main Hero Image */}
        <div className="relative aspect-square bg-white rounded-2xl overflow-hidden">
          {/* Sale Badge */}
          <div className="absolute top-2 left-2 z-20 bg-party-sky-200 text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            SALE
          </div>

          {/* Like Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`absolute top-2 right-2 z-20 p-2.5 rounded-full shadow-lg transition-all duration-300 ${isLiked ? 'bg-pink-100 text-pink-500 scale-110' : 'bg-white text-gray-400'
              }`}
          >
            <Heart className={`w-5 h-5 transition-all ${isLiked ? 'fill-pink-500' : ''}`} />
          </button>

          {/* Main Image with Animation */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {images[mobileIndex]?.url && (
              <Image
                key={mobileIndex}
                src={images[mobileIndex].url}
                alt={`Product image ${mobileIndex + 1}`}
                fill
                className="object-contain animate-scale-in"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={mobileIndex === 0}
              />
            )}
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-medium">
            {mobileIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setMobileIndex(i)}
              className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-300 ${i === mobileIndex
                  ? 'ring-2 ring-party-sky-200 ring-offset-1 scale-105'
                  : 'opacity-50 hover:opacity-80'
                }`}
            >
              {img.url && (
                <Image
                  src={img.url}
                  alt={`Thumbnail ${i + 1}`}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Gallery - Thumbnails on Left */}
      <div className="hidden lg:flex gap-4">
        {/* Thumbnails - Left Side */}
        <div className="flex flex-col gap-3">
          {images.slice(0, 4).map((img) => (
            <button
              key={img.id}
              onClick={() => setMainImage(img)}
              className={`w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 border-2 ${mainImage.id === img.id
                  ? 'border-party-sky-200 shadow-lg'
                  : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-party-sky-200/50'
                }`}
            >
              {img.url && (
                <Image
                  src={img.url}
                  alt="Product thumbnail"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-1 relative bg-white rounded-3xl aspect-square flex items-center justify-center overflow-hidden border border-gray-100 animate-scale-in">
          {/* Sale Badge */}
          <div className="absolute top-6 left-6 z-20">
            <div className="bg-party-sky-200 text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              SALE
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`absolute top-6 right-6 z-20 p-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isLiked ? 'bg-pink-100 text-pink-500' : 'bg-white text-gray-400 hover:text-pink-400'
              }`}
          >
            <Heart className={`w-6 h-6 transition-all ${isLiked ? 'fill-pink-500' : ''}`} />
          </button>

          {mainImage.url && (
            <Image
              src={mainImage.url}
              alt="Product image"
              fill
              className="relative z-10 object-contain p-8 transition-all duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 50vw, 40vw"
              priority
            />
          )}
        </div>
      </div>
    </>
  )
}

export default ImageGallery

"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useRef, MouseEvent, useEffect } from "react"
import { createPortal } from "react-dom"
import { Heart, Sparkles, X, ZoomIn } from "lucide-react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [mainImage, setMainImage] = useState(images[0])
  const [mobileIndex, setMobileIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenIndex, setFullscreenIndex] = useState(0)
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 })
  const imgRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when fullscreen is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isFullscreen])

  if (!images || images.length === 0) {
    return null
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return

    const { left, top, width, height } = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setMagnifierPosition({ x, y })
  }

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index)
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  const nextImage = () => {
    setFullscreenIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setFullscreenIndex((prev) => (prev - 1 + images.length) % images.length)
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

          {/* Zoom Button */}
          <button
            onClick={() => openFullscreen(mobileIndex)}
            className="absolute bottom-2 right-2 z-20 p-2.5 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all"
          >
            <ZoomIn className="w-5 h-5 text-gray-700" />
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
          {images.slice(0, 4).map((img, index) => (
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

        {/* Main Image with Magnifier */}
        <div
          ref={imgRef}
          className="flex-1 relative bg-white rounded-3xl aspect-square flex items-center justify-center overflow-hidden border border-gray-100 animate-scale-in cursor-zoom-in"
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
          onMouseMove={handleMouseMove}
          onClick={() => openFullscreen(images.findIndex(img => img.id === mainImage.id))}
        >
          {/* Sale Badge */}
          <div className="absolute top-6 left-6 z-20">
            <div className="bg-party-sky-200 text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              SALE
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsLiked(!isLiked)
            }}
            className={`absolute top-6 right-6 z-20 p-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isLiked ? 'bg-pink-100 text-pink-500' : 'bg-white text-gray-400 hover:text-pink-400'
              }`}
          >
            <Heart className={`w-6 h-6 transition-all ${isLiked ? 'fill-pink-500' : ''}`} />
          </button>

          {/* Zoom Icon Hint */}
          <div className="absolute bottom-6 right-6 z-20 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs flex items-center gap-2">
            <ZoomIn className="w-4 h-4" />
            Click to view fullscreen
          </div>

          {mainImage.url && (
            <>
              <Image
                src={mainImage.url}
                alt="Product image"
                fill
                className="relative z-10 object-cover transition-all duration-700"
                sizes="(max-width: 1024px) 50vw, 40vw"
                priority
              />

              {/* Magnifier Overlay */}
              {showMagnifier && (
                <div
                  className="absolute z-30 pointer-events-none border-2 border-gray-400 rounded-full overflow-hidden shadow-2xl"
                  style={{
                    width: '200px',
                    height: '200px',
                    left: `${magnifierPosition.x}%`,
                    top: `${magnifierPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundImage: `url(${mainImage.url})`,
                    backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                    backgroundSize: '300%',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeFullscreen()
            }}
            className="absolute top-4 right-4 z-[10000] p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-[10000] bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {fullscreenIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-4 z-[10000] p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Main Fullscreen Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            {images[fullscreenIndex]?.url && (
              <Image
                src={images[fullscreenIndex].url}
                alt={`Fullscreen image ${fullscreenIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            )}
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-4 z-[10000] p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10000] flex gap-2 bg-black/50 backdrop-blur-sm p-3 rounded-2xl max-w-[90vw] overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setFullscreenIndex(i)
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${i === fullscreenIndex
                  ? 'ring-2 ring-white scale-110'
                  : 'opacity-50 hover:opacity-100'
                  }`}
              >
                {img.url && (
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${i + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default ImageGallery

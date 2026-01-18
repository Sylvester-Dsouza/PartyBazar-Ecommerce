"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

const reviews = [
    {
        name: 'Priya M.',
        initial: 'P',
        rating: 5,
        text: "My daughter's face when she saw this balloon was priceless! 😍 The quality is amazing and it stayed inflated for days. Already ordered more for her friend's party!"
    },
    {
        name: 'Rahul S.',
        initial: 'R',
        rating: 5,
        text: "Perfect for my son's birthday! The colors are vibrant and it arrived well-packaged. Highly recommend! 🎉"
    },
    {
        name: 'Anita K.',
        initial: 'A',
        rating: 4,
        text: "Great quality balloon, my kids loved it! Delivery was quick and the product matched the photos exactly. ⭐"
    },
]

const CustomerReviews = () => {
    const [reviewIndex, setReviewIndex] = useState(0)

    const handlePrevious = () => {
        setReviewIndex(reviewIndex > 0 ? reviewIndex - 1 : reviews.length - 1)
    }

    const handleNext = () => {
        setReviewIndex(reviewIndex < reviews.length - 1 ? reviewIndex + 1 : 0)
    }

    return (
        <div className="mb-6 mt-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">CUSTOMER REVIEWS</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevious}
                        className="w-8 h-8 rounded-full border border-party-sky-200 flex items-center justify-center text-party-sky-300 hover:bg-party-sky-200/20 transition-colors"
                        aria-label="Previous review"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-8 h-8 rounded-full border border-party-sky-200 flex items-center justify-center text-party-sky-300 hover:bg-party-sky-200/20 transition-colors"
                        aria-label="Next review"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="bg-[#F5FBFD] rounded-2xl p-3 sm:p-5 border border-party-sky-200/20 overflow-hidden">
                <div className="flex items-start gap-2.5 sm:gap-3 transition-all duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-party-sky-200 flex items-center justify-center text-gray-900 font-bold text-sm sm:text-lg flex-shrink-0">
                        {reviews[reviewIndex].initial}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                            <span className="text-sm sm:text-base font-semibold text-gray-900">
                                {reviews[reviewIndex].name}
                            </span>
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i <= reviews[reviewIndex].rating
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'fill-gray-200 text-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] sm:text-xs text-party-sky-300 font-medium">
                                Verified Purchase
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                            "{reviews[reviewIndex].text}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-1.5 mt-3">
                {reviews.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setReviewIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === reviewIndex ? 'bg-party-sky-300 w-4' : 'bg-gray-300'
                            }`}
                        aria-label={`Go to review ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default CustomerReviews

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

// Confetti particle component
const Confetti = () => {
    const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string; size: number }>>([])

    useEffect(() => {
        const colors = ['#F472B6', '#0EA5E9', '#FBBF24', '#34D399', '#A78BFA', '#FB7185']
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 10 + 5,
        }))
        setParticles(newParticles)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute animate-fall"
                    style={{
                        left: `${p.left}%`,
                        animationDelay: `${p.delay}s`,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                />
            ))}
            <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall 4s linear infinite;
        }
      `}</style>
        </div>
    )
}

export default function NotFoundParty() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-b from-party-lavender via-white to-party-peach relative overflow-hidden w-full">
            <Confetti />

            {/* Fun 404 Display */}
            <div className="relative z-10 text-center px-4 py-12">
                {/* Big 404 with party elements */}
                <div className="relative mb-8">
                    <h1 className="text-[120px] md:text-[200px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-party-pink-500 via-party-sky-500 to-party-pink-500 leading-none">
                        404
                    </h1>
                    {/* Party hat on the 4 */}
                    <div className="absolute -top-6 md:-top-8 left-[10%] md:left-[15%] text-5xl md:text-8xl transform -rotate-12">
                        🎉
                    </div>
                    {/* Balloon on the 0 */}
                    <div className="absolute -top-4 left-[50%] -translate-x-1/2 text-4xl md:text-7xl animate-bounce">
                        🎈
                    </div>
                    {/* Confetti on the last 4 */}
                    <div className="absolute -top-4 md:-top-6 right-[10%] md:right-[15%] text-4xl md:text-7xl transform rotate-12">
                        🎊
                    </div>
                </div>

                {/* Fun message */}
                <h2 className="text-xl md:text-3xl font-bold text-party-dark mb-4">
                    Oops! The party moved! 🥳
                </h2>
                <p className="text-grey-60 text-base md:text-lg mb-8 max-w-md mx-auto">
                    Looks like this page took a confetti cannon blast and disappeared.
                    But don&apos;t worry, the real party is just a click away!
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-party-dark text-white font-semibold rounded-full hover:bg-grey-80 transition-colors shadow-lg hover:shadow-xl text-sm md:text-base"
                    >
                        <span>🏠</span>
                        Back to Home
                    </Link>
                    <Link
                        href="/store"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white border-2 border-party-dark text-party-dark font-semibold rounded-full hover:bg-grey-5 transition-colors shadow-lg hover:shadow-xl text-sm md:text-base"
                    >
                        <span>🛍️</span>
                        Shop Party Supplies
                    </Link>
                </div>

                {/* Fun footer message */}
                <p className="mt-12 text-grey-50 text-xs md:text-sm">
                    Error Code: Party_Not_Found_404 🎭
                </p>
            </div>

            {/* Floating decorations */}
            <div className="absolute bottom-10 left-10 text-4xl md:text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>
                🎂
            </div>
            <div className="absolute bottom-20 right-10 text-3xl md:text-5xl animate-bounce" style={{ animationDelay: '1s' }}>
                🎁
            </div>
            <div className="absolute top-20 left-10 md:left-20 text-3xl md:text-4xl animate-pulse">
                ✨
            </div>
            <div className="absolute top-32 right-10 md:right-20 text-3xl md:text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>
                ⭐
            </div>
        </div>
    )
}

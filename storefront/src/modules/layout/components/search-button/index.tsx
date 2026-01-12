"use client"

import { useState } from "react"
import SearchModal from "@modules/layout/components/search-modal"

export default function SearchButton({ countryCode }: { countryCode: string }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsSearchOpen(true)}
        className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-grey-5 transition-colors"
        aria-label="Search products"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        countryCode={countryCode}
      />
    </>
  )
}

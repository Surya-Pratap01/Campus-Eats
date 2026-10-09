'use client'

import { useState, useMemo } from 'react'
import OutletCard, { Outlet, RatingDimension } from './OutletCard'
import { normalizeCategory } from '@/lib/categories'
import { Search, X } from 'lucide-react'

interface HomeFeedProps {
  initialOutlets: Outlet[]
}

function calculateAverageRating(ratings: RatingDimension[]) {
  if (!ratings || ratings.length === 0) return null

  const total = ratings.reduce((sum, rating) => {
    const avg = (rating.taste + rating.hygiene + rating.quantity + rating.value_for_money) / 4
    return sum + avg
  }, 0)

  return (total / ratings.length).toFixed(1)
}

function calculateOutletAverage(outlet: Outlet): string | null {
  const allRatings = (outlet.menu_items || []).flatMap((item) => item.ratings || [])
  return calculateAverageRating(allRatings)
}

export default function HomeFeed({ initialOutlets }: HomeFeedProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Extract all unique categories across outlets using canonical normalization
  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const outlet of initialOutlets) {
      for (const item of outlet.menu_items || []) {
        if (item.category && item.category.trim()) {
          set.add(normalizeCategory(item.category))
        }
      }
    }
    return ['All', ...Array.from(set).sort()]
  }, [initialOutlets])

  // Filter outlets based on search query and selected category
  const filteredOutlets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return initialOutlets.filter((outlet) => {
      // Canonical category filtering
      if (selectedCategory !== 'All') {
        const hasCategoryItem = (outlet.menu_items || []).some(
          (item) => normalizeCategory(item.category) === selectedCategory
        )
        if (!hasCategoryItem) return false
      }

      // Search query filtering
      if (!query) return true

      const outletNameMatches = outlet.name.toLowerCase().includes(query)
      const outletDescMatches = outlet.description?.toLowerCase().includes(query)
      const outletLocMatches = outlet.location?.toLowerCase().includes(query)
      const menuItemMatches = (outlet.menu_items || []).some(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          normalizeCategory(item.category).toLowerCase().includes(query)
      )

      return outletNameMatches || outletDescMatches || outletLocMatches || menuItemMatches
    })
  }, [initialOutlets, searchQuery, selectedCategory])

  const totalMenuItems = useMemo(() => {
    return initialOutlets.reduce((acc, o) => acc + (o.menu_items?.length || 0), 0)
  }, [initialOutlets])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
  }

  return (
    <div className="space-y-6">
      {/* Mobile-First Search & Discovery Bar */}
      <div id="explore" className="bg-white rounded-2xl shadow-xs border border-[#D5EAE7] p-4 sm:p-5 scroll-mt-24">
        <div className="flex flex-col gap-3">
          {/* Search Input Box */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#728783]">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, tuck shops, snacks, rolls, coffee..."
              className="w-full pl-11 pr-10 py-3.5 bg-[#F8FDFA] border border-[#D5EAE7] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition text-base text-[#1F2937] placeholder:text-[#728783]/60 focus:text-[#1F2937]"
              aria-label="Search campus food and outlets"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#728783] hover:text-[#1F2937] min-h-[44px] min-w-[44px] justify-center"
                aria-label="Clear search query"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills (Finger-friendly horizontal scroll with safe padding) */}
          {categories.length > 1 && (
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#728783] uppercase tracking-wider mb-2">
                <span>Browse by Category</span>
                <span className="text-[#728783]/70 font-normal">Swipe to see all ({categories.length - 1})</span>
              </div>
              <div
                className="flex items-center gap-2 overflow-x-auto py-1.5 -mx-2 px-2 scrollbar-none snap-x"
                tabIndex={0}
                aria-label="Filter food outlets by category"
              >
                {categories.map((category) => {
                  const isSelected = selectedCategory === category
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all active:scale-95 flex items-center justify-center shrink-0 shadow-2xs snap-start ${
                        isSelected
                          ? 'bg-[#0D9488] text-white shadow-[#0D9488]/20'
                          : 'bg-[#E6F7F5] text-[#1F2937] hover:bg-[#D5EAE7]'
                      }`}
                    >
                      {category}
                    </button>
                  )
                })}
                {/* Spacer element at end to ensure the last category pill is never clipped */}
                <div className="w-4 shrink-0" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Discovery Stats Bar */}
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-[#D5EAE7] text-xs text-[#728783]">
          <span>
            Showing <strong className="text-[#1F2937] font-bold">{filteredOutlets.length}</strong> of{' '}
            {initialOutlets.length} campus outlets
          </span>
          {totalMenuItems > 0 && (
            <span>
              <strong className="text-[#1F2937] font-bold">{totalMenuItems}</strong> verified menu items
            </span>
          )}
        </div>
      </div>

      {/* Outlets Grid Feed */}
      {filteredOutlets.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-xs border border-[#D5EAE7]">
          <Search className="w-12 h-12 text-[#0D9488]/40 mx-auto mb-3" />
          <h3 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-1">
            No food or outlets found
          </h3>
          <p className="text-[#728783] text-sm max-w-md mx-auto mb-6">
            We couldn&apos;t find any outlets or food matching &ldquo;{searchQuery || selectedCategory}&rdquo;. Try another search term or reset filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-[44px] px-6 py-2.5 bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-sm rounded-xl transition shadow-xs active:scale-95"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredOutlets.map((outlet) => {
            const avgRating = calculateOutletAverage(outlet)
            return (
              <OutletCard
                key={outlet.id}
                outlet={outlet}
                avgRating={avgRating}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

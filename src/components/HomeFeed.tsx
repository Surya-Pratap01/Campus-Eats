'use client'

import { useState, useMemo } from 'react'
import OutletCard, { Outlet, RatingDimension } from './OutletCard'

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

  // Extract all unique categories across outlets
  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const outlet of initialOutlets) {
      for (const item of outlet.menu_items || []) {
        if (item.category && item.category.trim()) {
          set.add(item.category.trim())
        }
      }
    }
    return ['All', ...Array.from(set).sort()]
  }, [initialOutlets])

  // Filter outlets based on search query and selected category
  const filteredOutlets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return initialOutlets.filter((outlet) => {
      // Category filtering
      if (selectedCategory !== 'All') {
        const hasCategoryItem = (outlet.menu_items || []).some(
          (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
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
          item.category?.toLowerCase().includes(query)
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
      <div id="explore" className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 sm:p-5 scroll-mt-20">
        <div className="flex flex-col gap-3">
          {/* Search Input Box */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-lg">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search outlets, snacks, meals, drinks..."
              className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-base text-gray-900 placeholder:text-gray-400"
              aria-label="Search campus food and outlets"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 text-lg"
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills (Finger-friendly horizontal scroll) */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 -mx-1 px-1 scrollbar-hide">
              {categories.map((category) => {
                const isSelected = selectedCategory === category
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 flex items-center justify-center shrink-0 shadow-2xs ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-orange-600/20'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Discovery Stats Bar */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <span>
            Showing <strong className="text-gray-800">{filteredOutlets.length}</strong> of{' '}
            {initialOutlets.length} outlets
          </span>
          {totalMenuItems > 0 && (
            <span>
              <strong className="text-gray-800">{totalMenuItems}</strong> verified menu items
            </span>
          )}
        </div>
      </div>

      {/* Outlets Grid Feed */}
      {filteredOutlets.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-xs border border-gray-200/80">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            No food or outlets found
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            We couldn&apos;t find any outlets or food matching &ldquo;{searchQuery || selectedCategory}&rdquo;. Try another search term or reset filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-[44px] px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-xl transition shadow-xs active:scale-95"
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

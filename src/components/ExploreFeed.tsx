'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import OutletCard, { Outlet, RatingDimension, MenuItemWithRatings } from './OutletCard'
import RatingModal, { MenuItemForRating } from './RatingModal'
import { normalizeCategory, getCategoryEmoji } from '@/lib/categories'

interface ExploreFeedProps {
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

function ExploreFeedContent({ initialOutlets }: ExploreFeedProps) {
  const searchParams = useSearchParams()
  const initialQ = searchParams?.get('q') || ''
  const initialCategory = searchParams?.get('category') || 'All'
  const initialOutlet = searchParams?.get('outlet') || 'All'

  const [searchQuery, setSearchQuery] = useState(initialQ)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedOutlet, setSelectedOutlet] = useState(initialOutlet)
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'rating_desc'>('default')
  const [viewMode, setViewMode] = useState<'dishes' | 'outlets'>('dishes')
  const [ratingModalItem, setRatingModalItem] = useState<MenuItemForRating | null>(null)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)

  // Flatten all menu items with their parent outlet information
  const allDishes = useMemo(() => {
    const list: (MenuItemWithRatings & { outletName: string; outletLocation?: string | null })[] = []
    for (const outlet of initialOutlets) {
      for (const item of outlet.menu_items || []) {
        list.push({
          ...item,
          outletName: outlet.name,
          outletLocation: outlet.location,
        })
      }
    }
    return list
  }, [initialOutlets])

  // Extract canonical categories
  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const dish of allDishes) {
      if (dish.category) {
        set.add(normalizeCategory(dish.category))
      }
    }
    return ['All', ...Array.from(set).sort()]
  }, [allDishes])

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return allDishes
      .filter((dish) => {
        // Outlet filter
        if (selectedOutlet !== 'All' && dish.outlet_id !== selectedOutlet) {
          return false
        }

        // Category filter
        if (selectedCategory !== 'All' && normalizeCategory(dish.category) !== selectedCategory) {
          return false
        }

        // Search query
        if (!q) return true

        const nameMatch = dish.name.toLowerCase().includes(q)
        const catMatch = normalizeCategory(dish.category).toLowerCase().includes(q)
        const outletMatch = dish.outletName.toLowerCase().includes(q)
        return nameMatch || catMatch || outletMatch
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') {
          return (a.price || 0) - (b.price || 0)
        }
        if (sortBy === 'price_desc') {
          return (b.price || 0) - (a.price || 0)
        }
        if (sortBy === 'rating_desc') {
          const aRate = Number(calculateAverageRating(a.ratings || [])) || 0
          const bRate = Number(calculateAverageRating(b.ratings || [])) || 0
          return bRate - aRate
        }
        return a.name.localeCompare(b.name)
      })
  }, [allDishes, searchQuery, selectedCategory, selectedOutlet, sortBy])

  // Filtered outlets
  const filteredOutlets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return initialOutlets.filter((outlet) => {
      if (selectedOutlet !== 'All' && outlet.id !== selectedOutlet) {
        return false
      }

      if (selectedCategory !== 'All') {
        const hasCategory = (outlet.menu_items || []).some(
          (item) => normalizeCategory(item.category) === selectedCategory
        )
        if (!hasCategory) return false
      }

      if (!q) return true

      const nameMatch = outlet.name.toLowerCase().includes(q)
      const descMatch = outlet.description?.toLowerCase().includes(q)
      const locMatch = outlet.location?.toLowerCase().includes(q)
      const hasItemMatch = (outlet.menu_items || []).some(
        (i) => i.name.toLowerCase().includes(q) || normalizeCategory(i.category).toLowerCase().includes(q)
      )
      return nameMatch || descMatch || locMatch || hasItemMatch
    })
  }, [initialOutlets, searchQuery, selectedCategory, selectedOutlet])

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedOutlet('All')
    setSortBy('default')
  }

  const handleOpenRate = (item: MenuItemWithRatings) => {
    setRatingModalItem(item)
    setIsRatingModalOpen(true)
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search and Filter Control Center */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Main Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-lg">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all dishes, outlets, snacks, drinks..."
              className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-base text-gray-900 placeholder:text-gray-400 focus:text-gray-900"
              aria-label="Search dishes and outlets across campus"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 text-lg min-h-[44px] min-w-[44px] justify-center"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters Row (Outlet Dropdown + Sort Dropdown + View Mode) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Filter by Outlet */}
            <div>
              <label htmlFor="outlet-select" className="block text-xs font-semibold text-gray-600 mb-1">
                Filter by Outlet
              </label>
              <select
                id="outlet-select"
                value={selectedOutlet}
                onChange={(e) => setSelectedOutlet(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition min-h-[44px]"
              >
                <option value="All">All Outlets ({initialOutlets.length})</option>
                {initialOutlets.map((outlet) => (
                  <option key={outlet.id} value={outlet.id}>
                    {outlet.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label htmlFor="sort-select" className="block text-xs font-semibold text-gray-600 mb-1">
                Sort Results
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition min-h-[44px]"
              >
                <option value="default">Default (A to Z)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div>
              <span className="block text-xs font-semibold text-gray-600 mb-1">
                View Mode
              </span>
              <div className="flex rounded-xl bg-gray-100 p-1 border border-gray-200 min-h-[44px]">
                <button
                  type="button"
                  onClick={() => setViewMode('dishes')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    viewMode === 'dishes'
                      ? 'bg-white text-orange-600 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🍽️</span>
                  <span>Dishes ({filteredDishes.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('outlets')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    viewMode === 'outlets'
                      ? 'bg-white text-orange-600 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🏪</span>
                  <span>Outlets ({filteredOutlets.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Canonical Category Slider with safe breathing room and no clipping */}
          {categories.length > 1 && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <span>Filter by Category</span>
                {(selectedCategory !== 'All' || selectedOutlet !== 'All' || searchQuery) && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-orange-600 hover:underline font-semibold lowercase"
                  >
                    Reset all
                  </button>
                )}
              </div>
              <div
                className="flex items-center gap-2 overflow-x-auto py-2 -mx-2 px-2 scrollbar-none snap-x"
                tabIndex={0}
                aria-label="Filter dishes by category"
              >
                {categories.map((category) => {
                  const isSelected = selectedCategory === category
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all active:scale-95 flex items-center justify-center shrink-0 shadow-2xs snap-start ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-orange-600/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-1.5">{getCategoryEmoji(category)}</span>
                      <span>{category}</span>
                    </button>
                  )
                })}
                <div className="w-4 shrink-0" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>

        {/* Status Line */}
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-gray-100 text-xs text-gray-500">
          <span>
            Found <strong className="text-gray-900">{filteredDishes.length}</strong> matching dishes across{' '}
            <strong className="text-gray-900">{filteredOutlets.length}</strong> outlets
          </span>
          {(searchQuery || selectedCategory !== 'All' || selectedOutlet !== 'All') && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Results Container */}
      {viewMode === 'dishes' ? (
        filteredDishes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-xs border border-gray-200/80">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
              No matching dishes found
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              We couldn&apos;t find any dishes matching your filters. Try selecting another outlet or resetting the filters.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="min-h-[44px] px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-xl transition shadow-xs active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDishes.map((dish) => {
              const dishRating = calculateAverageRating(dish.ratings || [])
              return (
                <div
                  key={dish.id}
                  className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
                        {dish.name}
                      </h3>
                      {dish.price ? (
                        <span className="font-extrabold text-orange-600 text-base shrink-0">
                          ₹{dish.price}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                        {getCategoryEmoji(dish.category || 'Other')} {normalizeCategory(dish.category)}
                      </span>
                      <Link
                        href={`/outlets/${dish.outlet_id}`}
                        className="text-xs text-orange-600 hover:underline font-medium"
                      >
                        📍 {dish.outletName}
                      </Link>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div>
                      {dishRating ? (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-yellow-500 font-bold">★ {dishRating}</span>
                          <span className="text-gray-400">({dish.ratings?.length || 0})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Unrated</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/items/${dish.id}`}
                        className="min-h-[44px] px-3 flex items-center justify-center text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                      >
                        Details
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleOpenRate(dish)}
                        className="min-h-[44px] px-3.5 bg-orange-50 hover:bg-orange-100 active:bg-orange-200 text-orange-600 text-xs font-bold rounded-lg transition active:scale-95"
                      >
                        Rate
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      ) : filteredOutlets.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-xs border border-gray-200/80">
          <div className="text-5xl mb-3">🏪</div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            No matching outlets found
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            We couldn&apos;t find any outlets matching your criteria. Try another search or reset filters.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="min-h-[44px] px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-xl transition shadow-xs active:scale-95"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredOutlets.map((outlet) => {
            const avgRating = calculateOutletAverage(outlet)
            return <OutletCard key={outlet.id} outlet={outlet} avgRating={avgRating} />
          })}
        </div>
      )}

      {/* Floating Rating Modal */}
      {isRatingModalOpen && ratingModalItem && (
        <RatingModal
          isOpen={isRatingModalOpen}
          item={ratingModalItem}
          onClose={() => setIsRatingModalOpen(false)}
        />
      )}
    </div>
  )
}

export default function ExploreFeed(props: ExploreFeedProps) {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-500">Loading discovery feed...</div>}>
      <ExploreFeedContent {...props} />
    </Suspense>
  )
}

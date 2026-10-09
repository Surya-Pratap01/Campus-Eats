'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import OutletCard, { Outlet, RatingDimension, MenuItemWithRatings } from './OutletCard'
import RatingModal, { MenuItemForRating } from './RatingModal'
import { normalizeCategory, CategoryIcon } from '@/lib/categories'
import { Search, X, Utensils, Store, MapPin, Star, ArrowDown } from 'lucide-react'

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
  const [visibleCount, setVisibleCount] = useState(24)

  // Flatten all menu items with their parent outlet information and pre-computed rating stats
  const allDishes = useMemo(() => {
    const list: (MenuItemWithRatings & {
      outletName: string
      outletLocation?: string | null
      avgRating: string | null
      avgRatingNum: number
      ratingCount: number
    })[] = []

    for (const outlet of initialOutlets) {
      for (const item of outlet.menu_items || []) {
        const avg = calculateAverageRating(item.ratings || [])
        list.push({
          ...item,
          outletName: outlet.name,
          outletLocation: outlet.location,
          avgRating: avg,
          avgRatingNum: avg ? Number(avg) : 0,
          ratingCount: item.ratings?.length || 0,
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
          return b.avgRatingNum - a.avgRatingNum
        }
        return a.name.localeCompare(b.name)
      })
  }, [allDishes, searchQuery, selectedCategory, selectedOutlet, sortBy])

  // Progressive rendering slice for high performance
  const visibleDishes = useMemo(() => {
    return filteredDishes.slice(0, visibleCount)
  }, [filteredDishes, visibleCount])

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
    setVisibleCount(24)
  }

  const handleOpenRate = (item: MenuItemWithRatings) => {
    setRatingModalItem(item)
    setIsRatingModalOpen(true)
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search and Filter Control Center */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#eae7e7] p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Main Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setVisibleCount(24)
              }}
              placeholder="Search across all dishes, outlets, snacks, drinks..."
              className="w-full pl-11 pr-10 py-3.5 bg-[#F8FDFA] border border-[#D5EAE7] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition text-base text-[#1F2937] placeholder:text-[#728783]/60 focus:text-[#1F2937]"
              aria-label="Search dishes and outlets across campus"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setVisibleCount(24)
                }}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#728783] hover:text-[#1F2937] min-h-[44px] min-w-[44px] justify-center"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Filters Row (Outlet Dropdown + Sort Dropdown + View Mode) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Filter by Outlet */}
            <div>
              <label htmlFor="outlet-select" className="block text-xs font-bold text-[#728783] mb-1">
                Filter by Outlet
              </label>
              <select
                id="outlet-select"
                value={selectedOutlet}
                onChange={(e) => {
                  setSelectedOutlet(e.target.value)
                  setVisibleCount(24)
                }}
                className="w-full px-3 py-2.5 bg-[#F8FDFA] border border-[#D5EAE7] rounded-xl text-sm font-medium text-[#1F2937] focus:ring-2 focus:ring-[#0D9488] focus:bg-white outline-none transition min-h-[44px]"
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
              <label htmlFor="sort-select" className="block text-xs font-bold text-[#728783] mb-1">
                Sort Results
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as typeof sortBy)
                  setVisibleCount(24)
                }}
                className="w-full px-3 py-2.5 bg-[#F8FDFA] border border-[#D5EAE7] rounded-xl text-sm font-medium text-[#1F2937] focus:ring-2 focus:ring-[#0D9488] focus:bg-white outline-none transition min-h-[44px]"
              >
                <option value="default">Default (A to Z)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div>
              <span className="block text-xs font-bold text-[#728783] mb-1">
                View Mode
              </span>
              <div className="flex rounded-xl bg-[#E6F7F5] p-1 border border-[#D5EAE7] min-h-[44px]">
                <button
                  type="button"
                  onClick={() => setViewMode('dishes')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    viewMode === 'dishes'
                      ? 'bg-white text-[#0D9488] shadow-xs'
                      : 'text-[#728783] hover:text-[#1F2937]'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Dishes ({filteredDishes.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('outlets')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    viewMode === 'outlets'
                      ? 'bg-white text-[#0D9488] shadow-xs'
                      : 'text-[#728783] hover:text-[#1F2937]'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Outlets ({filteredOutlets.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Canonical Category Slider with safe breathing room and no clipping */}
          {categories.length > 1 && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#728783] uppercase tracking-wider mb-2">
                <span>Filter by Category</span>
                {(selectedCategory !== 'All' || selectedOutlet !== 'All' || searchQuery) && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-[#0D9488] hover:underline font-bold lowercase"
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
                      onClick={() => {
                        setSelectedCategory(category)
                        setVisibleCount(24)
                      }}
                      className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-95 flex items-center justify-center shrink-0 shadow-2xs snap-start ${
                        isSelected
                          ? 'bg-[#0D9488] text-white shadow-[#0D9488]/20'
                          : 'bg-[#E6F7F5] text-[#1F2937] hover:bg-[#D5EAE7]'
                      }`}
                    >
                      {category !== 'All' && (
                        <CategoryIcon category={category} className="w-3.5 h-3.5 mr-1.5 text-current" />
                      )}
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
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-[#D5EAE7] text-xs text-[#728783]">
          <span>
            Found <strong className="text-[#1F2937] font-bold">{filteredDishes.length}</strong> matching dishes across{' '}
            <strong className="text-[#1F2937] font-bold">{filteredOutlets.length}</strong> outlets
          </span>
          {(searchQuery || selectedCategory !== 'All' || selectedOutlet !== 'All') && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[#0D9488] hover:text-[#0F766E] font-bold"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Results Container */}
      {viewMode === 'dishes' ? (
        filteredDishes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-xs border border-[#D5EAE7]">
            <Search className="w-12 h-12 text-[#0D9488]/40 mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-1">
              No matching dishes found
            </h3>
            <p className="text-[#728783] text-sm max-w-md mx-auto mb-6">
              We couldn&apos;t find any dishes matching your filters. Try selecting another outlet or resetting the filters.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="min-h-[44px] px-6 py-2.5 bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-sm rounded-xl transition shadow-xs active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleDishes.map((dish) => {
                return (
                  <div
                    key={dish.id}
                    className="bg-white rounded-2xl shadow-xs border border-[#D5EAE7] p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-base font-bold text-[#1F2937] leading-snug line-clamp-2">
                          {dish.name}
                        </h3>
                        {dish.price ? (
                          <span className="font-extrabold text-[#0D9488] text-base shrink-0">
                            ₹{dish.price}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-[#E6F7F5] text-[#0D9488] border border-[#D5EAE7]">
                          <CategoryIcon category={dish.category} className="w-3 h-3 text-[#0D9488]" />
                          <span>{normalizeCategory(dish.category)}</span>
                        </span>
                        <Link
                          href={`/outlets/${dish.outlet_id}`}
                          className="text-xs text-[#0D9488] hover:underline font-medium inline-flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{dish.outletName}</span>
                        </Link>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#D5EAE7] flex items-center justify-between gap-2">
                      <div>
                        {dish.avgRating ? (
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                            <span className="text-amber-500 font-bold">{dish.avgRating}</span>
                            <span className="text-gray-400">({dish.ratingCount})</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Unrated</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/items/${dish.id}`}
                          className="min-h-[44px] px-3 flex items-center justify-center text-xs font-semibold text-[#728783] hover:text-[#1F2937] bg-[#F8FDFA] hover:bg-[#E6F7F5] rounded-xl transition border border-[#D5EAE7]"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenRate(dish)}
                          className="min-h-[44px] px-3.5 bg-[#E6F7F5] hover:bg-[#0D9488] text-[#0D9488] hover:text-white text-xs font-bold rounded-xl transition active:scale-95 border border-[#D5EAE7] hover:border-[#0D9488]"
                        >
                          Rate
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredDishes.length > visibleCount && (
              <div className="flex flex-col items-center justify-center pt-6 pb-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 24, filteredDishes.length))}
                  className="min-h-[44px] px-6 py-2.5 bg-white hover:bg-[#E6F7F5] border border-[#D5EAE7] text-[#0D9488] font-bold text-sm rounded-xl transition shadow-xs active:scale-95 flex items-center gap-2"
                >
                  <span>Load More Dishes ({filteredDishes.length - visibleCount} remaining)</span>
                  <ArrowDown className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-400">
                  Showing {visibleDishes.length} of {filteredDishes.length} dishes
                </p>
              </div>
            )}
          </div>
        )
      ) : filteredOutlets.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-xs border border-[#D5EAE7]">
          <Store className="w-12 h-12 text-[#0D9488]/40 mx-auto mb-3" />
          <h3 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-1">
            No matching outlets found
          </h3>
          <p className="text-[#728783] text-sm max-w-md mx-auto mb-6">
            We couldn&apos;t find any outlets matching your criteria. Try another search or reset filters.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="min-h-[44px] px-6 py-2.5 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold text-sm rounded-xl transition shadow-xs active:scale-95"
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

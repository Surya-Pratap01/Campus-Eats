'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import RatingModal, { MenuItemForRating } from './RatingModal'

export interface Outlet {
  id: string
  name: string
  description?: string | null
  location?: string | null
  photo_url?: string | null
  menu_items?: MenuItemWithRatings[]
}

export interface RatingDimension {
  taste: number
  hygiene: number
  quantity: number
  value_for_money: number
}

export interface MenuItemWithRatings {
  id: string
  outlet_id: string
  name: string
  category?: string
  price?: number
  ratings?: RatingDimension[]
}

interface OutletCardProps {
  outlet: Outlet
  avgRating: string | null
  onRatingUpdated?: () => void
}

export default function OutletCard({
  outlet,
  avgRating: outletAvgRating,
  onRatingUpdated,
}: OutletCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItemWithRatings[]>(outlet.menu_items || [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ratingModalItem, setRatingModalItem] = useState<MenuItemForRating | null>(null)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const supabase = createClient()

  const categories = useMemo(() => {
    if (menuItems.length > 0) {
      return [
        'All',
        ...Array.from(new Set(menuItems.map((item) => item.category || 'Other'))),
      ]
    }
    return ['All']
  }, [menuItems])

  const filteredMenuItems = useMemo(() => {
    let filtered = menuItems

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    return filtered
  }, [searchQuery, selectedCategory, menuItems])

  const fetchMenuItems = async () => {
    setLoading(true)
    setError('')

    try {
      const { data: items, error: fetchError } = await supabase
        .from('menu_items')
        .select(`
          *,
          ratings (
            taste,
            hygiene,
            quantity,
            value_for_money
          )
        `)
        .eq('outlet_id', outlet.id)
        .order('name')

      if (fetchError) {
        setError('Failed to load menu items')
      } else {
        setMenuItems(items || [])
      }
    } catch {
      setError('Failed to load menu items')
    } finally {
      setLoading(false)
    }
  }

  const toggleMenu = async () => {
    if (isMenuOpen) {
      setIsMenuOpen(false)
      return
    }

    setIsMenuOpen(true)
    if (menuItems.length === 0) {
      await fetchMenuItems()
    }
  }

  const handleOpenRateModal = (item: MenuItemWithRatings) => {
    setRatingModalItem(item)
    setIsRatingModalOpen(true)
  }

  const handleRatingSubmitted = async () => {
    await fetchMenuItems()
    onRatingUpdated?.()
  }

  const getCategoryEmoji = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Beverages': '🥤',
      'Snacks': '🍿',
      'Meals': '🍛',
      'Desserts': '🍰',
      'Fast Food': '🍔',
      'Burger': '🍔',
      'Sandwich': '🥪',
      'Chinese': '🥡',
      'South Indian': '🥘',
      'North Indian': '🍲',
    }
    return categoryMap[category] || '🍽️'
  }

  const calculateAverageRating = (ratings: RatingDimension[]) => {
    if (!ratings || ratings.length === 0) return null

    const total = ratings.reduce((sum, rating) => {
      const avg = (rating.taste + rating.hygiene + rating.quantity + rating.value_for_money) / 4
      return sum + avg
    }, 0)

    return (total / ratings.length).toFixed(1)
  }

  const currentOutletAvgRating = useMemo(() => {
    if (menuItems.length > 0) {
      const allRatings = menuItems.flatMap((item) => item.ratings || [])
      const computed = calculateAverageRating(allRatings)
      if (computed !== null) return computed
    }
    return outletAvgRating
  }, [menuItems, outletAvgRating])

  const totalRatingCount = useMemo(() => {
    if (menuItems.length > 0) {
      return menuItems.reduce((acc, item) => acc + (item.ratings?.length || 0), 0)
    }
    return (outlet.menu_items || []).reduce((acc, item) => acc + (item.ratings?.length || 0), 0)
  }, [menuItems, outlet.menu_items])

  // Group menu items by category
  const groupedItems = filteredMenuItems.reduce(
    (acc: Record<string, typeof filteredMenuItems>, item) => {
      const category = item.category || 'Other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    },
    {}
  )

  const itemsCount = menuItems.length > 0 ? menuItems.length : (outlet.menu_items?.length || 0)

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          {outlet.photo_url ? (
            <div className="h-44 sm:h-48 overflow-hidden relative">
              <img
                src={outlet.photo_url}
                alt={`${outlet.name} storefront at Bennett University`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className="bg-black/70 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {itemsCount > 0 ? `${itemsCount} items` : 'Menu coming soon'}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-44 sm:h-48 bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center relative">
              <span className="text-6xl" role="img" aria-label="Campus outlet dining icon">🍽️</span>
              <div className="absolute top-3 right-3">
                <span className="bg-black/40 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {itemsCount > 0 ? `${itemsCount} items` : 'Menu coming soon'}
                </span>
              </div>
            </div>
          )}

          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-xl font-bold text-gray-900 leading-snug">{outlet.name}</h2>
              <div
                className="flex items-center space-x-1 shrink-0 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-200/60"
                aria-label={`Overall rating: ${currentOutletAvgRating || 'Unrated'}`}
              >
                {currentOutletAvgRating ? (
                  <>
                    <span className="text-yellow-600 text-sm" aria-hidden="true">⭐</span>
                    <span className="font-bold text-gray-900 text-sm">{currentOutletAvgRating}</span>
                    {totalRatingCount > 0 && (
                      <span className="text-xs text-gray-500 font-medium">({totalRatingCount})</span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-500 text-xs font-medium">Unrated</span>
                )}
              </div>
            </div>

            {outlet.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                {outlet.description}
              </p>
            )}

            {outlet.location && (
              <p className="text-gray-500 text-xs sm:text-sm mb-4 flex items-center">
                <span className="mr-1">📍</span>
                <span>{outlet.location}</span>
              </p>
            )}

            {/* View Menu Primary Action Button (≥44px Touch Target) */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500">
                {itemsCount > 0 ? `${itemsCount} dishes available` : 'Menu coming soon'}
              </span>

              <button
                type="button"
                onClick={toggleMenu}
                className="min-h-[44px] px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 active:bg-orange-200 font-bold text-sm rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
                aria-expanded={isMenuOpen}
              >
                <span>{isMenuOpen ? 'Hide Menu' : loading ? 'Loading...' : 'View Menu'}</span>
                <span>{isMenuOpen ? '↑' : '→'}</span>
              </button>
            </div>

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            {/* Collapsible Menu Section */}
            {isMenuOpen && !loading && (
              <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in duration-200">
                <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-3 flex items-center justify-between">
                  <span>Menu</span>
                  <span className="text-xs font-normal text-gray-500 lowercase">
                    {filteredMenuItems.length} item{filteredMenuItems.length !== 1 ? 's' : ''}
                  </span>
                </h3>

                {itemsCount === 0 ? (
                  <div className="py-6 px-4 text-center bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-2xl block mb-1">📋</span>
                    <p className="text-gray-700 font-semibold text-sm">Menu information coming soon</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Official menu items will appear once updated.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* In-Card Search and Category Filters */}
                    <div className="mb-4 space-y-2.5">
                      <input
                        type="text"
                        placeholder="Search food in menu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-base text-gray-900 placeholder:text-gray-400 focus:text-gray-900"
                      />

                      {categories.length > 1 && (
                        <div className="flex flex-wrap gap-1.5">
                          {categories.map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => setSelectedCategory(category)}
                              className={`min-h-[38px] px-3 py-1 rounded-full text-xs font-medium transition active:scale-95 ${
                                selectedCategory === category
                                  ? 'bg-orange-600 text-white font-semibold'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {filteredMenuItems.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-6 bg-gray-50 rounded-xl">
                        No matching menu items
                      </p>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                        {Object.entries(groupedItems).map(([category, items]) => (
                          <div key={category}>
                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center">
                              <span className="mr-1.5">{getCategoryEmoji(category)}</span>
                              {category} ({items.length})
                            </h4>
                            <div className="space-y-2">
                              {items.map((item) => {
                                const itemAvgRating = calculateAverageRating(item.ratings || [])
                                return (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50/50 border border-gray-100 transition"
                                  >
                                    <div className="min-w-0 pr-2">
                                      <p className="text-sm font-semibold text-gray-900 truncate">
                                        {item.name}
                                      </p>
                                      <div className="flex items-center gap-2.5 mt-1 text-xs text-gray-500">
                                        {item.price && (
                                          <span className="font-bold text-orange-600 text-sm">
                                            ₹{item.price}
                                          </span>
                                        )}
                                        {itemAvgRating ? (
                                          <span className="text-yellow-600 font-semibold flex items-center gap-0.5">
                                            <span>★</span> {itemAvgRating}{' '}
                                            <span className="text-gray-400 font-normal">
                                              ({item.ratings?.length || 0})
                                            </span>
                                          </span>
                                        ) : (
                                          <span className="text-gray-400">No ratings yet</span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Mobile-Friendly Rate Button (≥44px Touch Target) */}
                                    <button
                                      type="button"
                                      onClick={() => handleOpenRateModal(item)}
                                      className="flex-shrink-0 min-h-[44px] min-w-[64px] bg-white hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-600 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs active:scale-95 flex items-center justify-center"
                                    >
                                      Rate
                                    </button>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* In-Place Rating Modal (Zero Scroll Jump) */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false)
          setRatingModalItem(null)
        }}
        item={ratingModalItem}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </>
  )
}

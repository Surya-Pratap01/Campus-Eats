'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import RatingModal, { MenuItemForRating } from './RatingModal'
import { CategoryIcon } from '@/lib/categories'
import { getOutletImageStyle } from '@/lib/outlet-image-config'
import { MapPin, Utensils, Star, ClipboardList, ChevronDown, ChevronUp } from 'lucide-react'

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

  // Compute 4-dimensional rating averages from real data
  const dimensionAvgs = useMemo(() => {
    const items = menuItems.length > 0 ? menuItems : (outlet.menu_items || [])
    const allRatings = items.flatMap((item) => item.ratings || [])
    if (allRatings.length === 0) return null

    const sumTaste = allRatings.reduce((s, r) => s + r.taste, 0)
    const sumQty = allRatings.reduce((s, r) => s + r.quantity, 0)
    const sumVfm = allRatings.reduce((s, r) => s + r.value_for_money, 0)
    const sumHyg = allRatings.reduce((s, r) => s + r.hygiene, 0)
    const n = allRatings.length

    return {
      taste: (sumTaste / n).toFixed(1),
      quantity: (sumQty / n).toFixed(1),
      value_for_money: (sumVfm / n).toFixed(1),
      hygiene: (sumHyg / n).toFixed(1),
    }
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
      <div className="bg-white rounded-2xl shadow-xs border border-[#D5EAE7] overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          {outlet.photo_url ? (
            <div className="h-44 sm:h-48 overflow-hidden relative bg-[#F8FDFA]">
              <img
                src={outlet.photo_url}
                alt={`${outlet.name} storefront at Bennett University`}
                className="w-full h-full object-cover"
                style={getOutletImageStyle(outlet, 'card')}
              />
              {outlet.location && (
                <div className="absolute top-3 left-3 bg-[#1F2937]/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <MapPin className="w-3 h-3 text-[#14B8A6] shrink-0" />
                  <span className="truncate max-w-[180px]">{outlet.location}</span>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className="bg-[#1F2937]/70 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  {itemsCount > 0 ? `${itemsCount} items` : 'Menu coming soon'}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-44 sm:h-48 bg-gradient-to-br from-[#E6F7F5] to-[#F8FDFA] flex items-center justify-center relative">
              <Utensils className="w-16 h-16 text-[#0D9488]/30" aria-label="Campus outlet dining icon" />
              {outlet.location && (
                <div className="absolute top-3 left-3 bg-[#1F2937]/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <MapPin className="w-3 h-3 text-[#14B8A6] shrink-0" />
                  <span className="truncate max-w-[180px]">{outlet.location}</span>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className="bg-[#1F2937]/60 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {itemsCount > 0 ? `${itemsCount} items` : 'Menu coming soon'}
                </span>
              </div>
            </div>
          )}

          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-xl font-black text-[#1F2937] leading-snug">{outlet.name}</h2>
              <div
                className="flex items-center space-x-1 shrink-0 bg-[#E6F7F5] px-2 py-0.5 rounded-lg border border-[#D5EAE7]"
                aria-label={`Overall rating: ${currentOutletAvgRating || 'Unrated'}`}
              >
                {currentOutletAvgRating ? (
                  <>
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" aria-hidden="true" />
                    <span className="font-extrabold text-[#1F2937] text-sm">{currentOutletAvgRating}</span>
                    {totalRatingCount > 0 && (
                      <span className="text-xs text-[#728783] font-medium">({totalRatingCount})</span>
                    )}
                  </>
                ) : (
                  <span className="text-[#728783] text-xs font-medium">Unrated</span>
                )}
              </div>
            </div>

            {outlet.description && (
              <p className="text-[#728783] text-sm mb-3 line-clamp-2 leading-relaxed">
                {outlet.description}
              </p>
            )}

            {/* 4-Dimensional Metric Breakdown Row from real ratings */}
            {dimensionAvgs && (
              <div className="my-3 py-2 px-3 bg-[#F8FDFA] rounded-xl grid grid-cols-4 gap-1 text-center text-xs border border-[#D5EAE7]">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#728783] font-bold uppercase tracking-wider">Taste</span>
                  <span className="font-black text-[#0D9488]">{dimensionAvgs.taste}</span>
                </div>
                <div className="flex flex-col border-l border-[#D5EAE7]">
                  <span className="text-[10px] text-[#728783] font-bold uppercase tracking-wider">Qty</span>
                  <span className="font-bold text-[#1F2937]">{dimensionAvgs.quantity}</span>
                </div>
                <div className="flex flex-col border-l border-[#D5EAE7]">
                  <span className="text-[10px] text-[#728783] font-bold uppercase tracking-wider">VFM</span>
                  <span className="font-bold text-[#1F2937]">{dimensionAvgs.value_for_money}</span>
                </div>
                <div className="flex flex-col border-l border-[#D5EAE7]">
                  <span className="text-[10px] text-[#728783] font-bold uppercase tracking-wider">Hygiene</span>
                  <span className="font-black text-[#0D9488]">{dimensionAvgs.hygiene}</span>
                </div>
              </div>
            )}

            {/* View Menu Primary Action Button (≥44px Touch Target) */}
            <div className="pt-3 border-t border-[#D5EAE7] flex items-center justify-between gap-3">
              <span className="text-xs text-[#728783] font-medium">
                {itemsCount > 0 ? `${itemsCount} dishes catalogued` : 'Menu coming soon'}
              </span>

              <button
                type="button"
                onClick={toggleMenu}
                className="min-h-[44px] px-4 py-2 bg-[#0D9488] hover:bg-[#0F766E] text-white active:bg-[#0F766E] font-bold text-sm rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-2xs"
                aria-expanded={isMenuOpen}
              >
                <span>{isMenuOpen ? 'Hide Menu' : loading ? 'Loading...' : 'View Menu'}</span>
                {isMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {error && <p className="text-red-600 text-xs mt-2">{error}</p>}

            {/* Collapsible Menu Section */}
            {isMenuOpen && !loading && (
              <div className="mt-4 pt-4 border-t border-[#D5EAE7] animate-in fade-in duration-200">
                <h3 className="text-xs font-bold text-[#728783] tracking-wider uppercase mb-3 flex items-center justify-between">
                  <span>Menu</span>
                  <span className="text-xs font-normal text-gray-400 lowercase">
                    {filteredMenuItems.length} item{filteredMenuItems.length !== 1 ? 's' : ''}
                  </span>
                </h3>

                {itemsCount === 0 ? (
                  <div className="py-6 px-4 text-center bg-[#F8FDFA] rounded-xl border border-[#D5EAE7]">
                    <ClipboardList className="w-8 h-8 text-[#0D9488]/40 mx-auto mb-1" />
                    <p className="text-[#1F2937] font-bold text-sm">Menu information coming soon</p>
                    <p className="text-[#728783] text-xs mt-1">
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
                        className="w-full px-3.5 py-2.5 bg-[#F8FDFA] border border-[#D5EAE7] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition text-sm text-[#1F2937] placeholder:text-gray-400"
                      />

                      {categories.length > 1 && (
                        <div className="flex flex-wrap gap-1.5">
                          {categories.map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => setSelectedCategory(category)}
                              className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-medium transition active:scale-95 ${
                                selectedCategory === category
                                  ? 'bg-[#0D9488] text-white font-bold'
                                  : 'bg-[#E6F7F5] text-[#1F2937] hover:bg-[#D5EAE7]'
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {filteredMenuItems.length === 0 ? (
                      <p className="text-[#728783] text-xs text-center py-6 bg-[#F8FDFA] rounded-xl">
                        No matching menu items
                      </p>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                        {Object.entries(groupedItems).map(([category, items]) => (
                          <div key={category}>
                            <h4 className="text-xs font-bold text-[#728783] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                              <CategoryIcon category={category} className="w-3.5 h-3.5 text-[#0D9488]" />
                              <span>{category} ({items.length})</span>
                            </h4>
                            <div className="space-y-2">
                              {items.map((item) => {
                                const itemAvgRating = calculateAverageRating(item.ratings || [])
                                return (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-[#F8FDFA] hover:bg-[#E6F7F5]/50 border border-[#D5EAE7] transition"
                                  >
                                    <div className="min-w-0 pr-2">
                                      <p className="text-sm font-bold text-[#1F2937] truncate">
                                        {item.name}
                                      </p>
                                      <div className="flex items-center gap-2.5 mt-1 text-xs text-[#728783]">
                                        {item.price && (
                                          <span className="font-extrabold text-[#0D9488] text-sm">
                                            ₹{item.price}
                                          </span>
                                        )}
                                        {itemAvgRating ? (
                                          <span className="text-amber-500 font-bold flex items-center gap-0.5">
                                            <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" /> {itemAvgRating}{' '}
                                            <span className="text-gray-400 font-normal text-[11px]">
                                              ({item.ratings?.length || 0})
                                            </span>
                                          </span>
                                        ) : (
                                          <span className="text-gray-400 text-[11px]">Unrated</span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Mobile-Friendly Rate Button (≥44px Touch Target) */}
                                    <button
                                      type="button"
                                      onClick={() => handleOpenRateModal(item)}
                                      className="flex-shrink-0 min-h-[44px] min-w-[64px] bg-[#E6F7F5] hover:bg-[#0D9488] text-[#0D9488] hover:text-white border border-[#D5EAE7] hover:border-[#0D9488] px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs active:scale-95 flex items-center justify-center"
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

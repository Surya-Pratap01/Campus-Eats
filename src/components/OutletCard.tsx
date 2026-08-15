'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import RatingForm from './RatingForm'

interface OutletCardProps {
  outlet: any
  avgRating: string | null
}

export default function OutletCard({ outlet, avgRating: outletAvgRating }: OutletCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [filteredMenuItems, setFilteredMenuItems] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>(['All'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [itemRatings, setItemRatings] = useState<any[]>([])
  const [ratingFilter, setRatingFilter] = useState('All')
  const supabase = createClient()

  useEffect(() => {
    if (menuItems.length > 0) {
      const uniqueCategories = ['All', ...Array.from(new Set(menuItems.map(item => item.category || 'Other')))]
      setCategories(uniqueCategories)
    }
  }, [menuItems])

  useEffect(() => {
    let filtered = menuItems

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    setFilteredMenuItems(filtered)
  }, [searchQuery, selectedCategory, menuItems])

  const toggleMenu = async () => {
    if (isMenuOpen) {
      setIsMenuOpen(false)
      setSelectedItem(null)
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data: items, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('outlet_id', outlet.id)
        .order('name')

      if (fetchError) {
        setError('Failed to load menu items')
      } else {
        setMenuItems(items || [])
        setFilteredMenuItems(items || [])
        setIsMenuOpen(true)
      }
    } catch (err) {
      setError('Failed to load menu items')
    } finally {
      setLoading(false)
    }
  }

  const selectItem = async (item: any) => {
    setSelectedItem(item)
    
    // Fetch all ratings for this item
    try {
      const { data: ratings } = await supabase
        .from('ratings')
        .select(`
          *,
          profiles (email, full_name)
        `)
        .eq('menu_item_id', item.id)
        .order('created_at', { ascending: false })

      setItemRatings(ratings || [])

      // Fetch existing rating for current user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userRating } = await supabase
          .from('ratings')
          .select('*')
          .eq('menu_item_id', item.id)
          .eq('student_id', user.id)
          .single()
        setSelectedItem({ ...item, existingRating: userRating })
      }
      
      // Smooth scroll to review section after a short delay
      setTimeout(() => {
        const reviewSection = document.getElementById(`review-section-${item.id}`)
        if (reviewSection) {
          reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (err) {
      // No ratings or error fetching
      setItemRatings([])
    }
  }

  const handleRatingSubmitted = () => {
    // Refresh ratings after submission
    if (selectedItem) {
      selectItem(selectedItem)
    }
  }

  const closeItemDetails = () => {
    setSelectedItem(null)
    setItemRatings([])
  }

  const getCategoryEmoji = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Beverages': '🥤',
      'Snacks': '🍿',
      'Meals': '🍛',
      'Desserts': '🍰',
      'Fast Food': '🍔',
      'Chinese': '🥡',
      'South Indian': '🥘',
      'North Indian': '🍲',
    }
    return categoryMap[category] || '🍽️'
  }

  const calculateAverageRating = (ratings: any[]) => {
    if (!ratings || ratings.length === 0) return null

    const total = ratings.reduce((sum, rating) => {
      const avg = (rating.taste + rating.hygiene + rating.quantity + rating.value_for_money) / 4
      return sum + avg
    }, 0)

    return (total / ratings.length).toFixed(1)
  }

  const calculateDimensionAverage = (ratings: any[], dimension: string) => {
    if (!ratings || ratings.length === 0) return null

    const total = ratings.reduce((sum, rating) => sum + rating[dimension], 0)
    return (total / ratings.length).toFixed(1)
  }

  const filteredRatings = ratingFilter === 'All' 
    ? itemRatings 
    : itemRatings.filter(rating => {
        const avg = (rating.taste + rating.hygiene + rating.quantity + rating.value_for_money) / 4
        return Math.round(avg) === parseInt(ratingFilter)
      })

  // Group menu items by category
  const groupedItems = filteredMenuItems.reduce((acc: Record<string, typeof filteredMenuItems>, item) => {
    const category = item.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {})

  const avgRating = calculateAverageRating(itemRatings)

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {outlet.photo_url ? (
        <div className="h-48 overflow-hidden">
          <img
            src={outlet.photo_url}
            alt={outlet.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
          <span className="text-6xl">🍽️</span>
        </div>
      )}
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {outlet.name}
        </h2>
        
        {outlet.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {outlet.description}
          </p>
        )}
        
        {outlet.location && (
          <p className="text-gray-500 text-sm mb-3">
            📍 {outlet.location}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-1">
            {outletAvgRating ? (
              <>
                <span className="text-yellow-500 text-lg">⭐</span>
                <span className="font-semibold text-gray-900">{outletAvgRating}</span>
              </>
            ) : (
              <span className="text-gray-400 text-sm">No ratings yet</span>
            )}
          </div>
          
          <button
            onClick={toggleMenu}
            className="text-orange-600 font-medium text-sm hover:text-orange-700 transition"
          >
            {isMenuOpen ? 'Hide Menu ↑' : loading ? 'Loading...' : 'View Menu →'}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}

        {isMenuOpen && !loading && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">MENU</h3>
            
            {/* Search and Filters */}
            <div className="mb-4 space-y-3">
              <input
                type="text"
                placeholder="🔍 Search food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              />
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      selectedCategory === category
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {filteredMenuItems.length === 0 ? (
              <p className="text-gray-500 text-sm">No menu items found</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="mr-2">{getCategoryEmoji(category)}</span>
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {items.map((item) => {
                        const itemAvgRating = calculateAverageRating(
                          itemRatings.filter(r => r.menu_item_id === item.id)
                        )
                        return (
                          <button
                            key={item.id}
                            onClick={() => selectItem(item)}
                            className="w-full text-left text-gray-700 hover:text-orange-600 transition block"
                          >
                            <div className="flex justify-between items-center text-sm">
                              <span>• {item.name}</span>
                              <div className="flex items-center gap-2">
                                {itemAvgRating && (
                                  <span className="text-yellow-500">⭐ {itemAvgRating}</span>
                                )}
                                {item.price && (
                                  <span className="font-medium">₹{item.price}</span>
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedItem && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {/* Sticky Item Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 py-3 mb-4 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedItem.name}</h3>
                  <p className="text-sm text-gray-600">{selectedItem.category}</p>
                </div>
                <div className="text-right">
                  {selectedItem.price && (
                    <p className="text-orange-600 font-bold text-lg">₹{selectedItem.price}</p>
                  )}
                  <button
                    onClick={closeItemDetails}
                    className="text-gray-500 hover:text-gray-700 text-sm mt-1"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
            </div>

            {/* Rating Summary */}
            <div className="bg-orange-50 rounded-lg p-4 mb-4">
              {avgRating && (
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-yellow-500 text-xl">⭐</span>
                  <span className="text-xl font-bold text-gray-900">{avgRating}</span>
                  <span className="text-gray-500">({itemRatings.length} review{itemRatings.length !== 1 ? 's' : ''})</span>
                </div>
              )}

              {itemRatings.length > 0 && (
                <div className="pt-3 border-t border-orange-200">
                  <h5 className="font-semibold text-gray-900 mb-2">Rating Breakdown</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Taste:</span>
                      <span className="ml-1 font-medium">{calculateDimensionAverage(itemRatings, 'taste') || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Hygiene:</span>
                      <span className="ml-1 font-medium">{calculateDimensionAverage(itemRatings, 'hygiene') || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Quantity:</span>
                      <span className="ml-1 font-medium">{calculateDimensionAverage(itemRatings, 'quantity') || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Value:</span>
                      <span className="ml-1 font-medium">{calculateDimensionAverage(itemRatings, 'value_for_money') || '-'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div id={`review-section-${selectedItem.id}`} className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-gray-900">Reviews ({filteredRatings.length})</h4>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="All">All</option>
                  <option value="5">5★</option>
                  <option value="4">4★</option>
                  <option value="3">3★</option>
                  <option value="2">2★</option>
                  <option value="1">1★</option>
                </select>
              </div>
              
              {filteredRatings.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to rate this item!</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {filteredRatings.map((rating) => (
                    <div key={rating.id} className="border-b border-gray-200 pb-3 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <a 
                            href={`mailto:${rating.profiles?.email}`}
                            className="font-semibold text-gray-900 hover:text-orange-600"
                          >
                            {rating.profiles?.email || 'Anonymous'}
                          </a>
                          <p className="text-xs text-gray-500">
                            {new Date(rating.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">
                            {((rating.taste + rating.hygiene + rating.quantity + rating.value_for_money) / 4).toFixed(1)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                        <div>
                          <span className="text-gray-500">Taste:</span>
                          <span className="ml-1">{rating.taste}/5</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Hygiene:</span>
                          <span className="ml-1">{rating.hygiene}/5</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <span className="ml-1">{rating.quantity}/5</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Value:</span>
                          <span className="ml-1">{rating.value_for_money}/5</span>
                        </div>
                      </div>
                      
                      {rating.comment && (
                        <p className="text-gray-700 text-sm">{rating.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rating Form */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3">
                {selectedItem.existingRating ? 'Edit My Review' : 'Rate this item'}
              </h4>
              <RatingForm 
                menuItemId={selectedItem.id} 
                existingRating={selectedItem.existingRating}
                onRatingSubmitted={handleRatingSubmitted}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

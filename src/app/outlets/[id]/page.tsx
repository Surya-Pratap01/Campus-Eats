import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { notFound } from 'next/navigation'

async function getOutlet(id: string) {
  const supabase = await createClient()
  const { data: outlet, error } = await supabase
    .from('outlets')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !outlet) {
    return null
  }

  return outlet
}

async function getMenuItems(outletId: string) {
  const supabase = await createClient()
  const { data: menuItems } = await supabase
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
    .eq('outlet_id', outletId)
    .order('name')

  return menuItems || []
}

interface RatingDimension {
  taste: number
  hygiene: number
  quantity: number
  value_for_money: number
}

interface MenuItemWithRatings {
  id: string
  name: string
  category?: string
  price?: number
  photo_url?: string | null
  ratings?: RatingDimension[]
}

function calculateAverageRating(ratings: RatingDimension[]) {
  if (!ratings || ratings.length === 0) return null

  const total = ratings.reduce((sum, rating) => {
    const avg = (rating.taste + rating.hygiene + rating.quantity + rating.value_for_money) / 4
    return sum + avg
  }, 0)

  return (total / ratings.length).toFixed(1)
}

function getCategoryEmoji(category?: string) {
  if (!category) return '🍽️'
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

export default async function OutletPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const { id } = await Promise.resolve(params)
  const outlet = await getOutlet(id)
  
  if (!outlet) {
    notFound()
  }

  const menuItems = await getMenuItems(id)

  // Group by category
  const groupedItems = menuItems.reduce((acc: Record<string, typeof menuItems>, item) => {
    const category = item.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <Link
          href="/"
          className="inline-flex items-center min-h-[44px] px-3.5 py-2 rounded-xl bg-white shadow-2xs border border-gray-200 text-orange-600 hover:text-orange-700 font-semibold text-sm mb-4 sm:mb-6 transition active:scale-95"
        >
          ← Back to All Outlets
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden mb-6 sm:mb-8">
          {outlet.photo_url ? (
            <div className="h-48 sm:h-64 overflow-hidden relative">
              <img
                src={outlet.photo_url}
                alt={outlet.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-48 sm:h-64 bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
              <span className="text-7xl sm:text-8xl">🍽️</span>
            </div>
          )}
          
          <div className="p-5 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
              {outlet.name}
            </h1>
            
            {outlet.description && (
              <p className="text-gray-600 text-sm sm:text-base mb-3 leading-relaxed">
                {outlet.description}
              </p>
            )}
            
            {outlet.location && (
              <p className="text-gray-500 text-xs sm:text-sm flex items-center">
                <span className="mr-1">📍</span>
                <span>{outlet.location}</span>
              </p>
            )}
          </div>
        </div>

        {menuItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl shadow-xs border border-gray-200 p-6">
            <div className="text-5xl mb-3">📋</div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Menu information coming soon</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              We are working on bringing the verified, official menu for this outlet.
            </p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <span className="mr-2">{getCategoryEmoji(category)}</span>
                  <span>{category}</span>
                  <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    {items.length}
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
                  {items.map((item: MenuItemWithRatings) => {
                    const avgRating = calculateAverageRating(item.ratings || [])
                    
                    return (
                      <Link
                        key={item.id}
                        href={`/items/${item.id}`}
                        className="group block active:scale-98 transition-transform"
                      >
                        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                          <div>
                            {item.photo_url ? (
                              <div className="h-36 sm:h-40 overflow-hidden">
                                <img
                                  src={item.photo_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            ) : (
                              <div className="h-28 sm:h-36 bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-200 flex items-center justify-center">
                                <span className="text-3xl sm:text-4xl">{getCategoryEmoji(item.category)}</span>
                              </div>
                            )}
                            
                            <div className="p-4">
                              <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-orange-600 transition">
                                {item.name}
                              </h3>
                              
                              {item.price && (
                                <p className="text-orange-600 font-bold text-base mb-2">₹{item.price}</p>
                              )}
                            </div>
                          </div>

                          <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              {avgRating ? (
                                <>
                                  <span className="text-yellow-500 text-sm">⭐</span>
                                  <span className="font-bold text-gray-900 text-sm">{avgRating}</span>
                                  <span className="text-gray-400 text-xs">({item.ratings?.length || 0})</span>
                                </>
                              ) : (
                                <span className="text-gray-400 text-xs">No ratings yet</span>
                              )}
                            </div>
                            
                            <span className="min-h-[44px] px-3 flex items-center text-orange-600 font-bold text-xs group-hover:text-orange-700 transition">
                              Details & Rate →
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

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

function calculateAverageRating(ratings: any[]) {
  if (!ratings || ratings.length === 0) return null

  const total = ratings.reduce((sum, rating) => {
    const avg = (rating.taste + rating.hygiene + rating.quantity + rating.value_for_money) / 4
    return sum + avg
  }, 0)

  return (total / ratings.length).toFixed(1)
}

function getCategoryEmoji(category: string) {
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

export default async function OutletPage({ params }: { params: { id: string } }) {
  const outlet = await getOutlet(params.id)
  
  if (!outlet) {
    notFound()
  }

  const menuItems = await getMenuItems(params.id)

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-6 transition"
        >
          ← Back to Outlets
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {outlet.photo_url ? (
            <div className="h-64 overflow-hidden">
              <img
                src={outlet.photo_url}
                alt={outlet.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
              <span className="text-8xl">🍽️</span>
            </div>
          )}
          
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{outlet.name}</h1>
            
            {outlet.description && (
              <p className="text-gray-600 text-lg mb-4">{outlet.description}</p>
            )}
            
            {outlet.location && (
              <p className="text-gray-500">📍 {outlet.location}</p>
            )}
          </div>
        </div>

        {menuItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No menu items yet</h2>
            <p className="text-gray-500">Check back soon or ask an admin to add menu items!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">{getCategoryEmoji(category)}</span>
                  {category}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item: any) => {
                    const avgRating = calculateAverageRating(item.ratings || [])
                    
                    return (
                      <Link
                        key={item.id}
                        href={`/items/${item.id}`}
                        className="group"
                      >
                        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                          {item.photo_url ? (
                            <div className="h-40 overflow-hidden">
                              <img
                                src={item.photo_url}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="h-40 bg-gradient-to-br from-orange-300 to-yellow-300 flex items-center justify-center">
                              <span className="text-4xl">{getCategoryEmoji(item.category)}</span>
                            </div>
                          )}
                          
                          <div className="p-4">
                            <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                            
                            {item.price && (
                              <p className="text-orange-600 font-semibold mb-2">₹{item.price}</p>
                            )}
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-1">
                                {avgRating ? (
                                  <>
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="font-semibold text-gray-900">{avgRating}</span>
                                    <span className="text-gray-400 text-sm">({item.ratings?.length || 0})</span>
                                  </>
                                ) : (
                                  <span className="text-gray-400 text-sm">No ratings</span>
                                )}
                              </div>
                              
                              <span className="text-orange-600 font-medium text-sm group-hover:text-orange-700 transition">
                                View →
                              </span>
                            </div>
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

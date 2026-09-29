import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import HomeFeed from '@/components/HomeFeed'

async function getOutlets() {
  const supabase = await createClient()
  const { data: outlets } = await supabase
    .from('outlets')
    .select(`
      *,
      menu_items (
        id,
        outlet_id,
        name,
        category,
        price,
        ratings (
          taste,
          hygiene,
          quantity,
          value_for_money
        )
      )
    `)
    .order('name')

  return outlets || []
}

export default async function Home() {
  const outlets = await getOutlets()
  const totalVerifiedDishes = outlets.reduce((sum, o) => sum + (o.menu_items?.length || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Campus Dashboard Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full mb-3 shadow-2xs">
            <span>🎓</span>
            <span>Bennett University Dining Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            🍽️ Campus Food Directory & Ratings
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl mx-auto leading-relaxed">
            Browse verified menus across all Bennett University dining spots, search your favorite food, and read honest peer reviews.
          </p>

          {/* Quick Real-Data Campus Pulse */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 text-xs font-semibold text-gray-700">
            <span className="px-3 py-1.5 bg-white border border-gray-200/80 rounded-xl shadow-2xs flex items-center gap-1.5">
              <span>🏪</span>
              <span><strong>{outlets.length}</strong> Campus Outlets</span>
            </span>
            <span className="px-3 py-1.5 bg-white border border-gray-200/80 rounded-xl shadow-2xs flex items-center gap-1.5">
              <span>🍲</span>
              <span><strong>{totalVerifiedDishes}</strong> Verified Dishes</span>
            </span>
            <span className="px-3 py-1.5 bg-white border border-gray-200/80 rounded-xl shadow-2xs flex items-center gap-1.5">
              <span>⭐</span>
              <span>Taste • Hygiene • Quantity • Value</span>
            </span>
          </div>
        </div>

        {outlets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl p-6 shadow-xs border border-gray-200">
            <div className="text-5xl mb-3">🏗️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">No outlets available</h2>
            <p className="text-gray-500 text-sm">Check back soon or ask an admin to configure outlets!</p>
          </div>
        ) : (
          <HomeFeed initialOutlets={outlets} />
        )}
      </main>
    </div>
  )
}


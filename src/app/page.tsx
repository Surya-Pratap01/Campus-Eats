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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Mobile-First Header */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full mb-2">
            Bennett University Campus Dining
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            🍽️ Campus Food Outlets
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-xl mx-auto">
            Discover menus, search your favorite campus food, and submit verified student ratings.
          </p>
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


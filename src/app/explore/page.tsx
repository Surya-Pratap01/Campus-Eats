import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import ExploreFeed from '@/components/ExploreFeed'

export const metadata = {
  title: 'Explore Food & Outlets | Campus Eats',
  description: 'Search all dishes, filter by campus outlet, sort by price or verified rating.',
}

async function getExploreData() {
  const supabase = await createClient()
  const { data: outlets } = await supabase
    .from('outlets')
    .select(`
      id,
      name,
      location,
      description,
      photo_url,
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

export default async function ExplorePage() {
  const outlets = await getExploreData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Explore Header */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full mb-2">
            Campus Food Explorer
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            🔍 Discover & Compare Campus Bites
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-xl mx-auto">
            Search 340+ dishes across Bennett University outlets, compare prices, and view genuine ratings.
          </p>
        </div>

        <ExploreFeed initialOutlets={outlets} />
      </main>
    </div>
  )
}

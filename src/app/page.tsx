import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import OutletCard from '@/components/OutletCard'

async function getOutlets() {
  const supabase = await createClient()
  const { data: outlets } = await supabase
    .from('outlets')
    .select(`
      *,
      menu_items (
        id,
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

function calculateAverageRating(menuItems: any[]) {
  const allRatings = menuItems.flatMap(item => item.ratings || [])
  if (allRatings.length === 0) return null

  const total = allRatings.reduce((sum, rating) => {
    const avg = (rating.taste + rating.hygiene + rating.quantity + rating.value_for_money) / 4
    return sum + avg
  }, 0)

  return (total / allRatings.length).toFixed(1)
}

export default async function Home() {
  const outlets = await getOutlets()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🍽️ Campus Food Outlets
          </h1>
          <p className="text-lg text-gray-600">
            Discover and rate the best food on campus
          </p>
        </div>

        {outlets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏗️</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No outlets yet</h2>
            <p className="text-gray-500">Check back soon or ask an admin to add outlets!</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {outlets.map((outlet) => {
              const avgRating = calculateAverageRating(outlet.menu_items || [])
              
              return (
                <div key={outlet.id} className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <OutletCard
                    outlet={outlet}
                    avgRating={avgRating}
                  />
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

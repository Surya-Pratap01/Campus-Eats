import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import Navbar from '@/components/Navbar'
import ExploreFeed from '@/components/ExploreFeed'

export const metadata = {
  title: 'Explore Food & Outlets | Campus Eats',
  description: 'Search all dishes, filter by campus outlet, sort by price or verified rating.',
}

const getExploreData = unstable_cache(
  async () => {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: outlets, error } = await supabase
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

    if (error) {
      console.error('Error fetching explore data:', error)
      return []
    }

    return outlets || []
  },
  ['explore-feed-outlets'],
  { revalidate: 30, tags: ['outlets', 'menu_items', 'ratings'] }
)

export default async function ExplorePage() {
  const outlets = await getExploreData()

  return (
    <div className="min-h-screen bg-[#F0FBFA]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Explore Header */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-block px-3 py-1 bg-[#E6F7F5] text-[#0D9488] border border-[#D5EAE7] text-xs font-bold rounded-full mb-2">
            Campus Food Explorer
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1F2937] tracking-tight">
            Discover & Compare Campus Bites
          </h1>
          <p className="text-sm sm:text-base text-[#728783] mt-1 max-w-xl mx-auto">
            Search verified dishes across Bennett University outlets, compare prices, and view genuine student ratings.
          </p>
        </div>

        <ExploreFeed initialOutlets={outlets} />
      </main>
    </div>
  )
}

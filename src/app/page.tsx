import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import HomeFeed from '@/components/HomeFeed'
import { Outlet, MenuItemWithRatings, RatingDimension } from '@/components/OutletCard'
import { CategoryIcon } from '@/lib/categories'
import { Check, Star, Utensils, IndianRupee, Sparkles, ArrowRight, Store } from 'lucide-react'

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

function getItemAverageRating(ratings?: RatingDimension[]) {
  if (!ratings || ratings.length === 0) return null
  const total = ratings.reduce((sum: number, r: RatingDimension) => sum + (r.taste + r.hygiene + r.quantity + r.value_for_money) / 4, 0)
  return (total / ratings.length).toFixed(1)
}

export default async function Home() {
  const rawOutlets = await getOutlets()
  const outlets = (rawOutlets || []) as unknown as Outlet[]

  const totalVerifiedDishes = outlets.reduce((sum: number, o: Outlet) => sum + (o.menu_items?.length || 0), 0)
  const totalRatingsCount = outlets.reduce(
    (sum: number, o: Outlet) =>
      sum + (o.menu_items?.reduce((isum: number, item: MenuItemWithRatings) => isum + (item.ratings?.length || 0), 0) || 0),
    0
  )

  // Extract genuine budget items (under ₹99) from actual menu items
  const budgetItems = outlets
    .flatMap((o: Outlet) =>
      (o.menu_items || []).map((item: MenuItemWithRatings) => ({
        id: item.id,
        name: item.name,
        price: item.price as number,
        category: item.category,
        outletName: o.name,
        outletLocation: o.location,
        avgRating: getItemAverageRating(item.ratings),
        ratingsCount: item.ratings?.length || 0,
      }))
    )
    .filter((item) => typeof item.price === 'number' && item.price <= 99)
    .sort((a, b) => {
      if (b.ratingsCount !== a.ratingsCount) return b.ratingsCount - a.ratingsCount
      return a.price - b.price
    })
    .slice(0, 4)


  return (
    <div className="min-h-screen bg-[#F0FBFA]">
      <Navbar />

      {/* Campus Operational Sub-bar (Refinement 3: Removed lightning emoji) */}
      <div className="w-full bg-[#E6F7F5] border-b border-[#D5EAE7] py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs text-[#728783] font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#0D9488]"></span>
            <span className="font-semibold text-[#1F2937]">
              {outlets.length} Campus Outlets Catalogued
            </span>
            <span className="hidden md:inline text-[#D5EAE7]">•</span>
            <span className="hidden md:inline">
              Bennett University Dining & Tuck Shops
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="bg-white border border-[#D5EAE7] text-[#0D9488] font-bold px-2.5 py-0.5 rounded-full">
              Taste • Hygiene • Quantity • Value
            </span>
            <span className="text-[#D5EAE7]">•</span>
            <span className="text-[#728783]">Peer verified</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* Stitch-Inspired Hero Section */}
        <section aria-labelledby="hero-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8 flex flex-col gap-2">
            <span className="text-xs font-bold tracking-wider uppercase text-[#0D9488]">
              Bennett University Campus Canteen Network
            </span>
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1F2937] tracking-tight leading-tight"
            >
              Real campus ratings. Zero guesswork between lectures.
            </h1>
            <p className="text-sm sm:text-base text-[#728783] max-w-2xl mt-1 leading-relaxed">
              Every roll, thali, snack, and tea evaluated across 4 campus dimensions: Taste, Portion Size, Pocket Value, and Preparation Hygiene.
            </p>
          </div>

          <div className="lg:col-span-4 flex items-center lg:justify-end gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#D5EAE7] shadow-xs flex items-center gap-3 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-xl bg-[#E6F7F5] text-[#0D9488] border border-[#D5EAE7] flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-[#0D9488]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-extrabold text-[#1F2937]">
                  {totalRatingsCount > 0 ? `${totalRatingsCount}+ Student Audits` : `${totalVerifiedDishes} Verified Dishes`}
                </span>
                <span className="text-xs text-[#728783]">
                  Validated with @bennett.edu.in
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* The Bennett Standard: 4-Dimensional Metric Explainer */}
        <section
          aria-labelledby="metrics-heading"
          className="bg-white p-4 sm:p-6 rounded-2xl border border-[#D5EAE7] shadow-xs"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#0D9488] font-bold">
                The Bennett Standard
              </span>
              <h2 id="metrics-heading" className="text-lg sm:text-xl font-bold text-[#1F2937]">
                The 4-Dimensional Rating Metric
              </h2>
            </div>
            <p className="text-xs text-[#728783] max-w-md">
              We separate taste from wallet-friendliness and portion size so students know what they get before stepping out.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-[#F8FDFA] p-3.5 sm:p-4 rounded-xl border border-[#D5EAE7] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#728783] uppercase tracking-wider">
                  Taste Factor
                </span>
                <span className="w-7 h-7 rounded-full bg-[#E6F7F5] text-[#0D9488] border border-[#D5EAE7] flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 fill-[#0D9488] text-[#0D9488]" />
                </span>
              </div>
              <h3 className="font-bold text-[#1F2937] text-sm sm:text-base">Seasoning & Heat</h3>
              <p className="text-xs text-[#728783] mt-1 leading-snug">
                Flavor balance, freshness of spices, and authentic preparation.
              </p>
            </div>

            <div className="bg-[#F8FDFA] p-3.5 sm:p-4 rounded-xl border border-[#D5EAE7] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#728783] uppercase tracking-wider">
                  Quantity
                </span>
                <span className="w-7 h-7 rounded-full bg-[#E6F7F5] text-[#0D9488] border border-[#D5EAE7] flex items-center justify-center">
                  <Utensils className="w-3.5 h-3.5 text-[#0D9488]" />
                </span>
              </div>
              <h3 className="font-bold text-[#1F2937] text-sm sm:text-base">Hostel Satiety</h3>
              <p className="text-xs text-[#728783] mt-1 leading-snug">
                Filling portions relative to serving size and post-class hunger.
              </p>
            </div>

            <div className="bg-[#F8FDFA] p-3.5 sm:p-4 rounded-xl border border-[#D5EAE7] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#728783] uppercase tracking-wider">
                  Value (VFM)
                </span>
                <span className="w-7 h-7 rounded-full bg-[#E6F7F5] text-[#0D9488] border border-[#D5EAE7] flex items-center justify-center">
                  <IndianRupee className="w-3.5 h-3.5 text-[#0D9488]" />
                </span>
              </div>
              <h3 className="font-bold text-[#1F2937] text-sm sm:text-base">Pocket Economy</h3>
              <p className="text-xs text-[#728783] mt-1 leading-snug">
                True price-to-volume ratio calibrated for daily student allowances.
              </p>
            </div>

            <div className="bg-[#F8FDFA] p-3.5 sm:p-4 rounded-xl border border-[#D5EAE7] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#728783] uppercase tracking-wider">
                  Hygiene
                </span>
                <span className="w-7 h-7 rounded-full bg-[#E6F7F5] text-[#0D9488] border border-[#D5EAE7] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
                </span>
              </div>
              <h3 className="font-bold text-[#1F2937] text-sm sm:text-base">Kitchen Cleanliness</h3>
              <p className="text-xs text-[#728783] mt-1 leading-snug">
                Clean prep stations, hairnets, safe handling, and oil freshness.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Bites Under ₹99 (Budget Champions) - Only shown if real data exists */}
        {budgetItems.length > 0 && (
          <section
            aria-labelledby="budget-bites-heading"
            className="bg-[#E6F7F5]/50 p-4 sm:p-6 rounded-2xl border border-[#D5EAE7]"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#0D9488] font-bold">
                  Budget Champions
                </span>
                <h2 id="budget-bites-heading" className="text-lg sm:text-xl font-bold text-[#1F2937]">
                  Popular Bites Under ₹99
                </h2>
              </div>
              <span className="text-xs text-[#728783]">
                Quick grab-and-go options for lecture breaks
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {budgetItems.map((bite) => (
                <div
                  key={bite.id}
                  className="bg-white p-4 rounded-xl border border-[#D5EAE7] shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs text-[#728783] font-medium truncate flex items-center gap-1.5">
                        <CategoryIcon category={bite.category} className="w-3.5 h-3.5 text-[#0D9488]" />
                        <span className="truncate">{bite.outletName}</span>
                      </span>
                      <span className="text-xs font-extrabold text-[#0D9488] bg-[#E6F7F5] border border-[#D5EAE7] px-2 py-0.5 rounded-md shrink-0">
                        ₹{bite.price}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#1F2937] line-clamp-1">
                      {bite.name}
                    </h3>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#D5EAE7]/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      {bite.avgRating ? (
                        <>
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          <span className="font-bold text-[#1F2937]">{bite.avgRating}</span>
                          <span className="text-gray-400 text-[11px]">({bite.ratingsCount})</span>
                        </>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Unrated</span>
                      )}
                    </div>

                    <Link
                      href={`/items/${bite.id}`}
                      className="font-bold text-[#0D9488] hover:text-[#0F766E] hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Dish</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Outlets and Discovery Section */}
        <section id="outlets" aria-labelledby="outlets-section-heading">
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
              Campus Dining Directory
            </span>
            <h2 id="outlets-section-heading" className="text-xl sm:text-2xl font-black text-[#1F2937] tracking-tight">
              Explore Outlets & Menus
            </h2>
          </div>

          {outlets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl p-6 shadow-xs border border-[#D5EAE7]">
              <Store className="w-12 h-12 text-[#0D9488]/40 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-1">No outlets available</h3>
              <p className="text-gray-500 text-sm">Check back soon or ask an admin to configure outlets!</p>
            </div>
          ) : (
            <HomeFeed initialOutlets={outlets} />
          )}
        </section>
      </main>
    </div>
  )
}



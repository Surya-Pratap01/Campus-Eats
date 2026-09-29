import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

async function getOutlets() {
  const supabase = await createClient()
  const { data: outlets } = await supabase
    .from('outlets')
    .select(`
      *,
      menu_items (id)
    `)
    .order('name')

  return outlets || []
}

async function getReportedRatings() {
  const supabase = await createClient()
  const { data: ratings } = await supabase
    .from('ratings')
    .select(`
      *,
      menu_items (name, outlets (name)),
      profiles (full_name, email)
    `)
    .eq('reported', true)
    .order('created_at', { ascending: false })

  return ratings || []
}

export default async function AdminPage() {
  const outlets = await getOutlets()
  const reportedRatings = await getReportedRatings()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Outlets</p>
                <p className="text-3xl font-bold text-gray-900">{outlets.length}</p>
              </div>
              <span className="text-4xl">🏪</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Menu Items</p>
                <p className="text-3xl font-bold text-gray-900">
                  {outlets.reduce((sum, outlet) => sum + (outlet.menu_items?.length || 0), 0)}
                </p>
              </div>
              <span className="text-4xl">🍽️</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Reported Comments</p>
                <p className="text-3xl font-bold text-red-600">{reportedRatings.length}</p>
              </div>
              <span className="text-4xl">🚩</span>
            </div>
          </div>
        </div>

        {/* Manage Outlets */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Manage Outlets</h2>
              <p className="text-xs sm:text-sm text-gray-500">Configure outlets and manage menus</p>
            </div>
            <Link
              href="/admin/outlets/new"
              className="min-h-[44px] px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-xs text-sm flex items-center justify-center active:scale-95"
            >
              + Add Outlet
            </Link>
          </div>

          {outlets.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No outlets configured yet.</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {outlets.map((outlet) => (
                <div key={outlet.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
                  <div className="flex items-center space-x-3.5">
                    {outlet.photo_url ? (
                      <img src={outlet.photo_url} alt={outlet.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-base leading-snug truncate">{outlet.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{outlet.location || 'No location set'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{outlet.menu_items?.length || 0} menu items</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200/60 justify-end">
                    <Link
                      href={`/admin/outlets/${outlet.id}/edit`}
                      className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center active:scale-95"
                    >
                      Edit Outlet
                    </Link>
                    <Link
                      href={`/admin/outlets/${outlet.id}/menu`}
                      className="min-h-[44px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center active:scale-95"
                    >
                      Manage Menu
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reported Comments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6">Reported Comments</h2>

          {reportedRatings.length === 0 ? (
            <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-xl">No reported comments. All clear!</p>
          ) : (
            <div className="space-y-4">
              {reportedRatings.map((rating) => (
                <div key={rating.id} className="p-4 bg-red-50/70 border border-red-200 rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {rating.profiles.full_name || rating.profiles.email}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        On: {rating.menu_items.name} ({rating.menu_items.outlets.name})
                      </p>
                    </div>
                    <form action={`/admin/ratings/${rating.id}/delete`} method="POST">
                      <button
                        type="submit"
                        className="min-h-[44px] px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition active:scale-95 flex items-center justify-center"
                      >
                        Delete Comment
                      </button>
                    </form>
                  </div>
                  
                  {rating.comment && (
                    <p className="text-gray-800 text-sm mt-2 p-2.5 bg-white/80 rounded-lg">{rating.comment}</p>
                  )}
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mt-3 text-gray-600 font-medium">
                    <div>Taste: {rating.taste}/5</div>
                    <div>Hygiene: {rating.hygiene}/5</div>
                    <div>Quantity: {rating.quantity}/5</div>
                    <div>Value: {rating.value_for_money}/5</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

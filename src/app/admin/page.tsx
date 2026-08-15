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
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Manage Outlets</h2>
            <Link
              href="/admin/outlets/new"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              + Add Outlet
            </Link>
          </div>

          {outlets.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No outlets yet. Add your first outlet!</p>
          ) : (
            <div className="space-y-4">
              {outlets.map((outlet) => (
                <div key={outlet.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {outlet.photo_url ? (
                      <img src={outlet.photo_url} alt={outlet.name} className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{outlet.name}</h3>
                      <p className="text-sm text-gray-500">{outlet.location || 'No location'}</p>
                      <p className="text-sm text-gray-400">{outlet.menu_items?.length || 0} menu items</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/outlets/${outlet.id}/edit`}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/outlets/${outlet.id}/menu`}
                      className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                      Menu
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reported Comments */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Reported Comments</h2>

          {reportedRatings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No reported comments. Good job!</p>
          ) : (
            <div className="space-y-4">
              {reportedRatings.map((rating) => (
                <div key={rating.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {rating.profiles.full_name || rating.profiles.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        On: {rating.menu_items.name} ({rating.menu_items.outlets.name})
                      </p>
                    </div>
                    <form action={`/admin/ratings/${rating.id}/delete`} method="POST">
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-lg transition text-sm"
                      >
                        Delete Comment
                      </button>
                    </form>
                  </div>
                  
                  {rating.comment && (
                    <p className="text-gray-700 mt-2">{rating.comment}</p>
                  )}
                  
                  <div className="grid grid-cols-4 gap-2 text-sm mt-2 text-gray-600">
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

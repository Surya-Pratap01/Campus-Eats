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
    .select('*')
    .eq('outlet_id', outletId)
    .order('name')

  return menuItems || []
}

export default async function OutletMenuPage({ params }: { params: { id: string } }) {
  const outlet = await getOutlet(params.id)
  
  if (!outlet) {
    notFound()
  }

  const menuItems = await getMenuItems(params.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-orange-600 hover:text-orange-700 font-medium transition"
          >
            ← Back to Admin
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{outlet.name}</h1>
          <p className="text-gray-500">Manage Menu Items</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Menu Items ({menuItems.length})</h2>
            <Link
              href={`/admin/outlets/${params.id}/menu/new`}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              + Add Menu Item
            </Link>
          </div>

          {menuItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No menu items yet. Add your first item!</p>
          ) : (
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {item.photo_url ? (
                      <img src={item.photo_url} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-300 to-yellow-300 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      {item.price && (
                        <p className="text-sm text-orange-600 font-semibold">₹{item.price}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/menu-items/${item.id}/edit`}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                      Edit
                    </Link>
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

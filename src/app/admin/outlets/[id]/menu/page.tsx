import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { notFound } from 'next/navigation'
import { Utensils, ArrowLeft, Plus } from 'lucide-react'

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

export default async function OutletMenuPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const { id } = await Promise.resolve(params)
  const outlet = await getOutlet(id)
  
  if (!outlet) {
    notFound()
  }

  const menuItems = await getMenuItems(id)

  return (
    <div className="min-h-screen bg-[#F0FBFA]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center min-h-[44px] px-3.5 py-2 rounded-xl bg-white shadow-2xs border border-[#D5EAE7] text-[#0D9488] hover:text-[#0f766e] font-semibold text-sm transition active:scale-95 gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#D5EAE7] p-5 sm:p-8 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 leading-tight">{outlet.name}</h1>
          <p className="text-gray-500 text-xs sm:text-sm">Manage Menu Items & Prices</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#D5EAE7] p-5 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Menu Items ({menuItems.length})</h2>
            <Link
              href={`/admin/outlets/${id}/menu/new`}
              className="min-h-[44px] px-4 py-2.5 bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold rounded-xl transition shadow-xs text-sm flex items-center justify-center active:scale-95 gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Menu Item
            </Link>
          </div>

          {menuItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No menu items yet. Add your first item!</p>
          ) : (
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-100">
                  <div className="flex items-center space-x-4">
                    {item.photo_url ? (
                      <img src={item.photo_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-50 to-emerald-100 border border-[#D5EAE7] rounded-xl flex items-center justify-center shrink-0">
                        <Utensils className="w-6 h-6 text-teal-600/70" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      {item.price && (
                        <p className="text-sm text-[#0D9488] font-semibold">₹{item.price}</p>
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

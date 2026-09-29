const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zcbmvhjkharfmmiqslls.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_N1mq3YVsrcG9mwtJYwE-1Q_WsuKHY2L'

const supabase = createClient(supabaseUrl, supabaseKey)

const CONFIRMED_OUTLETS = [
  'Maggi Point (Hotspot)',
  'Quench',
  'Southern Stories',
  'Snap Eats',
  'Domino\'s Pizza',
  'Subway',
  'House of Chow'
]

async function sync() {
  console.log('--- Starting Database Synchronization ---')

  // 1. Fetch all current outlets
  const { data: currentOutlets, error: fetchErr } = await supabase
    .from('outlets')
    .select('*')

  if (fetchErr) {
    console.error('Error fetching outlets:', fetchErr)
    process.exit(1)
  }

  console.log('Current outlets in database:', currentOutlets.map(o => o.name))

  // 2. Rename SnapEats to Snap Eats if present
  const snapEatsOld = currentOutlets.find(o => o.name.toLowerCase() === 'snapeats')
  if (snapEatsOld) {
    console.log(`Renaming "${snapEatsOld.name}" to "Snap Eats"...`)
    const { error: renameErr } = await supabase
      .from('outlets')
      .update({ name: 'Snap Eats' })
      .eq('id', snapEatsOld.id)
    if (renameErr) console.error('Error renaming SnapEats:', renameErr)
  }

  // Refetch outlets after possible rename
  const { data: updatedOutlets } = await supabase.from('outlets').select('*')

  // 3. Remove unconfirmed outlets (e.g. Green Nox, Infinity Kitchens, Chill Wheel, etc.)
  for (const outlet of updatedOutlets || []) {
    const isConfirmed = CONFIRMED_OUTLETS.some(
      name => name.toLowerCase() === outlet.name.toLowerCase()
    )
    if (!isConfirmed) {
      console.log(`Removing unconfirmed outlet: "${outlet.name}" (${outlet.id})...`)
      
      // Delete any menu items first (in case cascade isn't configured)
      await supabase.from('menu_items').delete().eq('outlet_id', outlet.id)
      
      const { error: delErr } = await supabase
        .from('outlets')
        .delete()
        .eq('id', outlet.id)
      
      if (delErr) {
        console.error(`Error deleting outlet "${outlet.name}":`, delErr)
      } else {
        console.log(`✓ Deleted "${outlet.name}"`)
      }
    }
  }

  // 4. Ensure each confirmed outlet exists
  const { data: existingAfterDelete } = await supabase.from('outlets').select('*')
  const existingNames = new Set((existingAfterDelete || []).map(o => o.name.toLowerCase()))

  for (const confirmedName of CONFIRMED_OUTLETS) {
    if (!existingNames.has(confirmedName.toLowerCase())) {
      console.log(`Adding confirmed outlet: "${confirmedName}"...`)
      const { error: insertErr } = await supabase
        .from('outlets')
        .insert({
          name: confirmedName,
          description: null,
          location: null,
          photo_url: confirmedName === 'House of Chow' ? '/outlets/house-of-chow.jpg.png' : null
        })
      if (insertErr) {
        console.error(`Error adding "${confirmedName}":`, insertErr)
      } else {
        console.log(`✓ Added "${confirmedName}"`)
      }
    } else {
      // Ensure exact naming casing matches CONFIRMED_OUTLETS
      const existing = existingAfterDelete.find(
        o => o.name.toLowerCase() === confirmedName.toLowerCase()
      )
      if (existing && existing.name !== confirmedName) {
        console.log(`Updating name case from "${existing.name}" to "${confirmedName}"...`)
        await supabase
          .from('outlets')
          .update({ name: confirmedName })
          .eq('id', existing.id)
      }
    }
  }

  // 5. Clear all unverified menu items for now as specified:
  // "For now, we do NOT have sufficiently reliable complete menus for these outlets.
  // Therefore leave the menu empty. Menu information coming soon."
  console.log('Clearing unverified menu items across all outlets...')
  const { data: deletedItems, error: menuDelErr } = await supabase
    .from('menu_items')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // delete all
  if (menuDelErr) {
    console.error('Error clearing unverified menu items:', menuDelErr)
  } else {
    console.log('✓ All unverified menu items cleared.')
  }

  // 6. Final verification
  const { data: finalOutlets } = await supabase
    .from('outlets')
    .select('id, name')
    .order('name')
  
  const { count: finalMenuCount } = await supabase
    .from('menu_items')
    .select('*', { count: 'exact', head: true })

  console.log('\n=== FINAL VERIFICATION ===')
  console.log('Active Outlets in DB (' + (finalOutlets?.length || 0) + '):')
  finalOutlets?.forEach((o, i) => console.log(`  ${i + 1}. ${o.name}`))
  console.log(`Total Menu Items in DB: ${finalMenuCount || 0}`)
  console.log('=== SYNC COMPLETE ===')
}

sync()

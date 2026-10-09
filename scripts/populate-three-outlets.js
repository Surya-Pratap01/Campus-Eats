const { createClient } = require('@supabase/supabase-js')
const path = require('path')
const fs = require('fs')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zcbmvhjkharfmmiqslls.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_N1mq3YVsrcG9mwtJYwE-1Q_WsuKHY2L'

const supabase = createClient(supabaseUrl, supabaseKey)

// Load exported menu data
const menuDataPath = path.join(__dirname, 'menu-data-three-outlets.json')
const menuData = JSON.parse(fs.readFileSync(menuDataPath, 'utf8'))

async function syncOutlet(outletName, photoUrlUpdate, items) {
  console.log(`\n================ Processing Outlet: ${outletName} ================`)
  
  // 1. Locate or create outlet record
  const { data: outlets, error: outletFetchErr } = await supabase
    .from('outlets')
    .select('*')
  
  if (outletFetchErr) {
    console.error(`Error fetching outlets:`, outletFetchErr)
    throw outletFetchErr
  }

  let outlet = outlets.find(o => o.name.trim().toLowerCase() === outletName.trim().toLowerCase())

  if (!outlet) {
    console.log(`Outlet "${outletName}" does not exist. Creating new outlet record...`)
    const { data: newOutlet, error: createErr } = await supabase
      .from('outlets')
      .insert({
        name: outletName,
        photo_url: photoUrlUpdate || null,
        location: null,
        description: null
      })
      .select()
      .single()

    if (createErr) {
      console.error(`Error creating outlet "${outletName}":`, createErr)
      throw createErr
    }
    outlet = newOutlet
    console.log(`✓ Created outlet "${outlet.name}" with ID: ${outlet.id}`)
  } else {
    console.log(`✓ Located existing outlet "${outlet.name}" with ID: ${outlet.id}`)
    if (photoUrlUpdate && outlet.photo_url !== photoUrlUpdate) {
      console.log(`Updating photo_url for "${outlet.name}" to "${photoUrlUpdate}"...`)
      const { error: photoErr } = await supabase
        .from('outlets')
        .update({ photo_url: photoUrlUpdate })
        .eq('id', outlet.id)

      if (photoErr) {
        console.error(`Error updating photo_url:`, photoErr)
      } else {
        console.log(`✓ Photo URL updated successfully to "${photoUrlUpdate}"`)
        outlet.photo_url = photoUrlUpdate
      }
    } else {
      console.log(`Photo URL status: ${outlet.photo_url || 'None (preserved as requested)'}`)
    }
  }

  // 2. Fetch existing menu items
  const { data: existingItems, error: itemsErr } = await supabase
    .from('menu_items')
    .select('id, name, category, price, photo_url')
    .eq('outlet_id', outlet.id)

  if (itemsErr) {
    console.error(`Error fetching existing items for "${outlet.name}":`, itemsErr)
    throw itemsErr
  }

  console.log(`Existing menu items count: ${existingItems.length}`)

  // 3. Process items with duplicate protection
  let added = 0
  let updated = 0
  const toInsert = []

  // Track matched existing IDs to avoid pairing the same item twice
  const matchedExistingIds = new Set()

  for (const item of items) {
    const existing = existingItems.find(e => 
      !matchedExistingIds.has(e.id) &&
      e.name.trim().toLowerCase() === item.name.trim().toLowerCase() &&
      e.category.trim().toLowerCase() === item.category.trim().toLowerCase()
    )

    if (existing) {
      matchedExistingIds.add(existing.id)
      if (existing.price !== item.price) {
        const { error: updErr } = await supabase
          .from('menu_items')
          .update({ price: item.price })
          .eq('id', existing.id)

        if (updErr) {
          console.error(`Error updating price for ${item.name}:`, updErr)
        } else {
          updated++
        }
      }
    } else {
      toInsert.push({
        outlet_id: outlet.id,
        name: item.name,
        category: item.category,
        price: item.price,
        photo_url: null
      })
    }
  }

  // Batch insert new items
  const BATCH_SIZE = 25
  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const chunk = toInsert.slice(i, i + BATCH_SIZE)
    const { error: insErr } = await supabase
      .from('menu_items')
      .insert(chunk)

    if (insErr) {
      console.error(`Error inserting batch ${i} - ${i + chunk.length}:`, insErr)
      throw insErr
    }
    added += chunk.length
    console.log(`  + Inserted items ${i + 1} to ${i + chunk.length} of ${toInsert.length}`)
  }

  // 4. Verify final count
  const { data: finalItems, error: finalErr } = await supabase
    .from('menu_items')
    .select('*')
    .eq('outlet_id', outlet.id)

  if (finalErr) {
    console.error(`Error fetching final count:`, finalErr)
  } else {
    console.log(`\n--- ${outletName} Summary ---`)
    console.log(`Existing before: ${existingItems.length}`)
    console.log(`Updated: ${updated}`)
    console.log(`Added: ${added}`)
    console.log(`Total in database now: ${finalItems.length}`)
    console.log(`Expected total: ${items.length}`)
  }

  return {
    outletId: outlet.id,
    existingBefore: existingItems.length,
    updated,
    added,
    finalTotal: finalItems?.length || 0,
    photoUrl: outlet.photo_url
  }
}

async function runImport() {
  try {
    console.log('Starting controlled import for Quench, Southern Stories, and Monginis...')

    // 1. Quench (preserve photo_url as null until user provides Quench photo)
    const quenchRes = await syncOutlet('Quench', null, menuData.quench)

    // 2. Southern Stories (update photo_url to /outlets/southern-stories.jpg)
    const ssRes = await syncOutlet('Southern Stories', '/outlets/southern-stories.jpg', menuData.southern_stories)

    // 3. Monginis (create outlet if needed, set photo_url to /outlets/monginis.png)
    const monginisRes = await syncOutlet('Monginis', '/outlets/monginis.png', menuData.monginis)

    console.log('\n================ ALL IMPORTS COMPLETED ================')
    console.log('Quench:', quenchRes)
    console.log('Southern Stories:', ssRes)
    console.log('Monginis:', monginisRes)

  } catch (err) {
    console.error('Fatal import error:', err)
    process.exit(1)
  }
}

runImport()

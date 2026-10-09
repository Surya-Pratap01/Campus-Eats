const { createClient } = require('@supabase/supabase-js')
const path = require('path')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zcbmvhjkharfmmiqslls.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_N1mq3YVsrcG9mwtJYwE-1Q_WsuKHY2L'

const supabase = createClient(supabaseUrl, supabaseKey)

// Authoritative 43 menu items from Hotspot Menu.xlsx
const hotspotMenuItems = [
  // Maggi (Special - ₹45)
  { name: 'Double Maggi', category: 'Maggi', price: 45 },

  // Maggi (Select - ₹50)
  { name: 'Butter Maggi', category: 'Maggi', price: 50 },
  { name: 'Oregano Maggi', category: 'Maggi', price: 50 },
  { name: 'Rosemary', category: 'Maggi', price: 50 },
  { name: 'Corn', category: 'Maggi', price: 50 },

  // Maggi (Premium - ₹55)
  { name: 'Atta Masala', category: 'Maggi', price: 55 },
  { name: 'Onion Capsicum', category: 'Maggi', price: 55 },
  { name: 'Peri Peri', category: 'Maggi', price: 55 },
  { name: 'Fusion Maggi', category: 'Maggi', price: 55 },
  { name: 'Oats Masala', category: 'Maggi', price: 55 },

  // Maggi / Pasta (Exotic - ₹60)
  { name: 'Butter Double Masala', category: 'Maggi / Pasta', price: 60 },
  { name: 'Cheese Maggi', category: 'Maggi / Pasta', price: 60 },
  { name: 'Butter Garlic', category: 'Maggi / Pasta', price: 60 },
  { name: 'Schezwan', category: 'Maggi / Pasta', price: 60 },
  { name: 'Chilli Garlic', category: 'Maggi / Pasta', price: 60 },
  { name: 'Masala Penne with Tomato', category: 'Maggi / Pasta', price: 60 },
  { name: 'Tomato Pazzta', category: 'Maggi / Pasta', price: 60 },
  { name: 'Cheese Macaroni', category: 'Maggi / Pasta', price: 60 },

  // Maggi (Limited - ₹70)
  { name: 'Onion Capsicum Butter Maggi', category: 'Maggi', price: 70 },
  { name: 'Corn and Cheese', category: 'Maggi', price: 70 },
  { name: 'Chilli Garlic Cheese', category: 'Maggi', price: 70 },

  // Nescafé (Select - ₹20)
  { name: 'Espresso', category: 'Nescafé', price: 20 },
  { name: 'Cardamom Tea', category: 'Nescafé', price: 20 },
  { name: 'Milk', category: 'Nescafé', price: 20 },
  { name: 'Masala Tea', category: 'Nescafé', price: 20 },

  // Nescafé (Premium - ₹30)
  { name: 'Cappuccino', category: 'Nescafé', price: 30 },
  { name: 'Café Latte', category: 'Nescafé', price: 30 },
  { name: 'Ginger & Honey Tea', category: 'Nescafé', price: 30 },
  { name: 'Assam Tea', category: 'Nescafé', price: 30 },
  { name: 'Darjeeling Tea', category: 'Nescafé', price: 30 },

  // Nescafé (Exotic - ₹35)
  { name: 'Café Mocha', category: 'Nescafé', price: 35 },
  { name: 'Hot Chocolate', category: 'Nescafé', price: 35 },

  // Nescafé (Limited - ₹40)
  { name: 'Irish', category: 'Nescafé', price: 40 },
  { name: 'Caramel', category: 'Nescafé', price: 40 },
  { name: 'Hazelnut Cappuccino', category: 'Nescafé', price: 40 },

  // Blended Cold Beverages & More Coolers
  { name: 'Lemon Ice Tea', category: 'Blended Cold Beverages & More Coolers', price: 40, largePrice: 75 },
  { name: 'Special Masala Lemon Ice Tea', category: 'Blended Cold Beverages & More Coolers', price: 45, largePrice: 85 },

  // Cold Coffee, Chocolate & Others
  { name: 'Frappe', category: 'Cold Coffee, Chocolate & Others', price: 55, largePrice: 105 },
  { name: 'Frappe Mocha / Cold Chocolate', category: 'Cold Coffee, Chocolate & Others', price: 60 },
  { name: 'Irish / Caramel / Honey Frappe', category: 'Cold Coffee, Chocolate & Others', price: 75 },
  { name: 'Chocolate / Hazelnut Frappe', category: 'Cold Coffee, Chocolate & Others', price: 75 },
  { name: 'Cookie / Kit Kat Frappe', category: 'Cold Coffee, Chocolate & Others', price: 75 },
  { name: 'Munch Nuts Frappe', category: 'Cold Coffee, Chocolate & Others', price: 75 },
]

async function populateHotspotMenu() {
  try {
    console.log('=== Populating Hotspot / Maggi Point Menu ===')

    // 1. Locate the existing Hotspot / Maggi Point outlet
    const { data: outlets, error: outletError } = await supabase
      .from('outlets')
      .select('*')

    if (outletError) {
      console.error('Error fetching outlets:', outletError)
      process.exit(1)
    }

    const hotspotOutlet = outlets.find(o => 
      o.name.toLowerCase().includes('maggi point') || 
      o.name.toLowerCase().includes('hotspot')
    )

    if (!hotspotOutlet) {
      console.error('Could not find existing Hotspot / Maggi Point outlet in database.')
      process.exit(1)
    }

    console.log(`Found outlet: "${hotspotOutlet.name}" (ID: ${hotspotOutlet.id})`)

    // 2. Update photo_url if currently null/missing
    if (!hotspotOutlet.photo_url) {
      console.log('Updating outlet photo_url to "/outlets/hotspot.jpg"...')
      const { error: photoErr } = await supabase
        .from('outlets')
        .update({ photo_url: '/outlets/hotspot.jpg' })
        .eq('id', hotspotOutlet.id)

      if (photoErr) {
        console.error('Error updating outlet photo_url:', photoErr)
      } else {
        console.log('✓ Outlet photo_url updated successfully')
      }
    } else {
      console.log(`Outlet already has photo_url: ${hotspotOutlet.photo_url}`)
    }

    // 3. Inspect existing items under this outlet
    const { data: existingItems, error: itemsErr } = await supabase
      .from('menu_items')
      .select('id, name, category, price, photo_url')
      .eq('outlet_id', hotspotOutlet.id)

    if (itemsErr) {
      console.error('Error fetching existing items:', itemsErr)
      process.exit(1)
    }

    console.log(`Current existing items for Hotspot: ${existingItems.length}`)

    // 4. Upsert/insert items preserving existing IDs if matched
    let added = 0
    let updated = 0

    for (const item of hotspotMenuItems) {
      const existing = existingItems.find(
        e => e.name.trim().toLowerCase() === item.name.trim().toLowerCase()
      )

      if (existing) {
        // Update price and category if needed
        const { error: updateErr } = await supabase
          .from('menu_items')
          .update({
            category: item.category,
            price: item.price
          })
          .eq('id', existing.id)

        if (updateErr) {
          console.error(`Error updating ${item.name}:`, updateErr)
        } else {
          console.log(`~ Updated: ${item.name} (preserved ID ${existing.id})`)
          updated++
        }
      } else {
        // Insert new item
        const { error: insertErr } = await supabase
          .from('menu_items')
          .insert({
            outlet_id: hotspotOutlet.id,
            name: item.name,
            category: item.category,
            price: item.price,
            photo_url: null
          })

        if (insertErr) {
          console.error(`Error inserting ${item.name}:`, insertErr)
        } else {
          console.log(`+ Added: ${item.name} (₹${item.price})`)
          added++
        }
      }
    }

    // 5. Verify final count
    const { data: finalItems, error: finalErr } = await supabase
      .from('menu_items')
      .select('*')
      .eq('outlet_id', hotspotOutlet.id)

    if (finalErr) {
      console.error('Error fetching final items:', finalErr)
    } else {
      console.log('\n=== IMPORT SUMMARY ===')
      console.log(`Added: ${added}`)
      console.log(`Updated: ${updated}`)
      console.log(`Total Hotspot menu items now in DB: ${finalItems.length}`)
      console.log(`Expected: ${hotspotMenuItems.length}`)
    }

  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

populateHotspotMenu()

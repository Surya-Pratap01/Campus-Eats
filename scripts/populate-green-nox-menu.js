const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zcbmvhjkharfmmiqslls.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_N1mq3YVsrcG9mwtJYwE-1Q_WsuKHY2L'

const supabase = createClient(supabaseUrl, supabaseKey)

// Complete verified Green Nox menu
const greenNoxMenu = [
  // QUICK BITES — 5
  { name: 'Classic French Fries', category: 'Quick Bites', price: 89 },
  { name: 'Peri Peri French Fries', category: 'Quick Bites', price: 99 },
  { name: 'Korean French Fries', category: 'Quick Bites', price: 99 },
  { name: 'Loaded French Fries', category: 'Quick Bites', price: 139 },
  { name: 'Loaded Nachos', category: 'Quick Bites', price: 129 },
  
  // TACOS — 3
  { name: 'Mexican Veg Taco (2pc)', category: 'Tacos', price: 129 },
  { name: 'Cottage Cheese Taco (2pc)', category: 'Tacos', price: 139 },
  { name: 'Mexican Chicken Taco (2pc)', category: 'Tacos', price: 169 },
  
  // WAFFLES (2pcs) — 4
  { name: 'Double Chocolate Waffles', category: 'Waffles', price: 149 },
  { name: 'Brownie Waffles', category: 'Waffles', price: 179 },
  { name: 'Mixed Berry Waffles', category: 'Waffles', price: 189 },
  { name: 'Cookies and Caramel Waffles', category: 'Waffles', price: 199 },
  
  // FRESH JUICE — 6
  { name: 'Watermelon Juice', category: 'Fresh Juice', price: 79 },
  { name: 'Mixed Fruit Juice', category: 'Fresh Juice', price: 89 },
  { name: 'Watermelon Beetroot Fusion Juice', category: 'Fresh Juice', price: 99 },
  { name: 'Orange Juice (Seasonal)', category: 'Fresh Juice', price: 129 },
  { name: 'ABC Red Nutritional Juice', category: 'Fresh Juice', price: 129 },
  { name: 'The Vitamin C Juice', category: 'Fresh Juice', price: 129 },
  
  // WRAPS — 5
  { name: 'Assorted Grilled Veggies Wrap', category: 'Wraps', price: 129 },
  { name: 'Paneer Tikka Wrap', category: 'Wraps', price: 149 },
  { name: 'Hummus Falafel Wrap', category: 'Wraps', price: 179 },
  { name: 'Grilled Chicken Wrap', category: 'Wraps', price: 179 },
  { name: 'Tandoori Chicken Wrap', category: 'Wraps', price: 179 },
  
  // SUB — 8
  { name: 'Green Farm Sub', category: 'Sub', price: 109 },
  { name: 'Delight Veggies Sub', category: 'Sub', price: 149 },
  { name: 'Cheesy Tikka Sub', category: 'Sub', price: 179 },
  { name: 'Hummus Falafel Sub', category: 'Sub', price: 179 },
  { name: 'Paneer Tikka Sub', category: 'Sub', price: 179 },
  { name: 'Pesto Chicken Sub', category: 'Sub', price: 199 },
  { name: 'Tandoori Chicken Sub', category: 'Sub', price: 199 },
  { name: 'Grilled Chicken Sub', category: 'Sub', price: 199 },
  
  // SANDWICH (2pc / 4pc) — 6
  { name: 'Classic Sandwich (2pc / 4pc)', category: 'Sandwich', price: 79 },
  { name: 'Corn & Cheese Sandwich (2pc / 4pc)', category: 'Sandwich', price: 79 },
  { name: 'Cheese Aloo Patty Sandwich (2pc / 4pc)', category: 'Sandwich', price: 99 },
  { name: 'Pesto Grilled Veggies Sandwich (2pc / 4pc)', category: 'Sandwich', price: 109 },
  { name: 'Paneer Tikka Sandwich (2pc / 4pc)', category: 'Sandwich', price: 109 },
  { name: 'Grilled Chicken BBQ Sandwich (2pc / 4pc)', category: 'Sandwich', price: 129 },
  
  // WHOLESOME MEAL — 5
  { name: 'Paneer Steak with Mashed Potato', category: 'Wholesome Meal', price: 199 },
  { name: 'High Protein Chicken Bowl (200g)', category: 'Wholesome Meal', price: 199 },
  { name: 'Grilled Chicken With Mashed Potato', category: 'Wholesome Meal', price: 219 },
  { name: 'Caribbean Chicken Fillets', category: 'Wholesome Meal', price: 229 },
  { name: 'Artisanal Fish Fillet & Lemon Butter Sauce / Garlic Ranch', category: 'Wholesome Meal', price: 269 },
  
  // BURRITO BOWLS/WRAPS — 3
  { name: 'Mexican Avocado Burrito Bowl', category: 'Burrito Bowls', price: 229 },
  { name: 'Cottage Cheese Burrito Bowl', category: 'Burrito Bowls', price: 239 },
  { name: 'Mexican Chicken Avocado Burrito Bowl', category: 'Burrito Bowls', price: 249 },
  
  // RICE — 4
  { name: 'Soya Paneer Rice Bowl', category: 'Rice', price: 179 },
  { name: 'Paneer Steak Rice Bowl', category: 'Rice', price: 199 },
  { name: 'Grilled Chicken Rice Bowl', category: 'Rice', price: 229 },
  { name: 'Chicken Steak Rice Bowl', category: 'Rice', price: 249 },
  
  // BURGER (Whole Wheat Goodness) — 4
  { name: 'Korean Veg Burger', category: 'Burger', price: 89 },
  { name: 'Cheese Veg Burger', category: 'Burger', price: 89 },
  { name: 'Paneer Mania Burger', category: 'Burger', price: 99 },
  { name: 'Grilled Chicken Burger', category: 'Burger', price: 129 },
  
  // PASTA (Durum Wheat) — 6 (3 items × Veg/Non-Veg)
  { name: 'Alfredo Pasta — Veg', category: 'Pasta', price: 149 },
  { name: 'Alfredo Pasta — Non-Veg', category: 'Pasta', price: 179 },
  { name: 'Arrabbiata Pasta — Veg', category: 'Pasta', price: 149 },
  { name: 'Arrabbiata Pasta — Non-Veg', category: 'Pasta', price: 179 },
  { name: 'Mix Sauce Pasta — Veg', category: 'Pasta', price: 149 },
  { name: 'Mix Sauce Pasta — Non-Veg', category: 'Pasta', price: 179 },
  
  // SALADS — 13
  { name: 'Classic Caesar Salad', category: 'Salads', price: 189 },
  { name: 'Extravaganza Veggies Salad', category: 'Salads', price: 199 },
  { name: 'Protein Packed Salad', category: 'Salads', price: 199 },
  { name: 'Basil Pesto Pasta Salad', category: 'Salads', price: 199 },
  { name: 'Hummus Falafel Salad', category: 'Salads', price: 209 },
  { name: 'Assorted Veggies & Quinoa Salad', category: 'Salads', price: 209 },
  { name: 'Cottage Cheese Salad', category: 'Salads', price: 209 },
  { name: 'Greek Salad With Avocado & Feta Cheese', category: 'Salads', price: 249 },
  { name: 'Chicken Caesar Salad', category: 'Salads', price: 229 },
  { name: 'Egg Green Salad', category: 'Salads', price: 249 },
  { name: 'Grilled Chicken & Quinoa Salad', category: 'Salads', price: 249 },
  { name: 'High Protein Chicken Salad', category: 'Salads', price: 249 },
  { name: 'Grilled Chicken & Avocado Salad', category: 'Salads', price: 269 },
  
  // FRUIT SALAD — 2
  { name: 'Rainbow Fruit Salad', category: 'Fruit Salad', price: 149 },
  { name: 'Delight Fruit Salad', category: 'Fruit Salad', price: 169 }
]

async function populateGreenNoxMenu() {
  try {
    console.log('Starting Green Nox menu population...')
    
    // Get or create Green Nox outlet
    let { data: outlet, error: outletError } = await supabase
      .from('outlets')
      .select('*')
      .eq('name', 'Green Nox')
      .single()
    
    if (outletError || !outlet) {
      console.log('Creating Green Nox outlet...')
      const { data: newOutlet, error: createError } = await supabase
        .from('outlets')
        .insert({
          name: 'Green Nox',
          description: 'Healthy, fresh, and balanced food made for everyday wellness.',
          location: 'P-Block, Bennett University',
          photo_url: null
        })
        .select()
        .single()
      
      if (createError) {
        console.error('Error creating outlet:', createError)
        return
      }
      outlet = newOutlet
    }
    
    console.log(`Green Nox outlet ID: ${outlet.id}`)
    
    // Get existing menu items to preserve ratings
    const { data: existingItems, error: existingError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('outlet_id', outlet.id)
    
    if (existingError) {
      console.error('Error fetching existing items:', existingError)
      return
    }
    
    console.log(`Found ${existingItems?.length || 0} existing menu items`)
    
    // Create a map of existing items by name for comparison
    const existingMap = new Map()
    existingItems?.forEach(item => {
      existingMap.set(item.name, item)
    })
    
    // Track statistics
    let updated = 0
    let added = 0
    let skipped = 0
    
    // Process each menu item
    for (const menuItem of greenNoxMenu) {
      const existing = existingMap.get(menuItem.name)
      
      if (existing) {
        // Update existing item to preserve ratings
        const { error: updateError } = await supabase
          .from('menu_items')
          .update({
            category: menuItem.category,
            price: menuItem.price
          })
          .eq('id', existing.id)
        
        if (updateError) {
          console.error(`Error updating ${menuItem.name}:`, updateError)
        } else {
          console.log(`✓ Updated: ${menuItem.name}`)
          updated++
        }
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('menu_items')
          .insert({
            outlet_id: outlet.id,
            name: menuItem.name,
            category: menuItem.category,
            price: menuItem.price,
            photo_url: null
          })
        
        if (insertError) {
          console.error(`Error inserting ${menuItem.name}:`, insertError)
        } else {
          console.log(`+ Added: ${menuItem.name}`)
          added++
        }
      }
    }
    
    // Check for items that should be removed (not in the verified list)
    const verifiedNames = new Set(greenNoxMenu.map(item => item.name))
    for (const existing of existingItems || []) {
      if (!verifiedNames.has(existing.name)) {
        console.log(`- Removing outdated: ${existing.name}`)
        const { error: deleteError } = await supabase
          .from('menu_items')
          .delete()
          .eq('id', existing.id)
        
        if (deleteError) {
          console.error(`Error deleting ${existing.name}:`, deleteError)
        }
      }
    }
    
    // Verify final count
    const { data: finalItems, error: finalError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('outlet_id', outlet.id)
    
    if (finalError) {
      console.error('Error verifying final count:', finalError)
    } else {
      console.log(`\n=== SUMMARY ===`)
      console.log(`Updated: ${updated}`)
      console.log(`Added: ${added}`)
      console.log(`Total items: ${finalItems?.length || 0}`)
      console.log(`Expected: ${greenNoxMenu.length}`)
      
      if (finalItems?.length === greenNoxMenu.length) {
        console.log('✓ Menu population successful!')
      } else {
        console.log('⚠ Menu count mismatch')
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

populateGreenNoxMenu()

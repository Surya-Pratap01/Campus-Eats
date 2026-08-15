const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Infinity Kitchens Menu - 75 items
const infinityKitchensMenu = [
  // VEG WRAPS — 6
  { name: 'Soya Chap', category: 'Veg Wraps', price: 116 },
  { name: 'Paneer Tikka', category: 'Veg Wraps', price: 137 },
  { name: 'Paneer Bhujii', category: 'Veg Wraps', price: 137 },
  { name: 'Paneer Shawarma', category: 'Veg Wraps', price: 147 },
  { name: 'Paneer Makhani', category: 'Veg Wraps', price: 152 },
  { name: 'Paneer Schezwan', category: 'Veg Wraps', price: 152 },
  
  // NON VEG WRAPS — 9
  { name: 'Egg Wrap (2Egg)', category: 'Non Veg Wraps', price: 95 },
  { name: 'Noodles Egg', category: 'Non Veg Wraps', price: 116 },
  { name: 'Paneer Egg', category: 'Non Veg Wraps', price: 152 },
  { name: 'Chicken Kabab', category: 'Non Veg Wraps', price: 189 },
  { name: 'Chicken Tikka', category: 'Non Veg Wraps', price: 189 },
  { name: 'Chicken Noodles', category: 'Non Veg Wraps', price: 189 },
  { name: 'Chicken Makhani', category: 'Non Veg Wraps', price: 189 },
  { name: 'Chicken Shawarma', category: 'Non Veg Wraps', price: 189 },
  { name: 'Chicken Achari', category: 'Non Veg Wraps', price: 189 },
  
  // SANDWICHES & BURGERS — 10
  { name: 'Chicken Burger', category: 'Sandwiches & Burgers', price: 137 },
  { name: 'Chicken Tikka Burger', category: 'Sandwiches & Burgers', price: 147 },
  { name: 'Chicken Makhni Burger', category: 'Sandwiches & Burgers', price: 147 },
  { name: 'Chicken Tikka Sandwich', category: 'Sandwiches & Burgers', price: 158 },
  { name: 'Chicken Keema Sandwich', category: 'Sandwiches & Burgers', price: 158 },
  { name: 'Chicken Schezwan Sandwich', category: 'Sandwiches & Burgers', price: 158 },
  { name: 'Chicken Makhni Sandwich', category: 'Sandwiches & Burgers', price: 158 },
  { name: 'Chicken Kebab Sandwich', category: 'Sandwiches & Burgers', price: 179 },
  { name: 'Chicken Salami Sandwich', category: 'Sandwiches & Burgers', price: 179 },
  { name: 'Tandoori Tikka Sandwich', category: 'Sandwiches & Burgers', price: 179 },
  
  // PARATHA — 13
  { name: 'Aloo Paratha', category: 'Paratha', price: 75 },
  { name: 'Aloo Pyaz Paratha', category: 'Paratha', price: 75 },
  { name: 'Pyaz Paratha', category: 'Paratha', price: 75 },
  { name: 'Mix Paratha', category: 'Paratha', price: 75 },
  { name: 'Paneer Paratha', category: 'Paratha', price: 95 },
  { name: 'Egg Paratha', category: 'Paratha', price: 95 },
  { name: 'Aloo Paneer Paratha', category: 'Paratha', price: 95 },
  { name: 'Paneer Pyaz Paratha', category: 'Paratha', price: 95 },
  { name: 'Gobhi Paratha', category: 'Paratha', price: 75 },
  { name: 'Choly Bhature', category: 'Paratha', price: 90 },
  { name: 'Poori Sabji', category: 'Paratha', price: 50 },
  { name: 'Kachori Sabji', category: 'Paratha', price: 50 },
  { name: 'Samosa Choly', category: 'Paratha', price: 50 },
  
  // OMELETTE — 4
  { name: 'Bread Omelette', category: 'Omelette', price: 63 },
  { name: 'Masala Omelette', category: 'Omelette', price: 58 },
  { name: 'Plain Omelette', category: 'Omelette', price: 58 },
  { name: 'Cheese Omelette', category: 'Omelette', price: 93 },
  
  // SIP AND SAVOR — 5
  { name: 'Adrak Chai (S ₹11 / R ₹16 / L ₹21)', category: 'Sip and Savor', price: 11 },
  { name: 'Masala Chai (S ₹16 / R ₹21 / L ₹26)', category: 'Sip and Savor', price: 16 },
  { name: 'Kadak Elaichi Chai (R ₹21 / L ₹26)', category: 'Sip and Savor', price: 21 },
  { name: 'Lemon Tea (R ₹21 / L ₹26)', category: 'Sip and Savor', price: 21 },
  { name: 'Hot / Black Coffee (₹45 / ₹55)', category: 'Sip and Savor', price: 45 },
  
  // COLD COFFEE — 3
  { name: 'Cold Coffee', category: 'Cold Coffee', price: 69 },
  { name: 'Caramel / Hazelnut', category: 'Cold Coffee', price: 104 },
  { name: 'Irish / Brownie', category: 'Cold Coffee', price: 147 },
  
  // CRUNCH N MUNCH — 5
  { name: 'Veg Patty', category: 'Crunch N Munch', price: 32 },
  { name: 'Paneer Patty', category: 'Crunch N Munch', price: 42 },
  { name: 'Aloo Samosa', category: 'Crunch N Munch', price: 20 },
  { name: 'Kachori Sabji', category: 'Crunch N Munch', price: 50 },
  { name: 'Vada Pao', category: 'Crunch N Munch', price: 50 },
  
  // TOAST N MORE — 2
  { name: 'Garlic Toast with Cheese (2pc)', category: 'Toast N More', price: 68 },
  { name: 'Exotic Garlic Toast (2pc)', category: 'Toast N More', price: 79 },
  
  // SANDWICH — 7
  { name: 'Aloo Tikki', category: 'Sandwich', price: 95 },
  { name: 'Cheese Grilled', category: 'Sandwich', price: 95 },
  { name: 'Cheese Pizza Grilled', category: 'Sandwich', price: 126 },
  { name: 'Cheese Corn', category: 'Sandwich', price: 126 },
  { name: 'Tandoori Soya', category: 'Sandwich', price: 126 },
  { name: 'Paneer Masala', category: 'Sandwich', price: 126 },
  { name: 'Paneer Makhani', category: 'Sandwich', price: 147 },
  
  // MULTIGRAIN — 4
  { name: 'Veg Grilled Sandwich', category: 'Multigrain', price: 73 },
  { name: 'Crispy Veg Sandwich', category: 'Multigrain', price: 94 },
  { name: 'Jungle Paneer Sandwich', category: 'Multigrain', price: 94 },
  { name: 'Crispy Paneer Sandwich', category: 'Multigrain', price: 104 },
  
  // BURGER — 4
  { name: 'Veg Burger', category: 'Burger', price: 63 },
  { name: 'Crispy Paneer Burger', category: 'Burger', price: 116 },
  { name: 'Cheese Slice', category: 'Burger', price: 11 },
  { name: 'Maharaja Burger', category: 'Burger', price: 140 },
  
  // PASTA SAUCE — 3
  { name: 'White Sauce', category: 'Pasta Sauce', price: 105 },
  { name: 'Red Sauce', category: 'Pasta Sauce', price: 105 },
  { name: 'Mix Sauce', category: 'Pasta Sauce', price: 126 }
]

async function populateInfinityKitchens() {
  try {
    console.log('Starting Infinity Kitchens population...')
    
    // Get or create outlet
    let { data: outlet, error: outletError } = await supabase
      .from('outlets')
      .select('*')
      .eq('name', 'Infinity Kitchens')
      .single()
    
    if (outletError || !outlet) {
      console.log('Creating Infinity Kitchens outlet...')
      const { data: newOutlet, error: createError } = await supabase
        .from('outlets')
        .insert({
          name: 'Infinity Kitchens',
          description: 'Serves quick bites, fast food, and popular student-centric snacks.',
          location: 'Inside N Block',
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
    
    console.log(`Infinity Kitchens outlet ID: ${outlet.id}`)
    
    // Get existing menu items
    const { data: existingItems, error: existingError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('outlet_id', outlet.id)
    
    if (existingError) {
      console.error('Error fetching existing items:', existingError)
      return
    }
    
    console.log(`Found ${existingItems?.length || 0} existing menu items`)
    
    // Create map of existing items
    const existingMap = new Map()
    existingItems?.forEach(item => {
      existingMap.set(item.name, item)
    })
    
    // Track statistics
    let updated = 0
    let added = 0
    
    // Process menu items
    for (const menuItem of infinityKitchensMenu) {
      const existing = existingMap.get(menuItem.name)
      
      if (existing) {
        // Update existing item
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
    
    // Remove outdated items
    const verifiedNames = new Set(infinityKitchensMenu.map(item => item.name))
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
      console.log(`\n=== Infinity Kitchens SUMMARY ===`)
      console.log(`Updated: ${updated}`)
      console.log(`Added: ${added}`)
      console.log(`Total items: ${finalItems?.length || 0}`)
      console.log(`Expected: ${infinityKitchensMenu.length}`)
      
      if (finalItems?.length === infinityKitchensMenu.length) {
        console.log('✓ Menu population successful!')
      } else {
        console.log('⚠ Menu count mismatch')
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

populateInfinityKitchens()

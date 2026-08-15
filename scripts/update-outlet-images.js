const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateOutletImages() {
  try {
    console.log('Starting outlet image updates...')
    
    // Update Green Nox
    const { data: greenNox, error: greenNoxError } = await supabase
      .from('outlets')
      .update({ photo_url: '/outlets/green-nox.jpg.png' })
      .eq('name', 'Green Nox')
      .select()
    
    if (greenNoxError) {
      console.error('Error updating Green Nox image:', greenNoxError)
    } else {
      console.log('✓ Green Nox image updated successfully')
    }
    
    // Update House of Chow
    const { data: houseOfChow, error: houseOfChowError } = await supabase
      .from('outlets')
      .update({ photo_url: '/outlets/house-of-chow.jpg.png' })
      .eq('name', 'House of Chow')
      .select()
    
    if (houseOfChowError) {
      console.error('Error updating House of Chow image:', houseOfChowError)
    } else {
      console.log('✓ House of Chow image updated successfully')
    }
    
    console.log('\n=== Outlet image updates complete ===')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

updateOutletImages()

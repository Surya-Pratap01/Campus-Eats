const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupStorage() {
  try {
    console.log('Setting up Supabase Storage for outlet images...')
    
    // Create storage bucket
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('outlet-images', {
      public: true
    })
    
    if (bucketError) {
      console.log('Bucket might already exist:', bucketError.message)
    } else {
      console.log('✓ Storage bucket created successfully')
    }
    
    console.log('\n=== Storage setup complete ===')
    console.log('Note: Storage policies need to be set up manually in Supabase Dashboard')
    console.log('Run the SQL in supabase/setup-storage.sql to set up the policies')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

setupStorage()

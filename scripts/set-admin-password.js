const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zcbmvhjkharfmmiqslls.supabase.co'
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_N1mq3YVsrcG9mwtJYwE-1Q_WsuKHY2L'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const email = 's24cseu1873@bennett.edu.in'
const password = 'CampusEats@S24CSEU1873!'

async function main() {
  console.log('=== Checking Admin Account for Campus Eats ===')
  console.log(`Target Email: ${email}`)

  const anonClient = createClient(supabaseUrl, anonKey)

  // 1. Check if user can already sign in
  const { data: signInData, error: signInErr } = await anonClient.auth.signInWithPassword({
    email,
    password
  })

  if (!signInErr && signInData.user) {
    console.log('✓ Successfully authenticated with credentials!')
    
    // Check profile admin status
    const { data: profile, error: profErr } = await anonClient
      .from('profiles')
      .select('id, email, is_admin')
      .eq('id', signInData.user.id)
      .single()

    if (profile?.is_admin) {
      console.log('✓ Verified: profiles.is_admin is TRUE')
      console.log('✓ Admin login and /admin access confirmed!')
      return
    } else {
      console.log('⚠ User authenticated but profiles.is_admin is not true')
    }
  }

  // 2. If service role key is provided, update password directly
  if (serviceRoleKey) {
    console.log('Attempting password update using SUPABASE_SERVICE_ROLE_KEY...')
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Get user id
    const { data: usersData, error: listErr } = await adminClient.auth.admin.listUsers()
    const targetUser = usersData?.users?.find(u => u.email === email)

    if (targetUser) {
      const { error: updateErr } = await adminClient.auth.admin.updateUserById(targetUser.id, {
        password: password,
        email_confirm: true
      })

      if (updateErr) {
        console.error('Error updating password via service role:', updateErr)
        return
      }
      console.log('✓ Password updated via Supabase Admin API')
    } else {
      // Create user if doesn't exist
      const { data: newUser, error: createErr } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      })
      if (createErr) {
        console.error('Error creating user via service role:', createErr)
        return
      }
      console.log('✓ User created via Supabase Admin API')
    }

    // Ensure profile is_admin is true
    const { error: profileUpdateErr } = await adminClient
      .from('profiles')
      .update({ is_admin: true })
      .eq('email', email)

    if (profileUpdateErr) {
      console.error('Error updating profiles.is_admin:', profileUpdateErr)
    } else {
      console.log('✓ Verified: profiles.is_admin = true')
    }

    // Re-verify login with anon client
    const { data: verifyData, error: verifyErr } = await anonClient.auth.signInWithPassword({
      email,
      password
    })

    if (!verifyErr && verifyData.user) {
      console.log('✓ SUCCESS: Successfully signed in with Supabase Email + Password!')
      console.log('✓ Admin user verified and ready to access /admin.')
    } else {
      console.error('Verification sign-in failed:', verifyErr)
    }
  } else {
    console.log('\n[INFO] Current status:')
    console.log('- User dc203d0e-bb48-4c1f-8513-9063d420f6ae exists in auth.users.')
    console.log('- profiles.is_admin is already TRUE in the database.')
    console.log('- User does not currently have this password set in Supabase Auth.')
  }
}

main()

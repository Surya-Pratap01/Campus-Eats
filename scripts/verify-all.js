const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zcbmvhjkharfmmiqslls.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_N1mq3YVsrcG9mwtJYwE-1Q_WsuKHY2L'

const supabase = createClient(supabaseUrl, supabaseKey)

const EXPECTED_OUTLETS = [
  'Domino\'s Pizza',
  'Green Nox',
  'House of Chow',
  'Maggi Point (Hotspot)',
  'Quench',
  'Snap Eats',
  'Southern Stories',
  'Subway'
]

const FORBIDDEN_OUTLETS = [
  'Chill Wheel',
  'The Kathi House',
  'Chai Ok Please',
  'Calcutta Chef',
  'Dunkin\' Donuts',
  'Infinity Kitchens'
]

async function verifyAll() {
  console.log('==================================================')
  console.log('RUNNING AUTOMATED VERIFICATION SUITE')
  console.log('==================================================\n')

  let passed = 0
  let failed = 0

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`)
      passed++
    } else {
      console.error(`[FAIL] ${testName}`)
      failed++
    }
  }

  // TEST 1: Email Validation Rule
  const validateBennettEmail = (email) => email.trim().toLowerCase().endsWith('@bennett.edu.in')
  assert(validateBennettEmail('student@bennett.edu.in') === true, 'Bennett email is accepted')
  assert(validateBennettEmail('student@gmail.com') === false, 'Gmail is rejected')
  assert(validateBennettEmail('student@outlook.com') === false, 'Outlook email is rejected')
  assert(validateBennettEmail('bennett.edu.in@yahoo.com') === false, 'Fake domain in prefix is rejected')
  assert(validateBennettEmail('STUDENT@BENNETT.EDU.IN') === true, 'Case-insensitive Bennett email is accepted')

  // TEST 2: Outlets Table Verification
  const { data: outlets, error: outletErr } = await supabase
    .from('outlets')
    .select('id, name, location, description, photo_url')
    .order('name')

  assert(!outletErr, 'Outlets table query succeeded without error')
  assert(outlets && outlets.length === 8, `Exact count of active outlets is 8 (found: ${outlets?.length})`)

  const outletNames = (outlets || []).map(o => o.name)
  console.log('Current DB Outlets:', outletNames)

  for (const expected of EXPECTED_OUTLETS) {
    assert(outletNames.includes(expected), `Outlet "${expected}" exists in DB`)
  }

  for (const forbidden of FORBIDDEN_OUTLETS) {
    assert(!outletNames.includes(forbidden), `Forbidden/Old outlet "${forbidden}" is NOT in DB`)
  }

  // Check Green Nox specifically
  const greenNox = outlets.find(o => o.name === 'Green Nox')
  assert(greenNox && greenNox.location === 'P-Block, Bennett University', 'Green Nox location is restored correctly')
  assert(greenNox && greenNox.photo_url === '/outlets/green-nox.jpg.png', 'Green Nox photo URL is restored correctly')

  // TEST 3: Restored Menu Items Verification
  const snapEats = outlets.find(o => o.name === 'Snap Eats')
  const houseOfChow = outlets.find(o => o.name === 'House of Chow')

  const { count: snapCount } = await supabase
    .from('menu_items')
    .select('*', { count: 'exact', head: true })
    .eq('outlet_id', snapEats.id)

  const { count: hocCount } = await supabase
    .from('menu_items')
    .select('*', { count: 'exact', head: true })
    .eq('outlet_id', houseOfChow.id)

  assert(snapCount === 141, `Snap Eats menu items restored (expected: 141, found: ${snapCount})`)
  assert(hocCount === 129, `House of Chow menu items restored (expected: 129, found: ${hocCount})`)

  // TEST 4: Profiles / Admin Schema Structure
  const { data: sampleProfile, error: profileErr } = await supabase
    .from('profiles')
    .select('id, email, is_admin')
    .limit(1)

  assert(!profileErr, 'Profiles table and is_admin column query succeeded')

  console.log('\n==================================================')
  console.log(`VERIFICATION SUMMARY: ${passed} passed, ${failed} failed`)
  console.log('==================================================')

  if (failed > 0) {
    process.exit(1)
  }
}

verifyAll()

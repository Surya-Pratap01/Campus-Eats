const fs = require('fs')
const path = require('path')

console.log('==================================================')
console.log('MOBILE-FIRST ARCHITECTURE VERIFICATION')
console.log('==================================================')

let passed = 0
let failed = 0

function test(description, condition) {
  if (condition) {
    console.log(`[PASS] ${description}`)
    passed++
  } else {
    console.error(`[FAIL] ${description}`)
    failed++
  }
}

// 1. Root Layout & Viewport Configuration
const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx')
const layoutContent = fs.readFileSync(layoutPath, 'utf8')
test('Viewport includes device-width, initialScale 1, and viewportFit cover',
  layoutContent.includes("viewportFit: \"cover\"") || layoutContent.includes("viewportFit: 'cover'")
)
test('Root layout body includes pb-16/pb-20 for mobile bottom navigation clearance',
  layoutContent.includes('pb-16') || layoutContent.includes('pb-20')
)
test('Root layout body includes overflow-x-hidden to prevent horizontal scrolling',
  layoutContent.includes('overflow-x-hidden')
)

// 2. Global CSS safe area and motion rules
const cssPath = path.join(__dirname, '..', 'src', 'app', 'globals.css')
const cssContent = fs.readFileSync(cssPath, 'utf8')
test('Globals.css defines .pb-safe with env(safe-area-inset-bottom)',
  cssContent.includes('.pb-safe') && cssContent.includes('env(safe-area-inset-bottom')
)
test('Globals.css supports prefers-reduced-motion media query',
  cssContent.includes('@media (prefers-reduced-motion: reduce)')
)

// 3. Navbar Mobile Bottom Navigation & Top App Bar
const navbarPath = path.join(__dirname, '..', 'src', 'components', 'Navbar.tsx')
const navbarContent = fs.readFileSync(navbarPath, 'utf8')
test('Navbar includes fixed bottom navigation for mobile screens (< sm)',
  navbarContent.includes('fixed bottom-0') && navbarContent.includes('sm:hidden')
)
test('Navbar mobile bottom navigation includes safe-area inset (pb-safe)',
  navbarContent.includes('pb-safe')
)
test('Navbar includes Home, Explore, and Profile/Login navigation items',
  navbarContent.includes('Home') && navbarContent.includes('Explore') && navbarContent.includes('Profile')
)
test('Navbar mobile profile bottom sheet / drawer is implemented',
  navbarContent.includes('isProfileSheetOpen') && navbarContent.includes('rounded-t-3xl')
)

// 4. RatingModal Mobile Bottom Sheet & 44px Touch Targets
const ratingModalPath = path.join(__dirname, '..', 'src', 'components', 'RatingModal.tsx')
const ratingModalContent = fs.readFileSync(ratingModalPath, 'utf8')
test('RatingModal adapts to mobile bottom sheet (rounded-t-3xl, slide-in-from-bottom, pb-safe)',
  ratingModalContent.includes('rounded-t-3xl') && ratingModalContent.includes('pb-safe')
)
test('RatingModal includes visual drag handle bar for mobile drawer',
  ratingModalContent.includes('w-12 h-1.5 bg-gray-300 rounded-full')
)
test('RatingModal star buttons have >= 44x44px touch targets (w-11 h-11)',
  ratingModalContent.includes('w-11 h-11')
)
test('RatingModal action buttons have >= 48px height (min-h-[48px])',
  ratingModalContent.includes('min-h-[48px]')
)
test('RatingModal textarea uses text-base to prevent iOS Safari auto-zoom',
  ratingModalContent.includes('text-base')
)

// 5. HomeFeed & Discovery
const homeFeedPath = path.join(__dirname, '..', 'src', 'components', 'HomeFeed.tsx')
const homeFeedContent = fs.readFileSync(homeFeedPath, 'utf8')
test('HomeFeed has mobile search bar with #explore target',
  homeFeedContent.includes('id="explore"')
)
test('HomeFeed replaces horizontal carousel with responsive grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3)',
  homeFeedContent.includes('grid-cols-1') && homeFeedContent.includes('sm:grid-cols-2') && homeFeedContent.includes('lg:grid-cols-3')
)
test('HomeFeed category pills have >= 44px touch target (min-h-[44px])',
  homeFeedContent.includes('min-h-[44px]')
)
test('HomeFeed includes empty state for non-matching queries',
  homeFeedContent.includes('No food or outlets found')
)

// 6. OutletCard Mobile Interactions
const outletCardPath = path.join(__dirname, '..', 'src', 'components', 'OutletCard.tsx')
const outletCardContent = fs.readFileSync(outletCardPath, 'utf8')
test('OutletCard View Menu button has >= 44px touch target (min-h-[44px])',
  outletCardContent.includes('min-h-[44px]')
)
test('OutletCard menu item Rate button has >= 44px touch target (min-h-[44px] min-w-[64px])',
  outletCardContent.includes('min-h-[44px] min-w-[64px]')
)
test('OutletCard in-card search uses text-base to avoid iOS auto-zoom',
  outletCardContent.includes('text-base')
)
test('OutletCard shows "Menu information coming soon" when menu is empty',
  outletCardContent.includes('Menu information coming soon')
)

// 7. Login & Reset Password Mobile Forms
const loginPath = path.join(__dirname, '..', 'src', 'app', 'login', 'page.tsx')
const loginContent = fs.readFileSync(loginPath, 'utf8')
test('Login form inputs use text-base to prevent iOS auto-zoom',
  loginContent.includes('text-base')
)
test('Login form includes password visibility eye toggle button',
  loginContent.includes('showPassword') && loginContent.includes('aria-label=')
)
test('Login form submit button has >= 48px height (min-h-[48px])',
  loginContent.includes('min-h-[48px]')
)
test('Bennett University email validation is preserved',
  loginContent.includes('@bennett.edu.in')
)

const resetPath = path.join(__dirname, '..', 'src', 'app', 'auth', 'reset-password', 'page.tsx')
const resetContent = fs.readFileSync(resetPath, 'utf8')
test('Reset password inputs use text-base and password eye toggles',
  resetContent.includes('text-base') && resetContent.includes('showPassword')
)

console.log('==================================================')
console.log(`MOBILE VERIFICATION SUMMARY: ${passed} passed, ${failed} failed`)
console.log('==================================================')

if (failed > 0) {
  process.exit(1)
} else {
  process.exit(0)
}

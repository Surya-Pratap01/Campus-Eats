# Mobile-First Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Campus Eats into a truly mobile-first application optimized for 360px–414px smartphone screens with bottom navigation, mobile bottom sheet rating modal, mobile search & discovery feed, generous touch targets (≥44px), `prefers-reduced-motion` compliance, and seamless tablet/desktop responsiveness.

**Architecture:** Next.js 16 (App Router) + Tailwind CSS v4 + Supabase SSR. Mobile navigation with top header + bottom navigation bar. Responsive bottom sheet rating drawer on mobile adapting to modal dialog on `sm:` breakpoints. Mobile search & category filter feed on Home.

## Global Constraints
- Target mobile viewports: 360px, 375px, 390px, 414px (and responsive up to 768px, 1024px, 1280px+).
- Zero accidental horizontal scrolling (`overflow-x-hidden`).
- Primary interactive elements must have minimum 44x44px touch targets.
- Input font sizes must be at least 16px (`text-base`) to avoid iOS Safari zoom-in behavior.
- Support `prefers-reduced-motion` for all transitions and animations.
- Active outlets must be: Maggi Point (Hotspot), Quench, Green Nox, Southern Stories, Snap Eats, Domino's Pizza, Subway, House of Chow. Chill Wheel must NOT be added.
- Green Nox must NOT have fabricated menu items ("Menu information coming soon").
- Preserve authentication architecture (Bennett email restriction `@bennett.edu.in`) and rating philosophy (Taste, Quantity, Value for Money, Hygiene).

---

### Task 1: Navigation & Layout (Top Bar & Bottom Navigation)

**Files:**
- Modify: `campus-eats/src/components/Navbar.tsx`
- Modify: `campus-eats/src/app/layout.tsx`

- [ ] **Step 1: Update Root Layout for Mobile Viewport and Bottom Navigation Spacing**
  Ensure safe area support (`viewport-fit=cover`, padding-bottom compensation for mobile bottom nav, `min-h-screen`, `overflow-x-hidden`).
- [ ] **Step 2: Redesign Navigation for Mobile + Desktop**
  In `Navbar.tsx`:
  - Clean top app bar: `[ 🍽️ CampusEats ]` + Profile/Logout/Admin action.
  - Mobile bottom navigation bar (fixed bottom on mobile `< sm:`):
    - `Home` (Outlets & Discovery)
    - `Explore` (Menu search & categories)
    - `Admin` (if admin) / `Profile` (user email & logout sheet)
  - Desktop view (`sm:` and up): keeps standard sticky top navigation.
  - All touch targets ≥ 44x44px with active states and safe area insets (`pb-safe`).

---

### Task 2: Mobile-First Rating Modal / Bottom Sheet

**Files:**
- Modify: `campus-eats/src/components/RatingModal.tsx`

- [ ] **Step 1: Transform Modal to Mobile Bottom Sheet / Desktop Centered Dialog**
  - Mobile (`< sm:`): slides up from bottom (`fixed inset-x-0 bottom-0 max-h-[90vh] rounded-t-3xl`), with a pull handle visual indicator, padding for safe area (`pb-safe`), and scrollable content.
  - Desktop (`sm:`): centered modal dialog (`sm:max-w-lg sm:rounded-2xl sm:relative sm:bottom-auto`).
- [ ] **Step 2: Upgrade Touch Targets to ≥44x44px**
  - Upgrade star rating buttons: `w-11 h-11 flex items-center justify-center text-3xl` with touch-friendly spacing.
  - Close button and action buttons (Submit, Cancel, Delete): minimum 44px height and accessible hit areas.
- [ ] **Step 3: Add Smooth Motion with Reduced-Motion Support**
  - Smooth slide-up transition with `motion-reduce:animate-none`.

---

### Task 3: Mobile-First Home Page (Feed, Instant Search, & Discovery)

**Files:**
- Modify: `campus-eats/src/app/page.tsx`
- Create: `campus-eats/src/components/HomeFeed.tsx`

- [ ] **Step 1: Create Interactive Client Component `HomeFeed.tsx`**
  - Prominent mobile search input at the top (Search outlets or food items) with clear button.
  - Category pill filter scrollbar (All, Beverages, Snacks, Meals, Dimsums, etc.).
  - Vertical mobile feed (replacing horizontal scroll carousel) displaying outlets with clean spacing.
  - Responsive layout: 1 column on mobile, 2 columns on tablet (`sm:`), 3 columns on desktop (`lg:`).
  - Empty search state: "No food or outlets found."
- [ ] **Step 2: Update `src/app/page.tsx`**
  - Pass server-fetched outlets and verified menu items to `HomeFeed`.

---

### Task 4: Mobile-First Outlet Cards & Menu Interactions

**Files:**
- Modify: `campus-eats/src/components/OutletCard.tsx`
- Modify: `campus-eats/src/app/outlets/[id]/page.tsx`

- [ ] **Step 1: Redesign `OutletCard.tsx` for Mobile Touch Interaction**
  - Card header: full-width image with proper aspect ratio, badges for rating and item count.
  - Clear metadata (location, description with 2-line clamp).
  - Tap target for "View Menu" with at least 44px height.
  - Menu list: large readable food names, clear price, category tags, and 44px tap target "Rate" button.
  - Empty menu: clean "Menu information coming soon" card.
- [ ] **Step 2: Optimize `/outlets/[id]/page.tsx` for Mobile Screens**
  - Header with back button (≥44px tap target), outlet info, category sticky subheader, and thumb-friendly menu items.

---

### Task 5: Mobile Forms Optimization (Login, Signup, Forgot, Reset)

**Files:**
- Modify: `campus-eats/src/app/login/page.tsx`
- Modify: `campus-eats/src/app/auth/reset-password/page.tsx`

- [ ] **Step 1: Optimize Form Inputs for Mobile Keyboards**
  - Set input font sizes to 16px (`text-base`) to prevent iOS Safari auto-zoom.
  - Add password visibility toggle with ≥44px hit target.
  - Ensure generous spacing, min-48px touch buttons, and keyboard accessibility.
  - Maintain `@bennett.edu.in` domain restriction.

---

### Task 6: Testing, Build & Responsive Verification

**Files:**
- Run: `npm run build`
- Run: `npm run lint`
- Test: Responsive viewports (360px, 375px, 390px, 414px, 768px, 1280px)

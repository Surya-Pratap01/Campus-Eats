# Campus Eats Development Restart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace magic-link authentication with Supabase email + password authentication (with Bennett email restriction), replace jump-to-bottom rating interaction with an in-place rating modal dialog, update Bennett food outlets to the confirmed 7 outlets, and empty unverified menus with clean placeholder states.

**Architecture:** Next.js 16 (App Router) + Supabase Auth / SSR + Tailwind CSS v4. Authenticated session cookies managed via Supabase SSR middleware. Client-side modal dialog for rating menu items with state restoration and no scroll jumps. Supabase PostgreSQL `outlets`, `menu_items`, `ratings`, and `profiles` tables.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, Tailwind CSS v4, `@supabase/ssr`, `@supabase/supabase-js`, Lucide React.

## Global Constraints
- Do NOT redesign the entire application.
- Do NOT change the existing visual identity unnecessarily (preserve orange/yellow warm theme, rounded styling, typography).
- Do NOT introduce fake data, fake reviews, fake ratings, fake prices, or fake menu items.
- Only allow registration with Bennett University emails ending in `@bennett.edu.in`.
- Show validation message: "Please use your Bennett University email address."
- Outlets must be EXACTLY: `Maggi Point (Hotspot)`, `Quench`, `Southern Stories`, `Snap Eats`, `Domino's Pizza`, `Subway`, `House of Chow`.
- DO NOT add `Chill Wheel` or other old unrequested outlets.
- Empty menu state must display clean text: "Menu information coming soon."
- Ratings empty state must display: "No ratings yet".
- Preserve admin role system and protected routes.

---

### Task 1: Supabase Email + Password Authentication & Middleware Setup

**Files:**
- Modify: `campus-eats/src/lib/supabase/middleware.ts`
- Modify: `campus-eats/src/app/login/page.tsx`
- Create: `campus-eats/src/app/auth/reset-password/page.tsx`
- Modify: `campus-eats/src/app/auth/callback/route.ts`
- Modify: `campus-eats/src/app/auth/auth-code-error/page.tsx`

**Interfaces:**
- Consumes: `createClient()` from `@/lib/supabase/client` and `@/lib/supabase/server`
- Produces: Persistent email/password auth sessions, signup, login, forgot password, and reset password flows

- [ ] **Step 1: Update middleware for public routes and session handling**
  In `campus-eats/src/lib/supabase/middleware.ts`, include `/auth/reset-password` in `publicRoutes` so password reset links work seamlessly. Ensure authenticated users on `/login` are redirected to `/`, but not if they are accessing `/auth/reset-password`.
- [ ] **Step 2: Update auth callback route to handle password reset and auth code exchanges**
  In `campus-eats/src/app/auth/callback/route.ts`, exchange auth codes for sessions and redirect to `next` (e.g. `/auth/reset-password` or `/`). Remove obsolete magic link error queries.
- [ ] **Step 3: Update `auth-code-error` page**
  In `campus-eats/src/app/auth/auth-code-error/page.tsx`, remove obsolete magic link references and provide a clean message with a button to return to `/login`.
- [ ] **Step 4: Implement `src/app/auth/reset-password/page.tsx`**
  Build password reset form allowing the user to enter their new password and confirmation, calling `supabase.auth.updateUser({ password })`.
- [ ] **Step 5: Replace magic link in `src/app/login/page.tsx` with Email + Password authentication**
  Build:
  - Toggle between "Login" and "Create Account".
  - Login tab: Bennett Email (`@bennett.edu.in`), Password, Login button, Forgot Password link.
  - Create Account tab: Explanatory note ("Use your Bennett email and set a separate Campus Eats password"), Bennett Email, Password, Confirm Password, Create Account button.
  - Forgot Password view: Bennett Email, Send Reset Link button, Back to Login button.
  - Domain validation: strictly require email to end with `@bennett.edu.in`. If not, show "Please use your Bennett University email address."
  - Password validation: min 6 characters, passwords match on signup.
  - Call `supabase.auth.signInWithPassword` on login.
  - Call `supabase.auth.signUp` on account creation.
  - Call `supabase.auth.resetPasswordForEmail` on forgot password.

---

### Task 2: Rating UX — Modal Dialog & Scroll Jump Removal

**Files:**
- Create: `campus-eats/src/components/RatingModal.tsx`
- Modify: `campus-eats/src/components/RatingForm.tsx`
- Modify: `campus-eats/src/components/OutletCard.tsx`
- Modify: `campus-eats/src/app/outlets/[id]/page.tsx`

**Interfaces:**
- Consumes: Supabase `ratings` table (`menu_item_id`, `student_id`, `taste`, `hygiene`, `quantity`, `value_for_money`, `comment`)
- Produces: Modal dialog rating component that does not jump or scroll the window, and refreshes rating data on submit.

- [ ] **Step 1: Create `RatingModal.tsx`**
  Build a modal dialog component that overlays the screen:
  - Shows item name, category, and price if available.
  - Implements the Campus Eats rating philosophy: Taste (1-5), Quantity (1-5), Value for Money (1-5), Hygiene (1-5), and an optional written review / comment.
  - On submit: saves via Supabase, triggers callback to update local state, and closes modal without scrolling the window.
  - Supports closing via Escape key, close button, or clicking outside the modal backdrop.
  - Locks background body scroll while modal is active and restores it on close.
- [ ] **Step 2: Update `RatingForm.tsx`**
  Refactor `RatingForm.tsx` to handle submission and optional cancel/close cleanly, returning proper status messages.
- [ ] **Step 3: Remove automatic scroll-to-bottom in `OutletCard.tsx` and integrate `RatingModal`**
  Remove `reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' })` and remove the bottom-expanded review section from the card.
  Instead, when an item or "Rate" action is clicked, open `RatingModal`.
  When modal closes or submits, user remains at the exact same scroll position on the menu.
- [ ] **Step 4: Update `src/app/outlets/[id]/page.tsx`**
  Ensure empty state shows "Menu information coming soon." instead of "No menu items yet".

---

### Task 3: Bennett Food Outlets & Menu Database Synchronization

**Files:**
- Create: `campus-eats/scripts/sync-outlets-and-menus.js`
- Modify: Supabase PostgreSQL database via script

**Interfaces:**
- Consumes: `outlets` and `menu_items` tables via Supabase JS client
- Produces: Exactly 7 confirmed outlets, zero fabricated menu items

- [ ] **Step 1: Write and run database synchronization script**
  The script will:
  1. Ensure the 7 confirmed outlets exist with exact names:
     - `Maggi Point (Hotspot)`
     - `Quench`
     - `Southern Stories`
     - `Snap Eats` (renaming or replacing `SnapEats`)
     - `Domino's Pizza`
     - `Subway`
     - `House of Chow`
  2. Delete old unconfirmed outlets (`Green Nox`, `Infinity Kitchens`, or any other).
  3. Ensure `Chill Wheel` is NOT present.
  4. Clear unverified menu items for all outlets so menus remain empty until reliable verified menus are obtained.
  5. Preserve existing profile and user role data.
- [ ] **Step 2: Verify database state**
  Query `outlets` and `menu_items` to confirm exactly 7 outlets and 0 unverified menu items.

---

### Task 4: UI Refinement for Empty States & Consistency

**Files:**
- Modify: `campus-eats/src/components/OutletCard.tsx`
- Modify: `campus-eats/src/app/page.tsx`
- Modify: `campus-eats/src/app/outlets/[id]/page.tsx`

**Interfaces:**
- Consumes: Outlet data and empty menu items array
- Produces: Polished "Menu information coming soon." and "No ratings yet" displays without fake cards.

- [ ] **Step 1: Refine `OutletCard.tsx` empty menu state**
  When menu is opened and items are empty, show: "Menu information coming soon."
  When average rating is null, show: "No ratings yet".
- [ ] **Step 2: Refine `src/app/page.tsx` and `src/app/outlets/[id]/page.tsx` empty menu states**
  Ensure polished UI when menus are empty.
- [ ] **Step 3: Build & Lint check**
  Run `npm run build` and `npm run lint` in `campus-eats` to verify there are no TypeScript, ESLint, or Next.js build errors.

---

### Task 5: End-to-End Verification

- [ ] **Step 1: Test authentication logic**
  Verify non-Bennett email rejection, Bennett email acceptance, password validation, login, and forgot password.
- [ ] **Step 2: Test rating modal**
  Verify opening rating modal, rating dimensions, submit, close, and position retention without scroll jumping.
- [ ] **Step 3: Test outlet display**
  Confirm the 7 active outlets are present, Chill Wheel is absent, and empty menu states are shown cleanly.

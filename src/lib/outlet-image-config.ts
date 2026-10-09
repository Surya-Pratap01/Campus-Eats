import type React from 'react'

/**
 * Outlet Image Positioning Configuration
 *
 * Provides selective, outlet-specific object-position styles to ensure each
 * outlet's storefront signage, kiosk counter, and primary visual identity
 * are framed properly in both horizontal card viewports (OutletCard) and
 * detail page hero banners.
 *
 * Defaults to 'center' for standard images to prevent regressions.
 */

export interface OutletImagePositionConfig {
  card: string
  detail: string
}

export const OUTLET_IMAGE_CONFIGS: Record<string, OutletImagePositionConfig> = {
  // Domino's Pizza: 16:9 storefront, evenly balanced at center
  'dominos': { card: 'center', detail: 'center' },

  // Green Nox: Bold 3D "GreeNox" signage is at the top of the photo
  'green-nox': { card: 'center 20%', detail: 'center 25%' },

  // House of Chow: Circular "HOC" logo and colourful tiled wall are vertically centered
  'house-of-chow': { card: 'center', detail: 'center' },

  // Maggi Point (Hotspot): Kiosk and illuminated Nescafe/Maggi signs are in the lower half;
  // default center or center 30% cuts off the service counter and displays only dark sky.
  'hotspot': { card: 'center 62%', detail: 'center 60%' },

  // Monginis: Portrait photo with exposed ceiling pipes at the top.
  // Requires upper focus (center 28%) to highlight the glowing "monginis CAKE SHOP" sign
  // and pastry showcase while cutting out overhead industrial pipes.
  'monginis': { card: 'center 28%', detail: 'center 30%' },

  // Quench: Butterfly neon logo and signage are in upper-middle area
  'quench': { card: 'center 38%', detail: 'center 40%' },

  // Snap Eats: Glowing sign and bright yellow menu board are centered in the lower-middle section;
  // center 30% cuts off the menu and counter in favor of night sky.
  'snap-eats': { card: 'center 55%', detail: 'center 55%' },

  // Southern Stories: Glowing canopy sign and lighted counters are in the lower-middle section;
  // center 30% cuts off the counters in favor of dark upper hostel windows.
  'southern-stories': { card: 'center 60%', detail: 'center 60%' },

  // Subway: "SUBWAY" signage and green balloon arch entrance
  'subway': { card: 'center 32%', detail: 'center 30%' },
}

export function normalizeOutletKey(
  outlet?: { name?: string | null; photo_url?: string | null } | string | null
): string {
  if (!outlet) return ''
  const str = typeof outlet === 'string'
    ? outlet
    : (outlet.photo_url || outlet.name || '')

  const lower = str.toLowerCase()
  if (lower.includes('domino')) return 'dominos'
  if (lower.includes('green-nox') || lower.includes('green nox')) return 'green-nox'
  if (lower.includes('house-of-chow') || lower.includes('chow')) return 'house-of-chow'
  if (lower.includes('hotspot') || lower.includes('maggi')) return 'hotspot'
  if (lower.includes('monginis')) return 'monginis'
  if (lower.includes('quench')) return 'quench'
  if (lower.includes('snap-eats') || lower.includes('snapeats') || lower.includes('snap eats')) return 'snap-eats'
  if (lower.includes('southern-stories') || lower.includes('southern')) return 'southern-stories'
  if (lower.includes('subway')) return 'subway'
  return ''
}

export function getOutletImageStyle(
  outlet?: { name?: string | null; photo_url?: string | null } | string | null,
  context: 'card' | 'detail' = 'card'
): React.CSSProperties {
  const key = normalizeOutletKey(outlet)
  const config = OUTLET_IMAGE_CONFIGS[key]

  const position = config ? config[context] : 'center'

  return {
    objectPosition: position,
  }
}

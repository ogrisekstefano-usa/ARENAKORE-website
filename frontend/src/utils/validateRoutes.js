/**
 * ARENAKORE — Route Validation Utility
 * Logs errors for broken/duplicate links at app startup (dev mode only).
 */
import { ROUTES, NAV_ITEMS } from '../config/routes';

const VALID_ROUTES = new Set(Object.values(ROUTES));

/**
 * Validate that a path exists in ROUTES config.
 * @param {string} path - the path to check
 * @param {string} context - where this link was found (for debug)
 */
export function validateRoute(path, context = '') {
  if (process.env.NODE_ENV !== 'production') {
    if (!VALID_ROUTES.has(path) && !path.startsWith('/blog/') && path !== '/admin' && path !== '/admin/*') {
      console.warn(`[ROUTES] Unknown path "${path}"${context ? ` in ${context}` : ''}. Add to config/routes.js`);
    }
  }
}

/**
 * Run full validation on startup.
 * Checks for duplicate nav labels, missing routes.
 */
export function validateNavigation() {
  if (process.env.NODE_ENV !== 'production') {
    const labels = NAV_ITEMS.map(n => n.key);
    const dupes = labels.filter((l, i) => labels.indexOf(l) !== i);
    if (dupes.length) {
      console.error('[ROUTES] Duplicate nav keys found:', dupes);
    }

    NAV_ITEMS.forEach(item => {
      if (!VALID_ROUTES.has(item.route)) {
        console.error(`[ROUTES] Nav item "${item.key}" points to unknown route: ${item.route}`);
      }
    });

    console.info(`[ROUTES] Validated ${NAV_ITEMS.length} nav items, ${Object.keys(ROUTES).length} routes. ✓`);
  }
}

/**
 * Simple hash-based router for LuYi SPA.
 * Routes: #/ (home), #/pathway, #/h1b, #/o1-assess, #/o1-builder,
 *         #/eb-compare, #/backlog, #/timeline, #/employer, #/red-flags
 */

export const routes = new Map<string, () => void>();

/**
 * Navigate to a route by setting the hash and invoking the handler.
 */
export function navigate(path: string): void {
  window.location.hash = path;
}

/**
 * Parse the current hash and return the route path.
 * Defaults to '/' if no hash is set.
 */
export function getCurrentRoute(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

/**
 * Invoke the handler for the current route.
 */
function handleRoute(): void {
  const route = getCurrentRoute();
  const handler = routes.get(route);
  if (handler) {
    handler();
  } else {
    // Fallback to home if route not found
    const homeHandler = routes.get('/');
    if (homeHandler) {
      homeHandler();
    }
  }
}

/**
 * Initialize the router: listen for hashchange events
 * and handle the initial route on page load.
 */
export function initRouter(): void {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

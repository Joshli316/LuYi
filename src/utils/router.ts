/**
 * History API router for LuYi SPA.
 * Routes: / (home), /pathway, /h1b, /o1-assess, /o1-builder,
 *         /eb-compare, /backlog, /timeline, /employer, /red-flags
 */

import { tl } from '../i18n';

export const routes = new Map<string, () => void>();
export let notFoundHandler: (() => void) | null = null;
export function setNotFoundHandler(handler: () => void): void {
  notFoundHandler = handler;
}

/**
 * Navigate to a route using pushState.
 */
export function navigate(path: string): void {
  window.history.pushState(null, '', path);
  handleRoute();
}

/**
 * Return the current pathname as the route path.
 * Defaults to '/' if empty.
 */
export function getCurrentRoute(): string {
  return window.location.pathname || '/';
}

/**
 * Invoke the handler for the current route.
 */
function handleRoute(): void {
  const route = getCurrentRoute();
  const handler = routes.get(route);
  if (handler) {
    try {
      handler();
    } catch (e) {
      console.error('Route render error:', e);
      const content = document.getElementById('content');
      if (content) {
        content.innerHTML = `<div style="padding:60px 20px;text-align:center;max-width:640px;margin:0 auto"><h2 style="font-size:24px;font-weight:700;margin-bottom:12px">${tl({ en: 'Something went wrong', zh: '出错了' })}</h2><p style="color:var(--text-secondary);margin-bottom:24px">${tl({ en: 'An error occurred loading this page.', zh: '加载页面时出现错误。' })}</p><a href="/" class="btn-primary" style="text-decoration:none">${tl({ en: 'Back to Home', zh: '返回首页' })}</a></div>`;
      }
    }
    // Move focus to content for screen reader users
    const main = document.getElementById('content');
    if (main) { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }); }
  } else if (notFoundHandler) {
    notFoundHandler();
  } else {
    const homeHandler = routes.get('/');
    if (homeHandler) {
      homeHandler();
    }
  }
}

/**
 * Initialize the router: listen for popstate events
 * and handle the initial route on page load.
 * Also intercept link clicks for SPA navigation.
 */
export function initRouter(): void {
  window.addEventListener('popstate', handleRoute);

  // Intercept internal link clicks for SPA navigation
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;
    const href = target.getAttribute('href');
    if (!href) return;
    // Only intercept internal paths (starting with /)
    if (href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      if (href !== getCurrentRoute()) {
        navigate(href);
      } else {
        handleRoute(); // re-render same route
      }
    }
  });

  handleRoute();
}

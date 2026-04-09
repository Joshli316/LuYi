/**
 * LuYi 路易 — Main entry point.
 * Wires the router, i18n, dark mode, and tool modules together.
 */

import { routes, navigate, getCurrentRoute, initRouter, setNotFoundHandler } from './utils/router';
import { saveState, loadState } from './utils/storage';
import { currentLang, setLang, t, tl } from './i18n';
import { activateIcons } from './utils/ui';

// Tool render functions
import { renderPathway } from './tools/pathway';
import { renderH1B } from './tools/h1b';
import { renderO1Assess } from './tools/o1-assess';
import { renderO1Builder } from './tools/o1-builder';
import { renderEBCompare } from './tools/eb-compare';
import { renderBacklog } from './tools/backlog';
import { renderTimeline } from './tools/timeline';
import { renderEmployer } from './tools/employer';
import { renderRedFlags } from './tools/red-flags';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ToolCard {
  icon: string;
  nameKey: string;
  descKey: string;
  route: string;
}

// ---------------------------------------------------------------------------
// Cleanup for media query listeners
// ---------------------------------------------------------------------------

let gridAbortController: AbortController | null = null;

// ---------------------------------------------------------------------------
// Tool card definitions
// ---------------------------------------------------------------------------

const toolCards: ToolCard[] = [
  { icon: 'compass', nameKey: 'tool.pathway', descKey: 'tool.pathway.desc', route: '/pathway' },
  { icon: 'dice-3', nameKey: 'tool.h1b', descKey: 'tool.h1b.desc', route: '/h1b' },
  { icon: 'award', nameKey: 'tool.o1Assess', descKey: 'tool.o1Assess.desc', route: '/o1-assess' },
  { icon: 'clipboard-check', nameKey: 'tool.o1Builder', descKey: 'tool.o1Builder.desc', route: '/o1-builder' },
  { icon: 'columns-3', nameKey: 'tool.ebCompare', descKey: 'tool.ebCompare.desc', route: '/eb-compare' },
  { icon: 'clock', nameKey: 'tool.backlog', descKey: 'tool.backlog.desc', route: '/backlog' },
  { icon: 'calendar-range', nameKey: 'tool.timeline', descKey: 'tool.timeline.desc', route: '/timeline' },
  { icon: 'building-2', nameKey: 'tool.employer', descKey: 'tool.employer.desc', route: '/employer' },
  { icon: 'shield-alert', nameKey: 'tool.redFlags', descKey: 'tool.redFlags.desc', route: '/red-flags' },
];

// ---------------------------------------------------------------------------
// Dark mode
// ---------------------------------------------------------------------------

function initDarkMode(): void {
  const saved = loadState<boolean>('darkMode');
  if (saved !== null) {
    document.documentElement.classList.toggle('dark', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  }
}

function toggleDarkMode(): void {
  const isDark = document.documentElement.classList.toggle('dark');
  saveState('darkMode', isDark);
  updateDarkModeIcon();
}

function updateDarkModeIcon(): void {
  const btn = document.getElementById('dark-mode-btn');
  if (!btn) return;
  const isDark = document.documentElement.classList.contains('dark');
  btn.innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}" style="width: 20px; height: 20px;"></i>`;
  btn.setAttribute('aria-label', t('darkMode.toggle'));
  activateIcons();
}

// ---------------------------------------------------------------------------
// Language toggle
// ---------------------------------------------------------------------------

function toggleLanguage(): void {
  const next = currentLang() === 'en' ? 'zh' : 'en';
  setLang(next as 'en' | 'zh');
  renderShell();
  // Re-run current route to refresh content
  const route = getCurrentRoute();
  const handler = routes.get(route);
  if (handler) handler();
}

// ---------------------------------------------------------------------------
// App shell rendering
// ---------------------------------------------------------------------------

function renderShell(): void {
  const app = document.getElementById('app');
  if (!app) return;

  const langLabel = currentLang() === 'en' ? t('app.langToggle.en') : t('app.langToggle.zh');

  app.innerHTML = `
    <a href="#content" class="skip-link" style="
      position: absolute; left: -9999px; top: auto; width: 1px; height: 1px; overflow: hidden;
      z-index: 100; background: var(--primary); color: white; padding: 12px 24px;
      border-radius: 0 0 8px 0; font-weight: 600;
    " onfocus="this.style.cssText='position:fixed;left:0;top:0;z-index:100;background:var(--primary);color:white;padding:12px 24px;border-radius:0 0 8px 0;font-weight:600;'"
       onblur="this.style.cssText='position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;'"
    >${tl({ en: 'Skip to content', zh: '跳转到内容' })}</a>
    <!-- Header -->
    <header style="
      position: sticky; top: 0; z-index: 50;
      background: var(--surface); border-bottom: 1px solid var(--border);
      padding: 12px 20px;
      display: flex; align-items: center; justify-content: space-between;
    ">
      <a href="/" id="logo-link" style="
        display: flex; align-items: center; gap: 8px;
        text-decoration: none; color: var(--text);
      ">
        <i data-lucide="compass" style="width: 28px; height: 28px; color: var(--primary);"></i>
        <span style="font-size: 20px; font-weight: 700;">
          <span style="color: var(--primary);">路易</span> LuYi
        </span>
      </a>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button id="lang-toggle-btn" aria-label="Toggle language" style="
          background: var(--primary-light); color: var(--primary-dark);
          border: none; border-radius: 9999px;
          padding: 10px 16px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: opacity 200ms ease;
          min-height: 44px;
        ">${langLabel}</button>
        <button id="dark-mode-btn" aria-label="${t('darkMode.toggle')}" style="
          background: transparent; border: 1px solid var(--border);
          border-radius: 9999px; width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text-secondary);
          transition: border-color 200ms ease;
        ">
          <i data-lucide="${document.documentElement.classList.contains('dark') ? 'sun' : 'moon'}" style="width: 20px; height: 20px;"></i>
        </button>
      </div>
    </header>

    <!-- Main content area -->
    <main id="content"></main>

    <!-- Mobile bottom nav -->
    <nav class="tool-nav" aria-label="Tool navigation">
      <a href="/pathway" data-route="/pathway">
        <i data-lucide="compass" style="width: 20px; height: 20px;"></i>
        <span>${t('nav.pathway')}</span>
      </a>
      <a href="/h1b" data-route="/h1b">
        <i data-lucide="dice-3" style="width: 20px; height: 20px;"></i>
        <span>${t('nav.h1b')}</span>
      </a>
      <a href="/o1-assess" data-route="/o1-assess">
        <i data-lucide="award" style="width: 20px; height: 20px;"></i>
        <span>${t('nav.o1')}</span>
      </a>
      <a href="/timeline" data-route="/timeline">
        <i data-lucide="calendar-range" style="width: 20px; height: 20px;"></i>
        <span>${t('nav.timeline')}</span>
      </a>
      <a href="/red-flags" data-route="/red-flags">
        <i data-lucide="shield-alert" style="width: 20px; height: 20px;"></i>
        <span>${t('nav.redFlags')}</span>
      </a>
    </nav>
  `;

  // Bind header button events
  document.getElementById('lang-toggle-btn')?.addEventListener('click', toggleLanguage);
  document.getElementById('dark-mode-btn')?.addEventListener('click', toggleDarkMode);

  // Activate Lucide icons in shell
  activateIcons();
}

// ---------------------------------------------------------------------------
// Home screen
// ---------------------------------------------------------------------------

function renderHome(): void {
  const content = document.getElementById('content');
  if (!content) return;

  const cardsHtml = toolCards.map((card, i) => {
    const isFeatured = i === 0;
    const isLast = i === toolCards.length - 1;
    return `
    <a href="${card.route}" class="card card-hover${isLast ? ' last-card' : ''}" style="
      display: flex; flex-direction: column; gap: 12px;
      text-decoration: none; color: inherit; cursor: pointer;
      ${isFeatured ? 'grid-column: span 2; background: linear-gradient(135deg, var(--primary-light) 0%, var(--surface) 100%); border: 2px solid var(--primary); padding: 28px;' : ''}
    ">
      <i data-lucide="${card.icon}" style="width: ${isFeatured ? '40' : '32'}px; height: ${isFeatured ? '40' : '32'}px; color: var(--primary);"></i>
      <h3 style="font-size: ${isFeatured ? '22' : '18'}px; font-weight: ${isFeatured ? '700' : '600'}; margin: 0;">${t(card.nameKey)}</h3>
      <p style="font-size: ${isFeatured ? '16' : '14'}px; color: var(--text-secondary); margin: 0;">${t(card.descKey)}</p>
      ${isFeatured ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:14px;font-weight:600;color:var(--primary);margin-top:4px;">${t('home.startHere')} <i data-lucide="arrow-right" style="width:16px;height:16px;"></i></span>` : ''}
    </a>`;
  }).join('');

  content.innerHTML = `
    <div class="fade-in">
      <!-- Hero -->
      <section style="text-align: center; padding: 48px 20px 32px; position: relative; overflow: hidden;">
        <svg style="position:absolute;top:-20px;right:-40px;width:200px;height:200px;opacity:0.08;pointer-events:none;" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="var(--primary)" stroke-width="2" stroke-dasharray="8 6"/>
          <path d="M100 30 L120 90 L100 75 L80 90 Z" fill="var(--primary)"/>
          <circle cx="100" cy="100" r="6" fill="var(--primary)"/>
        </svg>
        <svg style="position:absolute;bottom:-30px;left:-20px;width:140px;height:140px;opacity:0.06;pointer-events:none;" viewBox="0 0 140 140" fill="none">
          <circle cx="70" cy="70" r="60" stroke="var(--accent)" stroke-width="2"/>
          <circle cx="70" cy="70" r="35" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4 4"/>
        </svg>
        <div style="position: relative; z-index: 1;">
          <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">
            ${t('home.greeting')}
          </h1>
          <p style="font-size: 18px; color: var(--text-secondary); max-width: 560px; margin: 0 auto;">
            ${t('home.subtitle')}
          </p>
        </div>
      </section>

      <!-- Tool cards grid -->
      <section style="
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        max-width: 960px;
        margin: 0 auto;
        padding: 0 20px 40px;
      ">
        ${cardsHtml}
      </section>

      <!-- Footer -->
      <footer style="
        text-align: center;
        padding: 24px 20px 40px;
        border-top: 1px solid var(--border);
        max-width: 960px;
        margin: 0 auto;
      ">
        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
          <i data-lucide="alert-triangle" style="width: 14px; height: 14px; display: inline; vertical-align: -2px;"></i>
          ${t('common.disclaimer')}
        </p>
        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">
          ${t('common.lastUpdated')}
        </p>
        <p style="font-size: 13px;">
          <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer">USCIS.gov</a>
          &nbsp;&middot;&nbsp;
          <a href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" target="_blank" rel="noopener noreferrer">Visa Bulletin</a>
        </p>
      </footer>
    </div>
  `;

  // Responsive grid: 2-col tablet, 1-col mobile
  const grid = content.querySelector('section:nth-of-type(2)') as HTMLElement | null;
  if (grid) {
    // Clean up previous listeners
    if (gridAbortController) gridAbortController.abort();
    gridAbortController = new AbortController();
    const signal = gridAbortController.signal;

    const mq768 = window.matchMedia('(max-width: 768px)');
    const mq480 = window.matchMedia('(max-width: 480px)');
    const featuredCard = grid.querySelector('.card:first-child') as HTMLElement | null;
    const lastCard = grid.querySelector('.last-card') as HTMLElement | null;
    const applyGrid = () => {
      if (mq480.matches) {
        grid.style.gridTemplateColumns = '1fr';
        if (featuredCard) featuredCard.style.gridColumn = 'span 1';
        if (lastCard) lastCard.style.gridColumn = 'span 1';
      } else if (mq768.matches) {
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        if (featuredCard) featuredCard.style.gridColumn = 'span 2';
        if (lastCard) lastCard.style.gridColumn = 'span 1';
      } else {
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        if (featuredCard) featuredCard.style.gridColumn = 'span 2';
        if (lastCard) lastCard.style.gridColumn = 'span 2';
      }
    };
    applyGrid();
    mq768.addEventListener('change', applyGrid, { signal });
    mq480.addEventListener('change', applyGrid, { signal });
  }

  updateMobileNavActive();
  activateIcons();
}

// ---------------------------------------------------------------------------
// Mobile nav active state
// ---------------------------------------------------------------------------

function updateMobileNavActive(): void {
  const current = getCurrentRoute();
  document.querySelectorAll('.tool-nav a').forEach(link => {
    const route = link.getAttribute('data-route');
    link.classList.toggle('active', route === current);
  });
}

// ---------------------------------------------------------------------------
// Route registration
// ---------------------------------------------------------------------------

function renderNotFound(): void {
  const content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = `
    <div class="fade-in" style="max-width:640px;margin:0 auto;padding:80px 20px;text-align:center;">
      <i data-lucide="map-pin-off" style="width:64px;height:64px;color:var(--text-secondary);margin:0 auto 24px;display:block;"></i>
      <h1 style="font-size:28px;font-weight:700;margin-bottom:12px;">${t('notFound.title')}</h1>
      <p style="font-size:16px;color:var(--text-secondary);margin-bottom:32px;">${t('notFound.message')}</p>
      <a href="/" class="btn-primary" style="text-decoration:none;">
        <i data-lucide="home" style="width:18px;height:18px;"></i>
        ${t('notFound.backHome')}
      </a>
    </div>
  `;
  activateIcons();
}

function registerRoutes(): void {
  const content = () => document.getElementById('content') as HTMLElement;

  routes.set('/', renderHome);
  routes.set('/pathway', () => { renderPathway(content()); updateMobileNavActive(); });
  routes.set('/h1b', () => { renderH1B(content()); updateMobileNavActive(); });
  routes.set('/o1-assess', () => { renderO1Assess(content()); updateMobileNavActive(); });
  routes.set('/o1-builder', () => { renderO1Builder(content()); updateMobileNavActive(); });
  routes.set('/eb-compare', () => { renderEBCompare(content()); updateMobileNavActive(); });
  routes.set('/backlog', () => { renderBacklog(content()); updateMobileNavActive(); });
  routes.set('/timeline', () => { renderTimeline(content()); updateMobileNavActive(); });
  routes.set('/employer', () => { renderEmployer(content()); updateMobileNavActive(); });
  routes.set('/red-flags', () => { renderRedFlags(content()); updateMobileNavActive(); });
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

function initApp(): void {
  initDarkMode();
  document.documentElement.lang = currentLang();
  renderShell();
  registerRoutes();
  setNotFoundHandler(renderNotFound);
  initRouter();

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', initApp);

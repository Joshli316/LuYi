/**
 * LuYi 路易 — Main entry point.
 * Wires the router, i18n, dark mode, and tool modules together.
 */

import { routes, navigate, getCurrentRoute, initRouter } from './utils/router';
import { saveState, loadState } from './utils/storage';
import { currentLang, setLang, t } from './i18n';
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
    <!-- Header -->
    <header style="
      position: sticky; top: 0; z-index: 50;
      background: var(--surface); border-bottom: 1px solid var(--border);
      padding: 12px 20px;
      display: flex; align-items: center; justify-content: space-between;
    ">
      <a href="#/" id="logo-link" style="
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
          padding: 6px 16px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: opacity 200ms ease;
        ">${langLabel}</button>
        <button id="dark-mode-btn" aria-label="${t('darkMode.toggle')}" style="
          background: transparent; border: 1px solid var(--border);
          border-radius: 9999px; width: 40px; height: 40px;
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
      <a href="#/pathway" data-route="/pathway">
        <i data-lucide="compass" style="width: 20px; height: 20px;"></i>
        <span>${t('nav.pathway')}</span>
      </a>
      <a href="#/h1b" data-route="/h1b">
        <i data-lucide="dice-3" style="width: 20px; height: 20px;"></i>
        <span>${t('nav.h1b')}</span>
      </a>
      <a href="#/o1-assess" data-route="/o1-assess">
        <i data-lucide="award" style="width: 20px; height: 20px;"></i>
        <span>${t('nav.o1')}</span>
      </a>
      <a href="#/timeline" data-route="/timeline">
        <i data-lucide="calendar-range" style="width: 20px; height: 20px;"></i>
        <span>${t('nav.timeline')}</span>
      </a>
      <a href="#/red-flags" data-route="/red-flags">
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

  const cardsHtml = toolCards.map(card => `
    <a href="#${card.route}" class="card card-hover" style="
      display: flex; flex-direction: column; gap: 12px;
      text-decoration: none; color: inherit; cursor: pointer;
    ">
      <i data-lucide="${card.icon}" style="width: 32px; height: 32px; color: var(--primary);"></i>
      <h3 style="font-size: 18px; font-weight: 600; margin: 0;">${t(card.nameKey)}</h3>
      <p style="font-size: 14px; color: var(--text-secondary); margin: 0;">${t(card.descKey)}</p>
    </a>
  `).join('');

  content.innerHTML = `
    <div class="fade-in">
      <!-- Hero -->
      <section style="text-align: center; padding: 48px 20px 32px;">
        <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 12px;">
          ${t('home.greeting')}
        </h1>
        <p style="font-size: 18px; color: var(--text-secondary); max-width: 560px; margin: 0 auto;">
          ${t('home.subtitle')}
        </p>
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
    const mq768 = window.matchMedia('(max-width: 768px)');
    const mq480 = window.matchMedia('(max-width: 480px)');
    const applyGrid = () => {
      if (mq480.matches) {
        grid.style.gridTemplateColumns = '1fr';
      } else if (mq768.matches) {
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      } else {
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      }
    };
    applyGrid();
    mq768.addEventListener('change', applyGrid);
    mq480.addEventListener('change', applyGrid);
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
  renderShell();
  registerRoutes();
  initRouter();
}

document.addEventListener('DOMContentLoaded', initApp);

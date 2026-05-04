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
      <div style="display: flex; align-items: center; gap: 12px;">
        <a href="https://yi-1ot.pages.dev/" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;font-size:12px;color:var(--text-secondary);border:1px solid var(--border);border-radius:9999px;text-decoration:none;" aria-label="Back to Yi 易 — family of tools for international students">
          <span aria-hidden="true">←</span>&nbsp;Yi 易
        </a>
        <a href="/" id="logo-link" style="
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; color: var(--text);
        ">
          <i data-lucide="compass" style="width: 28px; height: 28px; color: var(--primary);"></i>
          <span style="font-size: 20px; font-weight: 700;">
            <span style="color: var(--primary);">路易</span> LuYi
          </span>
        </a>
      </div>
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

  const renderCard = (card: ToolCard) => `
    <a href="${card.route}" class="card card-hover" style="
      display: flex; flex-direction: column; gap: 12px;
      text-decoration: none; color: inherit; cursor: pointer;
    ">
      <i data-lucide="${card.icon}" style="width: 32px; height: 32px; color: var(--primary);"></i>
      <h3 style="font-size: 18px; font-weight: 600; margin: 0;">${t(card.nameKey)}</h3>
      <p style="font-size: 14px; color: var(--text-secondary); margin: 0;">${t(card.descKey)}</p>
    </a>`;

  // Group 1: Explore (Pathway, H-1B, O-1 Assess) — first 3
  // Group 2: Build (O-1 Builder, EB Compare, Backlog) — next 3
  // Group 3: Plan (Timeline, Employer, Red Flags) — last 3
  const group1 = toolCards.slice(0, 3).map(renderCard).join('');
  const group2 = toolCards.slice(3, 6).map(renderCard).join('');
  const group3 = toolCards.slice(6, 9).map(renderCard).join('');

  content.innerHTML = `
    <div class="fade-in">
      <!-- Hero — split layout with visual anchor -->
      <section style="max-width:960px;margin:0 auto;padding:40px 20px 0;">
        <div style="display:flex;align-items:center;gap:40px;flex-wrap:wrap;">
          <!-- Left: text, left-aligned -->
          <div style="flex:1;min-width:300px;">
            <p style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--primary);margin:0 0 12px;">
              ${tl({ en: 'Free Immigration Tools', zh: '免费移民工具' })}
            </p>
            <h1 style="font-size:36px;font-weight:700;margin:0 0 16px;line-height:1.2;">
              ${t('home.greeting')}
            </h1>
            <p style="font-size:18px;color:var(--text-secondary);margin:0 0 28px;line-height:1.6;max-width:480px;">
              ${t('home.subtitle')}
            </p>
            <a href="/pathway" class="btn-primary" style="font-size:17px;padding:14px 32px;text-decoration:none;">
              <i data-lucide="compass" style="width:20px;height:20px;"></i>
              ${t('home.startHere')}
            </a>
          </div>
          <!-- Right: decorative compass visual -->
          <div style="flex:0 0 auto;position:relative;width:200px;height:200px;" aria-hidden="true">
            <svg viewBox="0 0 200 200" fill="none" style="width:100%;height:100%;opacity:0.15;">
              <circle cx="100" cy="100" r="90" stroke="var(--primary)" stroke-width="2" stroke-dasharray="8 6"/>
              <circle cx="100" cy="100" r="60" stroke="var(--primary)" stroke-width="1.5"/>
              <path d="M100 20 L115 90 L100 75 L85 90 Z" fill="var(--primary)"/>
              <path d="M100 180 L85 110 L100 125 L115 110 Z" fill="var(--accent)" opacity="0.6"/>
              <circle cx="100" cy="100" r="8" fill="var(--primary)"/>
              <line x1="100" y1="15" x2="100" y2="40" stroke="var(--primary)" stroke-width="2"/>
              <line x1="100" y1="160" x2="100" y2="185" stroke="var(--primary)" stroke-width="1.5"/>
              <line x1="15" y1="100" x2="40" y2="100" stroke="var(--primary)" stroke-width="1.5"/>
              <line x1="160" y1="100" x2="185" y2="100" stroke="var(--primary)" stroke-width="1.5"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- Tool cards — grouped with varied spacing -->
      <div style="max-width:960px;margin:0 auto;padding:40px 20px 40px;">
        <!-- Explore -->
        <div style="margin-bottom:36px;">
          <h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--primary);margin:0 0 16px;padding-left:2px;">
            ${tl({ en: 'Explore Your Options', zh: '探索你的选择' })}
          </h2>
          <div class="tool-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
            ${group1}
          </div>
        </div>

        <!-- Build -->
        <div style="margin-bottom:36px;">
          <h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--primary);margin:0 0 16px;padding-left:2px;">
            ${tl({ en: 'Build Your Case', zh: '构建你的申请' })}
          </h2>
          <div class="tool-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
            ${group2}
          </div>
        </div>

        <!-- Plan -->
        <div>
          <h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--primary);margin:0 0 16px;padding-left:2px;">
            ${tl({ en: 'Plan & Protect', zh: '规划与防护' })}
          </h2>
          <div class="tool-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
            ${group3}
          </div>
        </div>
      </div>

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

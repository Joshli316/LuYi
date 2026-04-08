# Implementation Plan: LuYi 路易 — Path Made Easy

## Overview
A free, bilingual immigration pathway planner that helps international students discover options beyond H-1B, assess their eligibility for O-1/EB-2 NIW/L-1, plan timelines, vet employers, and avoid scams. Client-side SPA, same architecture as ShuiYi 税易.

## Design Spec

**Direction:** Friendly Guide — warm, conversational, hand-holding. Duolingo meets TurboTax.

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#0D9488` | Teal-600. Buttons, active states, progress bars, links |
| `--primary-light` | `#CCFBF1` | Teal-100. Light backgrounds, selected states |
| `--primary-dark` | `#0F766E` | Teal-700. Hover states, headings |
| `--accent` | `#F59E0B` | Amber-500. Stars, celebrations, highlights, badges |
| `--accent-light` | `#FEF3C7` | Amber-100. Warning backgrounds |
| `--bg` | `#FFFBF5` | Warm cream page background |
| `--surface` | `#FFFFFF` | Card backgrounds |
| `--text` | `#1F2937` | Gray-800. Primary text |
| `--text-secondary` | `#6B7280` | Gray-500. Secondary text, descriptions |
| `--success` | `#10B981` | Emerald-500. Checkmarks, "you qualify" |
| `--warning` | `#F59E0B` | Amber-500. "Close, needs work" |
| `--danger` | `#EF4444` | Red-500. Red flags, scam alerts, "does not meet" |
| `--border` | `#E5E7EB` | Gray-200. Subtle borders |
| `--dark-bg` | `#111827` | Gray-900. Dark mode background |
| `--dark-surface` | `#1F2937` | Gray-800. Dark mode cards |
| `--dark-text` | `#F9FAFB` | Gray-50. Dark mode text |

### Typography
- **Display/Headings:** Inter (Google Fonts), fallback: system-ui, -apple-system, sans-serif
- **Body:** Same stack
- **Chinese:** "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif
- **Scale:** text-sm (14px), text-base (16px body), text-lg (18px), text-xl (20px), text-2xl (24px), text-3xl (30px hero)
- **Monospace body minimum:** 18px (per feedback)
- **Weights:** 400 (body), 500 (medium labels), 600 (semibold subheads), 700 (bold headings)
- **Line height:** 1.3 headings, 1.6 body

### Shape Language
- Cards: `rounded-2xl` (16px) — friendly, approachable
- Buttons: `rounded-xl` (12px) — soft but distinct from cards
- Inputs/selects: `rounded-lg` (8px)
- Tags/badges/pills: `rounded-full`
- Progress bar: `rounded-full`

### Shadows
- Card resting: `0 2px 8px rgba(0,0,0,0.06)`
- Card hover: `0 8px 24px rgba(0,0,0,0.1)` + `translateY(-2px)`
- Active/focus ring: `0 0 0 3px rgba(13,148,136,0.25)`
- Modal: `0 16px 48px rgba(0,0,0,0.15)`

### Transitions
- Global: `200ms ease` for all interactive states
- Card hover lift: `transform 200ms ease, box-shadow 200ms ease`
- Progress bar fill: `width 400ms ease`
- Page transitions: fade in `150ms ease`

### Spacing
- Base unit: 4px
- Within groups: 16-24px
- Between sections: 48-64px
- Card padding: 24px (mobile), 32px (desktop)
- Page max-width: 1200px, centered with `mx-auto px-4 sm:px-6 lg:px-8`

### Component Specs

**Tool Card (Home Screen)**
- White card, rounded-2xl, 24px padding
- Left-aligned Lucide icon (32px, teal) with tool name (text-lg semibold) and 1-line description (text-sm text-secondary)
- Hover: lift 2px + shadow increase + teal left border accent
- 3-column grid desktop, 2-column tablet, 1-column mobile

**Wizard Step**
- Full-width card with question text (text-xl), helper text (text-sm secondary), input area
- Teal progress bar at top showing step X of N with percentage
- "Back" ghost button (left), "Next" primary button (right)
- Encouraging microcopy below inputs ("Great choice!" / "Almost there!")

**Result Card**
- Status icon (checkmark green / warning amber / X red) + title + body text
- Left color border (4px, status color)
- Expandable "Learn more" section with source links

**Comparison Table**
- Horizontal scroll on mobile, sticky first column
- Alternating row backgrounds (white / cream)
- Header row: teal background, white text
- Cell badges: "Self-petition ✓" green, "Employer required" amber, "Long wait" red

**Disclaimer Bar**
- Sticky bottom on result screens
- Warm amber-50 background, amber-700 text
- Shield icon + bilingual disclaimer text
- Dismissible but reappears on each new result

**Header**
- Logo left ("路易 LuYi"), language toggle pill right (EN | 中文), dark mode toggle
- Mobile: hamburger menu for tool navigation

### Dark Mode
- CSS custom properties toggle via `.dark` class on `<html>`
- All color tokens have dark variants
- No `!important` overrides — use CSS custom properties throughout

### Responsive Breakpoints
- 375px: single column, stacked cards, full-width buttons
- 768px: 2-column tool grid, side-by-side comparison pairs
- 1024px: 3-column tool grid, full comparison tables, sidebar nav option

## Steps

### Step 1: Project Scaffold
- Create `index.html` with app shell: meta tags, Google Fonts (Inter), Tailwind v4 CDN, Lucide CDN, `<div id="app">`, script tag
- Create `manifest.json`, `sw.js` (basic cache-first)
- Create `build.js` using esbuild (bundle src/app.ts → dist/app.js)
- Create `package.json` with esbuild dev dependency
- Set up CSS custom properties for the full color token system (light + dark mode)

### Step 2: Core Infrastructure
- `src/i18n.ts` — bilingual string system with EN/ZH toggle, language detection from browser
- `src/utils/router.ts` — hash-based router (#/, #/pathway, #/h1b, #/o1-assess, etc.)
- `src/utils/storage.ts` — sessionStorage wrapper for wizard state
- `src/app.ts` — main entry: init router, render nav, mount tools

### Step 3: Home Screen + Navigation
- Header with logo "路易 LuYi", language toggle pill, dark mode toggle
- Hero section: warm greeting ("Your immigration journey, simplified" / "你的移民之路，从这里开始"), 1-line value prop
- 9 tool cards in a responsive grid (3-col → 2-col → 1-col)
- Each card: Lucide icon, tool name, 1-line description, click → navigate to tool route
- Footer with disclaimer, "Last updated: April 2026", and source links
- Mobile bottom nav or hamburger for tool switching

### Step 4: Pathway Decision Tree Wizard
- `src/tools/pathway.ts` + `src/data/fields.ts` + `src/data/countries.ts`
- Step 1: Degree level (Bachelor's / Master's / PhD / Professional)
- Step 2: Field of study (STEM, Business, Arts, Law, Medicine, etc.)
- Step 3: Country of birth (dropdown — affects backlog)
- Step 4: Achievement checklist (publications? awards? high salary? patents? etc.)
- Step 5: Work situation (have job offer? company size? multinational?)
- Result: Ranked list of viable pathways with match strength (green/amber/red), pros/cons for each, and links to the relevant tool for deeper assessment
- Disclaimer bar on result screen

### Step 5: H-1B Lottery Odds Estimator
- `src/tools/h1b.ts` + `src/data/h1b-rates.ts`
- Inputs: degree level (affects cap pool), expected wage level (1-4 for weighted lottery), number of registrations expected
- Historical data table: FY2021-FY2026 selection rates
- Calculation: show estimated odds based on pool + wage weight (FY2027 weighted lottery model)
- Visual: probability bar/gauge, comparison "Your odds vs. historical average"
- Context cards: what happens if not selected, cap-gap rules, STEM OPT backup plan
- Disclaimer bar

### Step 6: O-1 Self-Assessment
- `src/tools/o1-assess.ts` + `src/data/o1-criteria.ts`
- Walk through each of the 8 O-1A criteria one at a time
- For each criterion: explain what it is, show strong vs weak evidence examples, ask "Do you have evidence for this?" (Yes / Partially / No)
- Result dashboard: criteria met (green ✓), partially met (amber ~), not met (red ✗)
- Score: X of 8 criteria met. Need 3. Show "You currently meet X criteria" with encouraging message
- If ≥3: "You may have a strong O-1A case" with next steps
- If 1-2: "You're building — here's what to work on" with links to evidence builder
- If 0: "O-1A may not be the right path yet" with alternative suggestions

### Step 7: O-1 Evidence Builder Checklist
- `src/tools/o1-builder.ts`
- For each of the 8 criteria: expandable section with concrete action items
- Actions are checkable (checkbox + progress tracking per criterion)
- Example actions for "Publications": submit to conferences, co-author papers, write for industry publications
- Example for "Judging": volunteer as peer reviewer, join conference program committee
- Timeline suggestions: "Start this in freshman year" / "Start 1 year before applying"
- Progress summary: "You've completed X of Y actions across Z criteria"
- Save state in sessionStorage so they can come back during the session

### Step 8: EB Category Comparison
- `src/tools/eb-compare.ts` + `src/data/eb-categories.ts`
- Side-by-side comparison table: EB-1A, EB-1B, EB-2 (PERM), EB-2 NIW, EB-3
- Rows: requirements, self-petition?, PERM needed?, employer sponsor?, typical timeline, estimated cost, priority date backlog, best for whom
- Sticky first column on mobile (horizontal scroll)
- Highlight cards for key differences: "NIW = no employer needed", "EB-1A = fastest if you qualify"
- Filter: "Show categories I might qualify for" based on pathway wizard results (if completed)
- Disclaimer bar

### Step 9: Green Card Backlog Tracker
- `src/tools/backlog.ts` + `src/data/visa-bulletin.ts`
- Input: country of birth, EB category
- Display: current priority date, estimated wait time, historical movement chart (last 5 years as a simple text/table visualization)
- Comparison cards: your country vs rest of world
- Color coding: green (current/short wait), amber (2-5 years), red (5+ years)
- Strategy suggestions for long backlogs: "Consider EB-1A upgrade", "NIW allows self-petition"
- Data source: Visa Bulletin April 2026

### Step 10: Timeline Planner
- `src/tools/timeline.ts`
- Input: graduation date (month/year), current year in school, degree level, target pathway
- Output: backward-calculated timeline showing when to start each process
- Visual: vertical timeline with milestones, color-coded by urgency
- Key milestones: OPT application, H-1B registration, STEM OPT extension, PERM start, I-140 filing, O-1 evidence building start
- Critical deadlines highlighted in red with countdown
- "You have X months until [next deadline]" at the top

### Step 11: Employer Questions Checklist
- `src/tools/employer.ts`
- Checklist of questions to ask during job interviews, organized by category:
  - H-1B sponsorship questions (5-6 items)
  - Green card sponsorship questions (5-6 items)
  - Cost and legal support questions (3-4 items)
- Green flags section: what good answers look like
- Red flags section: warning signs with explanations
- "Copy all questions" button for interview prep
- Top H-1B sponsors list (top 10 companies by approved petitions)

### Step 12: Red Flags Guide
- `src/tools/red-flags.ts`
- Categories: fake lawyers/notarios, H-1B mills, pay-to-stay schools, fake job offers, DV lottery scams
- Each category: what it is, how to spot it, real examples, what to do
- Attorney verification checklist: state bar lookup, AILA search, disciplinary check
- Reporting resources: USCIS tip line, FTC, state AG, FBI IC3
- Quick quiz: "Is this a scam?" — show 5-6 scenarios, user guesses, reveal answer with explanation

### Step 13: Print Styles + PWA
- `src/styles/print.css` — clean print layout for all result screens
- Optimize `manifest.json` for installability
- Service worker caching strategy for offline access
- Add `_headers`, `_redirects`, `robots.txt`, `sitemap.xml` for Cloudflare Pages

### Step 14: Final Polish + Verification
- Run full bilingual QA: every string in i18n.ts has both EN and ZH
- Test at 375px, 768px, 1024px
- Verify dark mode for all screens
- Check all disclaimers present on result screens
- Test all tool navigation and back buttons
- Verify no console errors
- Run /verify

## Files to Create/Modify
- `index.html` — app shell with meta, fonts, Tailwind, Lucide
- `build.js` — esbuild bundler config
- `package.json` — project config with esbuild
- `tsconfig.json` — TypeScript config
- `manifest.json` — PWA manifest
- `sw.js` — service worker
- `src/app.ts` — main entry, router, nav
- `src/i18n.ts` — all bilingual strings
- `src/utils/router.ts` — hash router
- `src/utils/storage.ts` — sessionStorage wrapper
- `src/tools/pathway.ts` — pathway decision tree
- `src/tools/h1b.ts` — H-1B lottery estimator
- `src/tools/o1-assess.ts` — O-1 self-assessment
- `src/tools/o1-builder.ts` — O-1 evidence builder
- `src/tools/eb-compare.ts` — EB category comparison
- `src/tools/backlog.ts` — green card backlog tracker
- `src/tools/timeline.ts` — timeline planner
- `src/tools/employer.ts` — employer questions
- `src/tools/red-flags.ts` — scam red flags guide
- `src/data/h1b-rates.ts` — H-1B historical lottery data
- `src/data/o1-criteria.ts` — O-1A 8 criteria + evidence examples
- `src/data/eb-categories.ts` — EB category requirements
- `src/data/visa-bulletin.ts` — priority dates by country
- `src/data/countries.ts` — country of birth list
- `src/data/fields.ts` — degree field categories
- `src/styles/print.css` — print stylesheet
- `assets/icons/` — PWA icons
- `_headers`, `_redirects`, `robots.txt`, `sitemap.xml` — CF Pages config
- `dist/` — build output

## Open Questions
None — research is complete, design direction is set, all features are scoped.

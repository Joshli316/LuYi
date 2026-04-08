# LuYi 路易 — Path Made Easy

Free, bilingual (EN/ZH) post-graduation immigration pathway planner for international students in the US. Helps students discover visa options beyond H-1B, assess their eligibility, plan timelines, and avoid scams — without being an immigration lawyer.

## Tech Stack
- HTML/TypeScript single-page app
- Tailwind CSS v4 (CDN)
- Lucide icons (CDN)
- Cloudflare Pages deployment
- No server, no database, no user accounts — 100% client-side

## Structure
```
LuYi/
├── index.html          # Entry point, app shell, tool launcher
├── plan.md             # Implementation plan
├── CLAUDE.md           # This file
├── research/           # 13 research reports (reference data)
├── src/
│   ├── app.ts          # Main app logic, router, navigation
│   ├── i18n.ts         # Bilingual strings (EN/ZH), toggle logic
│   ├── tools/
│   │   ├── pathway.ts      # Pathway decision tree wizard
│   │   ├── h1b.ts          # H-1B lottery odds estimator
│   │   ├── o1-assess.ts    # O-1 self-assessment (8 criteria)
│   │   ├── o1-builder.ts   # O-1 evidence builder checklist
│   │   ├── eb-compare.ts   # EB category comparison table
│   │   ├── backlog.ts      # Green card backlog tracker
│   │   ├── timeline.ts     # Timeline planner
│   │   ├── employer.ts     # Employer questions checklist
│   │   └── red-flags.ts    # Immigration scam red flags guide
│   ├── data/
│   │   ├── h1b-rates.ts    # H-1B lottery historical data
│   │   ├── o1-criteria.ts  # O-1A 8 criteria with evidence examples
│   │   ├── eb-categories.ts # EB-1A/1B/2/NIW/3 requirements
│   │   ├── visa-bulletin.ts # Priority dates by country/category
│   │   ├── countries.ts    # Country of birth list
│   │   └── fields.ts      # Degree field categories
│   ├── utils/
│   │   ├── storage.ts  # sessionStorage wrapper
│   │   └── router.ts   # Simple hash-based router
│   └── styles/
│       └── print.css   # Print-friendly stylesheet
├── assets/
│   └── icons/          # PWA icons
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
└── dist/               # Build output for deployment
```

## Entry Point
index.html

## Build
`node build.js` (esbuild, outputs to dist/)

## Deployment
`wrangler pages deploy dist/`

## Conventions
- **Bilingual:** All user-facing strings go in i18n.ts. Keys are English, values are {en, zh} objects. Toggle switches ALL visible text.
- **Tool-based navigation:** Home screen shows 9 tool cards. Each tool is self-contained with its own route.
- **Disclaimers:** Every output/result screen includes "This is for educational purposes only. This is not legal advice. Consult a qualified immigration attorney." in both languages.
- **Tone:** Warm, encouraging, conversational. "Let's explore your options together" not "Determine your visa eligibility." Like a knowledgeable friend, not a government website.
- **Sources:** Every factual claim links to USCIS.gov, visa bulletin, or research report. Inline citations.
- **Privacy:** Zero server-side storage. sessionStorage only (cleared on tab close). No cookies. No analytics.
- **Accessibility:** WCAG AA contrast, keyboard nav, ARIA labels, 44px touch targets, lang attribute switches on toggle.
- **No legal advice:** We educate, compare, estimate, and checklist. We do NOT recommend specific actions or replace attorney consultation.
- **Data currency:** Research data sourced April 2026. Note "Last updated: April 2026" on data-heavy screens.

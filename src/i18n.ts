/**
 * Bilingual (EN/ZH) i18n module for LuYi.
 * All user-facing strings are stored here.
 */

export type Lang = 'en' | 'zh';

let _currentLang: Lang = 'en';

export function currentLang(): Lang {
  return _currentLang;
}

export function setLang(lang: Lang): void {
  _currentLang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}

const strings: Record<string, { en: string; zh: string }> = {
  // App chrome
  'app.title': { en: 'LuYi', zh: '路易' },
  'app.tagline': { en: 'Path Made Easy', zh: '移民之路，化繁为简' },
  'app.langToggle.en': { en: '中文', zh: '中文' },
  'app.langToggle.zh': { en: 'EN', zh: 'EN' },

  // Home hero
  'home.greeting': {
    en: "Let's explore your immigration options together.",
    zh: '让我们一起探索你的移民选择。',
  },
  'home.subtitle': {
    en: 'Free tools to understand your visa pathways, estimate your odds, and plan ahead — no account needed.',
    zh: '免费工具，帮你了解签证路径、估算概率、提前规划 — 无需注册。',
  },

  // Tool names
  'tool.pathway': { en: 'Pathway Finder', zh: '路径探索' },
  'tool.h1b': { en: 'H-1B Odds', zh: 'H-1B 概率' },
  'tool.o1Assess': { en: 'O-1 Self-Assessment', zh: 'O-1 自评' },
  'tool.o1Builder': { en: 'O-1 Evidence Builder', zh: 'O-1 证据清单' },
  'tool.ebCompare': { en: 'EB Compare', zh: 'EB 对比' },
  'tool.backlog': { en: 'Backlog Tracker', zh: '排期查询' },
  'tool.timeline': { en: 'Timeline Planner', zh: '时间规划' },
  'tool.employer': { en: 'Employer Questions', zh: '雇主问题' },
  'tool.redFlags': { en: 'Red Flags', zh: '防骗指南' },

  // Tool descriptions
  'tool.pathway.desc': {
    en: 'Discover which visa paths fit your situation.',
    zh: '发现适合你情况的签证路径。',
  },
  'tool.h1b.desc': {
    en: 'Estimate your H-1B lottery selection chances.',
    zh: '估算你的H-1B抽签中签概率。',
  },
  'tool.o1Assess.desc': {
    en: 'Check how you stack up on the 8 O-1A criteria.',
    zh: '对照O-1A八项标准评估你的资质。',
  },
  'tool.o1Builder.desc': {
    en: 'Build your O-1 evidence portfolio step by step.',
    zh: '逐步构建你的O-1证据材料。',
  },
  'tool.ebCompare.desc': {
    en: 'Compare EB-1A, EB-1B, EB-2 NIW, and EB-3.',
    zh: '对比EB-1A、EB-1B、EB-2 NIW和EB-3。',
  },
  'tool.backlog.desc': {
    en: 'See current green card wait times by country.',
    zh: '查看各国当前绿卡排期等待时间。',
  },
  'tool.timeline.desc': {
    en: 'Map your immigration milestones on a timeline.',
    zh: '在时间线上规划你的移民里程碑。',
  },
  'tool.employer.desc': {
    en: 'Questions to ask your employer about sponsorship.',
    zh: '关于雇主担保，你应该问的问题。',
  },
  'tool.redFlags.desc': {
    en: 'Spot immigration scams before they cost you.',
    zh: '识别移民骗局，保护自己。',
  },

  // Shared
  'common.backHome': { en: 'Back to Home', zh: '返回首页' },
  'common.disclaimer': {
    en: 'This is for educational purposes only. This is not legal advice. Consult a qualified immigration attorney.',
    zh: '本工具仅供教育参考，不构成法律建议。请咨询合格的移民律师。',
  },
  'common.lastUpdated': { en: 'Last updated: April 2026', zh: '最后更新：2026年4月' },
  'common.sources': { en: 'Sources', zh: '数据来源' },

  // Dark mode
  'darkMode.toggle': { en: 'Toggle dark mode', zh: '切换深色模式' },

  // Mobile nav
  'nav.pathway': { en: 'Pathway', zh: '路径' },
  'nav.h1b': { en: 'H-1B', zh: 'H-1B' },
  'nav.o1': { en: 'O-1', zh: 'O-1' },
  'nav.timeline': { en: 'Timeline', zh: '时间线' },
  'nav.redFlags': { en: 'Red Flags', zh: '防骗' },
};

/**
 * Get a translated string by key.
 * Falls back to the key itself if not found.
 */
export function t(key: string, replacements?: Record<string, string | number>): string {
  const entry = strings[key];
  let result = entry ? entry[_currentLang] : key;
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return result;
}

/** Inline bilingual string — use in tool files for tool-specific strings */
export function tl(obj: { en: string; zh: string }): string {
  return obj[_currentLang];
}

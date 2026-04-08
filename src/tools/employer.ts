import { t, tl, currentLang } from '../i18n';
import { renderDisclaimer, activateIcons } from '../utils/ui';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface QuestionItem {
  en: string;
  zh: string;
}

const h1bQuestions: QuestionItem[] = [
  { en: 'Does the company sponsor H-1B visas?', zh: '公司是否提供H-1B签证担保？' },
  { en: 'When will you file my H-1B petition?', zh: '你们何时提交我的H-1B申请？' },
  { en: 'Will the company pay for premium processing ($2,965)?', zh: '公司是否支付加急处理费（$2,965）？' },
  { en: 'Who pays the filing fees and attorney fees?', zh: '谁支付申请费和律师费？' },
  { en: 'Which immigration law firm does the company use?', zh: '公司使用哪家移民律所？' },
  { en: 'What is the company\'s H-1B approval rate?', zh: '公司的H-1B批准率是多少？' },
];

const gcQuestions: QuestionItem[] = [
  { en: 'Does the company sponsor for green cards?', zh: '公司是否提供绿卡担保？' },
  { en: 'When does the green card process typically start?', zh: '绿卡流程通常何时开始？' },
  { en: 'Will you file for PERM labor certification?', zh: '你们会提交PERM劳工认证吗？' },
  { en: 'Does the company support EB-1B or EB-2 NIW petitions?', zh: '公司是否支持EB-1B或EB-2 NIW申请？' },
  { en: 'What happens to my green card process if I get promoted?', zh: '如果我升职了，绿卡流程会怎样？' },
];

const costQuestions: QuestionItem[] = [
  { en: 'Will the company cover H-4 dependent filing costs?', zh: '公司是否承担H-4亲属申请费用？' },
  { en: 'Is there a repayment clause for visa costs if I leave?', zh: '如果我离职，是否需要偿还签证费用？' },
  { en: 'Does the company use premium processing for extensions?', zh: '公司是否对延期使用加急处理？' },
  { en: 'Can I see a sample immigration timeline for new hires?', zh: '能否看一下新员工的移民时间线样本？' },
];

interface FlagItem {
  en: string;
  zh: string;
}

const greenFlags: FlagItem[] = [
  { en: 'Established sponsorship history with high approval rates', zh: '有成熟的担保历史和高批准率' },
  { en: 'Dedicated immigration legal team', zh: '有专门的移民法务团队' },
  { en: 'Employer pays all fees', zh: '雇主承担所有费用' },
  { en: 'Early PERM filing (within 12-18 months)', zh: '早期启动PERM（12-18个月内）' },
  { en: 'Written sponsorship commitment in offer letter', zh: '录用信中有书面的担保承诺' },
  { en: 'Cap-exempt employer (university/nonprofit)', zh: '免配额雇主（大学/非营利组织）' },
];

const redFlags: FlagItem[] = [
  { en: '"We\'ll look into sponsorship after a year" — no commitment', zh: '"工作一年后再考虑担保"——没有承诺' },
  { en: 'Employee pays filing fees — illegal under federal law', zh: '员工支付申请费——违反联邦法律' },
  { en: 'Repayment clauses for H-1B costs — prohibited', zh: 'H-1B费用的偿还条款——被禁止' },
  { en: 'Benching (no pay between projects) — illegal', zh: '闲置不付薪（项目间无薪）——违法' },
  { en: 'No named immigration attorney', zh: '没有指定的移民律师' },
  { en: 'Staffing/body shop model with Level I wages', zh: '外包/人力派遣模式且只付一级工资' },
];

interface SponsorRow {
  rank: number;
  company: string;
  approvals: string;
}

const topSponsors: SponsorRow[] = [
  { rank: 1, company: 'Amazon', approvals: '~12,391' },
  { rank: 2, company: 'Tata Consultancy Services', approvals: '~5,505' },
  { rank: 3, company: 'Microsoft', approvals: '~5,189' },
  { rank: 4, company: 'Meta Platforms', approvals: '~5,123' },
  { rank: 5, company: 'Apple', approvals: '~4,202' },
  { rank: 6, company: 'Google', approvals: '~4,181' },
  { rank: 7, company: 'Deloitte Consulting', approvals: '~2,353' },
  { rank: 8, company: 'Oracle America', approvals: '~2,092' },
  { rank: 9, company: 'Infosys', approvals: '~2,004' },
  { rank: 10, company: 'Capgemini America', approvals: '~1,844' },
];

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

function renderQuestionSection(
  title: { en: string; zh: string },
  icon: string,
  questions: QuestionItem[],
  idPrefix: string
): string {
  const lang = currentLang();
  return `
    <div style="margin-bottom:24px">
      <h3 style="font-size:18px;font-weight:600;margin:0 0 12px;display:flex;align-items:center;gap:8px">
        <i data-lucide="${icon}" style="width:20px;height:20px;color:var(--primary)"></i>
        ${lang === 'en' ? title.en : title.zh}
      </h3>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${questions.map((q, i) => `
          <label class="checkbox-item" style="padding:12px 16px;background:var(--surface);border-radius:12px;border:1px solid var(--border);cursor:pointer">
            <input type="checkbox" id="${idPrefix}-${i}" style="width:20px;height:20px">
            <span style="font-size:15px">${lang === 'en' ? q.en : q.zh}</span>
          </label>
        `).join('')}
      </div>
    </div>`;
}

export function renderEmployer(container: HTMLElement): void {
  const lang = currentLang();

  const greenFlagItems = greenFlags.map(f => `
    <div class="result-card green" style="padding:14px 18px;margin-bottom:8px">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <i data-lucide="check-circle" style="width:18px;height:18px;color:var(--success);flex-shrink:0;margin-top:2px"></i>
        <span style="font-size:14px">${lang === 'en' ? f.en : f.zh}</span>
      </div>
    </div>
  `).join('');

  const redFlagItems = redFlags.map(f => `
    <div class="result-card red" style="padding:14px 18px;margin-bottom:8px">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <i data-lucide="alert-triangle" style="width:18px;height:18px;color:var(--danger);flex-shrink:0;margin-top:2px"></i>
        <span style="font-size:14px">${lang === 'en' ? f.en : f.zh}</span>
      </div>
    </div>
  `).join('');

  const sponsorRows = topSponsors.map(s => `
    <tr>
      <td style="font-weight:600;text-align:center">${s.rank}</td>
      <td>${s.company}</td>
      <td style="text-align:right">${s.approvals}</td>
    </tr>
  `).join('');

  container.innerHTML = `<div class="fade-in" style="max-width:640px;margin:0 auto;padding:24px 20px 120px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
      <a href="#/" style="color:var(--text-secondary);display:flex;align-items:center;gap:4px;font-size:14px">
        <i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${t('common.backHome')}
      </a>
    </div>
    <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:10px">
      <i data-lucide="building-2" style="width:28px;height:28px;color:var(--primary)"></i>
      ${tl({ en: 'Employer Questions Checklist', zh: '雇主问题清单' })}
    </h1>
    <p style="color:var(--text-secondary);margin-bottom:24px">${tl({ en: 'Questions to ask your employer (or during interviews) about immigration sponsorship. Check them off as you go.', zh: '面试或入职时，向雇主询问关于移民担保的问题。逐项勾选已问的问题。' })}</p>

    <!-- Question Sections -->
    ${renderQuestionSection(
      { en: 'H-1B Sponsorship Questions', zh: 'H-1B 担保问题' },
      'file-text',
      h1bQuestions,
      'h1b'
    )}

    ${renderQuestionSection(
      { en: 'Green Card Questions', zh: '绿卡问题' },
      'credit-card',
      gcQuestions,
      'gc'
    )}

    ${renderQuestionSection(
      { en: 'Cost & Legal Questions', zh: '费用与法律问题' },
      'scale',
      costQuestions,
      'cost'
    )}

    <!-- Copy All Button -->
    <div style="text-align:center;margin-bottom:32px">
      <button class="btn-primary" id="copy-all-btn">
        <i data-lucide="copy" style="width:18px;height:18px"></i>
        ${tl({ en: 'Copy All Questions', zh: '复制所有问题' })}
      </button>
    </div>

    <!-- Green Flags -->
    <div style="margin-bottom:24px">
      <h2 style="font-size:22px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px">
        <i data-lucide="thumbs-up" style="width:22px;height:22px;color:var(--success)"></i>
        ${tl({ en: 'Green Flags', zh: '好的信号' })}
      </h2>
      <p style="color:var(--text-secondary);font-size:14px;margin-bottom:12px">${tl({ en: 'Signs of a sponsorship-friendly employer:', zh: '愿意担保的雇主的积极信号：' })}</p>
      ${greenFlagItems}
    </div>

    <!-- Red Flags -->
    <div style="margin-bottom:32px">
      <h2 style="font-size:22px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px">
        <i data-lucide="alert-octagon" style="width:22px;height:22px;color:var(--danger)"></i>
        ${tl({ en: 'Red Flags', zh: '危险信号' })}
      </h2>
      <p style="color:var(--text-secondary);font-size:14px;margin-bottom:12px">${tl({ en: 'Warning signs — proceed with caution:', zh: '警告信号——请谨慎对待：' })}</p>
      ${redFlagItems}
    </div>

    <!-- Top Sponsors Table -->
    <div style="margin-bottom:24px">
      <h2 style="font-size:22px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px">
        <i data-lucide="trophy" style="width:22px;height:22px;color:var(--accent)"></i>
        ${tl({ en: 'Top H-1B Sponsors (FY2025)', zh: 'H-1B 排名前十雇主（FY2025）' })}
      </h2>
      <p style="color:var(--text-secondary);font-size:13px;margin-bottom:12px">${t('common.lastUpdated')}</p>
      <div class="comparison-table-wrapper" style="border-radius:12px;overflow:hidden;border:1px solid var(--border)">
        <table class="comparison-table">
          <thead>
            <tr>
              <th scope="col" style="text-align:center;width:60px">${tl({ en: 'Rank', zh: '排名' })}</th>
              <th scope="col">${tl({ en: 'Company', zh: '公司' })}</th>
              <th scope="col" style="text-align:right">${tl({ en: 'Approvals', zh: '批准数' })}</th>
            </tr>
          </thead>
          <tbody>
            ${sponsorRows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sources -->
    <p style="font-size:13px;color:var(--text-secondary);text-align:center;margin-bottom:16px">
      ${tl({ en: 'Source:', zh: '数据来源：' })}
      <a href="https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub" target="_blank" rel="noopener noreferrer">USCIS H-1B Employer Data Hub</a>
    </p>
  </div>
  ${renderDisclaimer()}`;

  activateIcons();

  // Copy All Questions handler
  document.getElementById('copy-all-btn')?.addEventListener('click', () => {
    const allQuestions = [
      ...h1bQuestions,
      ...gcQuestions,
      ...costQuestions,
    ];
    const text = allQuestions.map((q, i) => `${i + 1}. ${lang === 'en' ? q.en : q.zh}`).join('\n');

    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copy-all-btn');
      if (btn) {
        btn.innerHTML = `<i data-lucide="check" style="width:18px;height:18px"></i> ${tl({ en: 'Copied!', zh: '已复制！' })}`;
        activateIcons();
        setTimeout(() => {
          btn.innerHTML = `<i data-lucide="copy" style="width:18px;height:18px"></i> ${tl({ en: 'Copy All Questions', zh: '复制所有问题' })}`;
          activateIcons();
        }, 2000);
      }
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      const btn = document.getElementById('copy-all-btn');
      if (btn) {
        btn.innerHTML = `<i data-lucide="check" style="width:18px;height:18px"></i> ${tl({ en: 'Copied!', zh: '已复制！' })}`;
        activateIcons();
        setTimeout(() => {
          btn.innerHTML = `<i data-lucide="copy" style="width:18px;height:18px"></i> ${tl({ en: 'Copy All Questions', zh: '复制所有问题' })}`;
          activateIcons();
        }, 2000);
      }
    });
  });
}

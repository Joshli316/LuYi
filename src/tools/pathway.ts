import { t, tl, currentLang } from '../i18n';
import { countries } from '../data/countries';
import { fields } from '../data/fields';
import { saveState, loadState } from '../utils/storage';
import { renderDisclaimer, activateIcons } from '../utils/ui';

interface PathwayState {
  step: number;
  degree: string;
  field: string;
  country: string;
  achievements: string[];
  workSituation: string[];
}

const defaultState: PathwayState = { step: 1, degree: '', field: '', country: '', achievements: [], workSituation: [] };

function getState(): PathwayState {
  return loadState<PathwayState>('pathway') || { ...defaultState };
}

function setState(s: PathwayState) {
  saveState('pathway', s);
}

const achievementOptions = [
  { value: 'publications', en: 'Peer-reviewed publications', zh: '同行评审论文' },
  { value: 'awards', en: 'National/international awards', zh: '国家/国际级奖项' },
  { value: 'patents', en: 'Patents (filed or granted)', zh: '专利（已申请或已授权）' },
  { value: 'highSalary', en: 'Salary in top 10% of field', zh: '薪资在所在领域前10%' },
  { value: 'judging', en: 'Judged others\' work (peer review, panels)', zh: '评审过他人工作（同行评审、评委）' },
  { value: 'media', en: 'Press/media coverage about your work', zh: '你的工作被媒体报道过' },
  { value: 'membership', en: 'Selective professional memberships', zh: '入选型专业组织会员' },
  { value: 'openSource', en: 'Major open-source contributions', zh: '重大开源贡献' },
];

const workOptions = [
  { value: 'jobOffer', en: 'I have a job offer from a US employer', zh: '我有美国雇主的录用通知' },
  { value: 'employed', en: 'Currently employed in the US', zh: '目前在美国工作' },
  { value: 'multinational', en: 'Working for a multinational company', zh: '在跨国公司工作' },
  { value: 'selfEmployed', en: 'Self-employed / startup founder', zh: '自雇/创业者' },
  { value: 'searching', en: 'Still searching for employment', zh: '还在找工作' },
  { value: 'capExempt', en: 'Working at a university/nonprofit', zh: '在大学/非营利组织工作' },
];

function renderProgressBar(step: number, total: number): string {
  const pct = Math.round((step / total) * 100);
  return `<div style="margin-bottom:24px">
    <div style="display:flex;justify-content:space-between;font-size:14px;color:var(--text-secondary);margin-bottom:8px">
      <span>${tl({ en: `Step ${step} of ${total}`, zh: `第${step}步，共${total}步` })}</span>
      <span>${pct}%</span>
    </div>
    <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${tl({ en: `Step ${step} of ${total}`, zh: `第${step}步，共${total}步` })}"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
  </div>`;
}

function renderStep(container: HTMLElement, state: PathwayState) {
  const lang = currentLang();
  let stepHtml = '';

  if (state.step === 1) {
    const opts = [
      { v: 'bachelors', en: "Bachelor's", zh: '本科' },
      { v: 'masters', en: "Master's", zh: '硕士' },
      { v: 'phd', en: 'PhD / Doctorate', zh: '博士' },
      { v: 'professional', en: 'Professional (JD, MD)', zh: '专业学位（JD、MD）' },
    ];
    stepHtml = `
      <h2 style="font-size:22px;font-weight:700;margin-bottom:8px">${tl({ en: 'What is your highest degree level?', zh: '你的最高学历是什么？' })}</h2>
      <p style="font-size:14px;color:var(--text-secondary);margin-bottom:20px">${tl({ en: 'This affects your H-1B cap pool and EB category eligibility.', zh: '这会影响你的H-1B配额池和EB类别资格。' })}</p>
      <div role="radiogroup" aria-label="${tl({ en: 'Degree level', zh: '学历等级' })}" style="display:flex;flex-direction:column;gap:12px">
        ${opts.map(o => `<button class="card card-hover" data-value="${o.v}" role="radio" aria-checked="${state.degree === o.v}" style="text-align:left;cursor:pointer;border:2px solid ${state.degree === o.v ? 'var(--primary)' : 'transparent'};padding:16px 20px;font-size:16px;font-weight:500">
          ${lang === 'en' ? o.en : o.zh}
        </button>`).join('')}
      </div>`;
  } else if (state.step === 2) {
    const fieldOpts = fields.map(f => `<option value="${f.value}" ${state.field === f.value ? 'selected' : ''}>${lang === 'en' ? f.label : f.labelZh}${f.isStem ? ' (STEM)' : ''}</option>`).join('');
    stepHtml = `
      <h2 style="font-size:22px;font-weight:700;margin-bottom:8px">${tl({ en: 'What is your field of study?', zh: '你的专业领域是什么？' })}</h2>
      <p style="font-size:14px;color:var(--text-secondary);margin-bottom:20px">${tl({ en: 'STEM fields qualify for the 24-month STEM OPT extension.', zh: 'STEM专业可申请24个月的STEM OPT延期。' })}</p>
      <select id="field-select" style="font-size:16px">
        <option value="">${tl({ en: 'Select your field...', zh: '选择你的专业...' })}</option>
        ${fieldOpts}
      </select>`;
  } else if (state.step === 3) {
    const countryOpts = countries.map(c => `<option value="${c.value}" ${state.country === c.value ? 'selected' : ''}>${lang === 'en' ? c.label : c.labelZh}</option>`).join('');
    stepHtml = `
      <h2 style="font-size:22px;font-weight:700;margin-bottom:8px">${tl({ en: 'What is your country of birth?', zh: '你的出生国是哪里？' })}</h2>
      <p style="font-size:14px;color:var(--text-secondary);margin-bottom:20px">${tl({ en: "This determines your green card queue — it's based on birthplace, not citizenship.", zh: '这决定了你的绿卡排队顺序——按出生地，不按国籍。' })}</p>
      <select id="country-select" style="font-size:16px">
        <option value="">${tl({ en: 'Select your country...', zh: '选择你的出生国...' })}</option>
        ${countryOpts}
      </select>`;
  } else if (state.step === 4) {
    stepHtml = `
      <h2 style="font-size:22px;font-weight:700;margin-bottom:8px">${tl({ en: 'Which of these do you have?', zh: '你有以下哪些成就？' })}</h2>
      <p style="font-size:14px;color:var(--text-secondary);margin-bottom:20px">${tl({ en: 'Check all that apply. These help determine O-1 and EB-1 eligibility.', zh: '选择所有适用项。这些帮助判断O-1和EB-1的资格。' })}</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${achievementOptions.map(a => `<label class="checkbox-item" style="padding:12px 16px;background:var(--surface);border-radius:12px;border:1px solid var(--border);cursor:pointer">
          <input type="checkbox" value="${a.value}" ${state.achievements.includes(a.value) ? 'checked' : ''}>
          <span style="font-size:15px">${lang === 'en' ? a.en : a.zh}</span>
        </label>`).join('')}
      </div>`;
  } else if (state.step === 5) {
    stepHtml = `
      <h2 style="font-size:22px;font-weight:700;margin-bottom:8px">${tl({ en: 'What is your current work situation?', zh: '你目前的工作情况是什么？' })}</h2>
      <p style="font-size:14px;color:var(--text-secondary);margin-bottom:20px">${tl({ en: 'Check all that apply.', zh: '选择所有适用项。' })}</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${workOptions.map(w => `<label class="checkbox-item" style="padding:12px 16px;background:var(--surface);border-radius:12px;border:1px solid var(--border);cursor:pointer">
          <input type="checkbox" value="${w.value}" ${state.workSituation.includes(w.value) ? 'checked' : ''}>
          <span style="font-size:15px">${lang === 'en' ? w.en : w.zh}</span>
        </label>`).join('')}
      </div>`;
  }

  const isFirst = state.step === 1;
  const isLast = state.step === 5;

  container.innerHTML = `<div class="fade-in" style="max-width:640px;margin:0 auto;padding:24px 20px 120px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
      <a href="/" style="color:var(--text-secondary);display:flex;align-items:center;gap:4px;font-size:14px">
        <i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${t('common.backHome')}
      </a>
    </div>
    <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:10px">
      <i data-lucide="compass" style="width:28px;height:28px;color:var(--primary)"></i>
      ${tl({ en: 'Pathway Finder', zh: '路径推荐' })}
    </h1>
    <p style="color:var(--text-secondary);margin-bottom:24px">${tl({ en: "Let's find the best immigration options for your situation.", zh: '让我们为你找到最适合的移民选项。' })}</p>
    ${renderProgressBar(state.step, 5)}
    <div class="card" style="padding:28px">${stepHtml}</div>
    <div style="display:flex;justify-content:space-between;margin-top:20px">
      ${isFirst ? '<div></div>' : `<button class="btn-ghost" id="prev-btn"><i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${tl({ en: 'Back', zh: '返回' })}</button>`}
      <button class="btn-primary" id="next-btn">${isLast ? tl({ en: 'See Results', zh: '查看结果' }) : tl({ en: 'Next', zh: '下一步' })} ${isLast ? '' : '<i data-lucide="arrow-right" style="width:16px;height:16px"></i>'}</button>
    </div>
  </div>`;

  activateIcons();

  // Bind events
  if (state.step === 1) {
    container.querySelectorAll('[data-value]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.degree = (btn as HTMLElement).dataset.value!;
        setState(state);
        renderStep(container, state);
      });
    });
  }
  if (state.step === 2) {
    document.getElementById('field-select')?.addEventListener('change', (e) => {
      state.field = (e.target as HTMLSelectElement).value;
      setState(state);
    });
  }
  if (state.step === 3) {
    document.getElementById('country-select')?.addEventListener('change', (e) => {
      state.country = (e.target as HTMLSelectElement).value;
      setState(state);
    });
  }
  if (state.step === 4) {
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(c => (c as HTMLInputElement).value);
        state.achievements = checked;
        setState(state);
      });
    });
  }
  if (state.step === 5) {
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(c => (c as HTMLInputElement).value);
        state.workSituation = checked;
        setState(state);
      });
    });
  }

  document.getElementById('prev-btn')?.addEventListener('click', () => {
    state.step = Math.max(1, state.step - 1);
    setState(state);
    renderStep(container, state);
  });

  document.getElementById('next-btn')?.addEventListener('click', () => {
    const showValidation = () => {
      const existing = container.querySelector('.validation-msg');
      if (existing) existing.remove();
      const msg = document.createElement('p');
      msg.className = 'validation-msg';
      msg.style.cssText = 'color:var(--danger);font-size:14px;text-align:center;margin-top:12px;animation:fadeIn 150ms ease';
      msg.textContent = (state.step >= 4)
        ? tl({ en: 'Please select at least one item to continue.', zh: '请至少选择一项以继续。' })
        : tl({ en: 'Please select an option to continue.', zh: '请选择一个选项以继续。' });
      container.querySelector('.card')?.appendChild(msg);
    };
    if (state.step === 1 && !state.degree) { showValidation(); return; }
    if (state.step === 2 && !state.field) { showValidation(); return; }
    if (state.step === 3 && !state.country) { showValidation(); return; }
    if (state.step === 4 && state.achievements.length === 0) { showValidation(); return; }
    if (state.step === 5) {
      renderResults(container, state);
    } else {
      state.step = Math.min(5, state.step + 1);
      setState(state);
      renderStep(container, state);
    }
  });
}

interface PathwayResult {
  id: string;
  name: string;
  nameZh: string;
  match: 'strong' | 'possible' | 'weak';
  pros: { en: string; zh: string }[];
  cons: { en: string; zh: string }[];
  route: string;
}

function computePathways(state: PathwayState): PathwayResult[] {
  const results: PathwayResult[] = [];
  const ach = state.achievements;
  const work = state.workSituation;
  const isStem = fields.find(f => f.value === state.field)?.isStem ?? false;
  const hasAdvDegree = ['masters', 'phd', 'professional'].includes(state.degree);
  const achievementCount = ach.length;
  const hasJob = work.includes('jobOffer') || work.includes('employed');
  const isMulti = work.includes('multinational');
  const isCapExempt = work.includes('capExempt');
  const countryObj = countries.find(c => c.value === state.country);
  const backlog = countryObj?.backlogCategory || 'row';

  // H-1B
  const h1bMatch = hasJob || work.includes('searching') ? (isCapExempt ? 'strong' : 'possible') : 'weak';
  results.push({
    id: 'h1b', name: 'H-1B Specialty Occupation', nameZh: 'H-1B专业职业签证',
    match: h1bMatch as any,
    pros: [
      { en: 'Most common work visa pathway', zh: '最常见的工作签证途径' },
      { en: 'Employer-sponsored, well-established process', zh: '雇主担保，流程成熟' },
      ...(hasAdvDegree ? [{ en: 'Advanced degree pool (extra 20,000 slots)', zh: '高学历配额池（额外20,000个名额）' }] : []),
      ...(isCapExempt ? [{ en: 'Cap-exempt — no lottery needed!', zh: '无需抽签——免配额限制！' }] : []),
    ],
    cons: [
      ...(!isCapExempt ? [{ en: 'Lottery selection (~35% rate in FY2026)', zh: '需要抽签（FY2026中签率约35%）' }] : []),
      { en: 'Weighted lottery favors higher wages (FY2027+)', zh: '加权抽签偏向高薪（FY2027起）' },
      { en: '6-year max stay (unless green card pending)', zh: '最长6年（除非绿卡申请中）' },
    ],
    route: '/h1b',
  });

  // O-1A
  const o1Match = achievementCount >= 3 ? 'strong' : achievementCount >= 1 ? 'possible' : 'weak';
  results.push({
    id: 'o1', name: 'O-1A Extraordinary Ability', nameZh: 'O-1A杰出人才签证',
    match: o1Match as any,
    pros: [
      { en: 'No lottery, no annual cap, file anytime', zh: '无抽签、无年度配额、随时可申请' },
      { en: '~92-94% approval rate for well-prepared cases', zh: '准备充分的案件批准率约92-94%' },
      { en: 'Unlimited extensions', zh: '无限延期' },
      ...(achievementCount >= 3 ? [{ en: `You checked ${achievementCount} achievement types — strong foundation!`, zh: `你勾选了${achievementCount}项成就类型——基础扎实！` }] : []),
    ],
    cons: [
      { en: 'Must prove extraordinary ability (3 of 8 criteria)', zh: '需证明杰出能力（8项标准中的3项）' },
      { en: 'Requires employer or agent to file', zh: '需雇主或代理人提交申请' },
      ...(achievementCount < 3 ? [{ en: 'You may need more evidence — check the Evidence Builder', zh: '你可能需要更多证据——查看证据清单' }] : []),
    ],
    route: '/o1-assess',
  });

  // EB-2 NIW
  const niwMatch = hasAdvDegree && (achievementCount >= 2 || isStem) ? 'strong' : hasAdvDegree ? 'possible' : 'weak';
  results.push({
    id: 'niw', name: 'EB-2 NIW (National Interest Waiver)', nameZh: 'EB-2 NIW（国家利益豁免）',
    match: niwMatch as any,
    pros: [
      { en: 'Self-petition — no employer needed', zh: '可自行申请——无需雇主' },
      { en: 'No PERM labor certification required', zh: '无需PERM劳工认证' },
      ...(backlog === 'row' ? [{ en: 'Priority date is current for your country!', zh: '你的国家排期为当前！' }] : []),
      ...(isStem ? [{ en: 'STEM background strengthens national interest case', zh: 'STEM背景有助于国家利益论证' }] : []),
    ],
    cons: [
      ...(!hasAdvDegree ? [{ en: "Typically requires a Master's degree or higher", zh: '通常需要硕士或以上学位' }] : []),
      ...(backlog === 'india' ? [{ en: 'EB-2 India backlog: 12+ years', zh: 'EB-2印度排期：12年以上' }] : []),
      ...(backlog === 'china' ? [{ en: 'EB-2 China backlog: 5-8 years', zh: 'EB-2中国排期：5-8年' }] : []),
      { en: 'Must pass the Dhanasar three-prong test', zh: '需通过Dhanasar三要素测试' },
    ],
    route: '/eb-compare',
  });

  // EB-1A
  const eb1aMatch = achievementCount >= 4 ? 'strong' : achievementCount >= 2 ? 'possible' : 'weak';
  results.push({
    id: 'eb1a', name: 'EB-1A Extraordinary Ability (Green Card)', nameZh: 'EB-1A杰出人才（绿卡）',
    match: eb1aMatch as any,
    pros: [
      { en: 'Self-petition, no employer/PERM/job offer needed', zh: '自行申请，无需雇主/PERM/工作offer' },
      { en: 'Fastest green card if you qualify', zh: '如果符合条件，是最快的绿卡途径' },
      ...(backlog === 'india' ? [{ en: 'EB-1 India: 2-3 year wait (vs 12+ for EB-2)', zh: 'EB-1印度：等待2-3年（而EB-2为12年+）' }] : []),
      ...(backlog !== 'india' && backlog !== 'china' ? [{ en: 'Priority date current for your country', zh: '你的国家排期为当前' }] : []),
    ],
    cons: [
      { en: 'Highest evidentiary standard (3 of 10 criteria)', zh: '最高举证标准（10项标准中的3项）' },
      ...(achievementCount < 3 ? [{ en: 'You may need more evidence based on your profile', zh: '根据你的情况，你可能需要更多证据' }] : []),
    ],
    route: '/eb-compare',
  });

  // Employer-sponsored EB-2/EB-3
  if (hasJob) {
    results.push({
      id: 'eb2perm', name: 'EB-2/EB-3 Employer-Sponsored', nameZh: 'EB-2/EB-3雇主担保',
      match: 'possible',
      pros: [
        { en: 'Most common green card pathway', zh: '最常见的绿卡途径' },
        { en: 'Lower evidentiary burden than EB-1', zh: '举证要求低于EB-1' },
        { en: 'Well-established employer processes', zh: '雇主流程成熟' },
      ],
      cons: [
        { en: 'PERM process adds 1-2 years', zh: 'PERM流程增加1-2年' },
        { en: 'Tied to specific employer during process', zh: '流程期间绑定特定雇主' },
        ...(backlog === 'india' ? [{ en: 'Severe backlog for India (12+ years EB-2)', zh: '印度严重积压（EB-2超过12年）' }] : []),
        ...(backlog === 'china' ? [{ en: 'China backlog: 5-8 years', zh: '中国积压：5-8年' }] : []),
      ],
      route: '/eb-compare',
    });
  }

  // L-1 if multinational
  if (isMulti) {
    results.push({
      id: 'l1', name: 'L-1 Intracompany Transfer', nameZh: 'L-1公司内部调动',
      match: 'possible',
      pros: [
        { en: 'No lottery, no annual cap', zh: '无抽签、无年度配额' },
        { en: 'Can lead to EB-1C green card', zh: '可通往EB-1C绿卡' },
      ],
      cons: [
        { en: 'Requires 1 year of employment abroad in last 3 years', zh: '需在过去3年中有1年海外工作经验' },
        { en: 'Must be in managerial/executive/specialized role', zh: '必须是管理/高管/专业知识岗位' },
      ],
      route: '/employer',
    });
  }

  // STEM OPT bridge
  if (isStem && !work.includes('employed')) {
    results.push({
      id: 'stemopt', name: 'STEM OPT Extension (Bridge)', nameZh: 'STEM OPT延期（过渡策略）',
      match: 'strong',
      pros: [
        { en: '36 total months of work authorization', zh: '共36个月工作授权' },
        { en: 'Up to 3 H-1B lottery attempts', zh: '最多3次H-1B抽签机会' },
        { en: 'Time to build O-1/EB-1 evidence', zh: '有时间积累O-1/EB-1证据' },
      ],
      cons: [
        { en: 'Employer must be E-Verify enrolled', zh: '雇主必须注册E-Verify' },
        { en: '150-day cumulative unemployment limit', zh: '累计失业不超过150天' },
      ],
      route: '/timeline',
    });
  }

  const order = { strong: 0, possible: 1, weak: 2 };
  results.sort((a, b) => order[a.match] - order[b.match]);
  return results;
}

function renderResults(container: HTMLElement, state: PathwayState) {
  const lang = currentLang();
  const pathways = computePathways(state);

  const matchLabel = (m: string) => {
    if (m === 'strong') return `<span class="badge badge-green">${tl({ en: 'Strong Match', zh: '强烈推荐' })}</span>`;
    if (m === 'possible') return `<span class="badge badge-amber">${tl({ en: 'Possible', zh: '有可能' })}</span>`;
    return `<span class="badge badge-red">${tl({ en: 'Needs Work', zh: '需准备' })}</span>`;
  };

  const cardsHtml = pathways.map(p => `
    <div class="result-card ${p.match === 'strong' ? 'green' : p.match === 'possible' ? 'amber' : 'red'}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:12px">
        <h3 style="font-size:18px;font-weight:600;margin:0">${lang === 'en' ? p.name : p.nameZh}</h3>
        ${matchLabel(p.match)}
      </div>
      <div class="pros-cons-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div>
          <h4 style="font-size:13px;font-weight:600;color:var(--success);margin:0 0 6px">${tl({ en: 'Pros', zh: '优势' })}</h4>
          <ul style="margin:0;padding-left:18px;font-size:14px;color:var(--text-secondary)">
            ${p.pros.map(pr => `<li style="margin-bottom:4px">${lang === 'en' ? pr.en : pr.zh}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h4 style="font-size:13px;font-weight:600;color:var(--warning);margin:0 0 6px">${tl({ en: 'Considerations', zh: '注意事项' })}</h4>
          <ul style="margin:0;padding-left:18px;font-size:14px;color:var(--text-secondary)">
            ${p.cons.map(c => `<li style="margin-bottom:4px">${lang === 'en' ? c.en : c.zh}</li>`).join('')}
          </ul>
        </div>
      </div>
      <a href="${p.route}" class="btn-primary" style="font-size:14px;padding:8px 16px;${p.match === 'strong' ? 'background:var(--success)' : p.match === 'weak' ? 'background:var(--text-secondary)' : ''}">
        ${p.match === 'strong'
          ? tl({ en: 'Start This Path', zh: '开始这条路径' })
          : p.match === 'possible'
            ? tl({ en: 'Learn More', zh: '了解更多' })
            : tl({ en: 'See Requirements', zh: '查看要求' })} <i data-lucide="arrow-right" style="width:14px;height:14px"></i>
      </a>
    </div>
  `).join('');

  container.innerHTML = `<div class="fade-in" style="max-width:720px;margin:0 auto;padding:24px 20px 120px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
      <a href="/" style="color:var(--text-secondary);display:flex;align-items:center;gap:4px;font-size:14px">
        <i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${t('common.backHome')}
      </a>
    </div>
    <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:10px">
      <i data-lucide="compass" style="width:28px;height:28px;color:var(--primary)"></i>
      ${tl({ en: 'Your Recommended Pathways', zh: '为你推荐的路径' })}
    </h1>
    <p style="color:var(--text-secondary);margin-bottom:24px">${tl({ en: 'Based on your profile, here are your options — ranked by viability.', zh: '根据你的背景，以下是你的选项——按可行性排序。' })}</p>
    ${cardsHtml}
    <div style="margin-top:24px;text-align:center">
      <button class="btn-ghost" id="restart-btn"><i data-lucide="rotate-ccw" style="width:16px;height:16px"></i> ${tl({ en: 'Start Over', zh: '重新开始' })}</button>
    </div>
  </div>
  ${renderDisclaimer()}`;

  activateIcons();

  document.getElementById('restart-btn')?.addEventListener('click', () => {
    setState({ ...defaultState });
    renderStep(container, { ...defaultState });
  });
}

export function renderPathway(container: HTMLElement) {
  const state = getState();
  renderStep(container, state);
}

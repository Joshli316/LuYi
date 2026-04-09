import { t, tl, currentLang } from '../i18n';
import { saveState, loadState } from '../utils/storage';
import { renderDisclaimer, activateIcons } from '../utils/ui';

// ---------------------------------------------------------------------------
// Types & state
// ---------------------------------------------------------------------------

interface TimelineState {
  graduationDate: string; // "YYYY-MM"
  yearInSchool: string;
  degreeLevel: string;
  fieldType: string; // "stem" | "non-stem"
  targetPathway: string; // "h1b" | "o1" | "niw" | "all"
  generated: boolean;
}

const defaultState: TimelineState = {
  graduationDate: '',
  yearInSchool: '',
  degreeLevel: '',
  fieldType: '',
  targetPathway: 'all',
  generated: false,
};

function getState(): TimelineState {
  return loadState<TimelineState>('timeline') || { ...defaultState };
}

function setState(s: TimelineState) {
  saveState('timeline', s);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function addMonths(dateStr: string, months: number): Date {
  const [y, m] = dateStr.split('-').map(Number);
  const d = new Date(y, m - 1 + months, 1);
  return d;
}

function formatMonth(d: Date): string {
  const lang = currentLang();
  if (lang === 'zh') {
    return `${d.getFullYear()}年${d.getMonth() + 1}月`;
  }
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

function monthsBetween(d1: Date, d2: Date): number {
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
}

function marchOf(year: number): Date {
  return new Date(year, 2, 1); // March
}

// ---------------------------------------------------------------------------
// Milestone generation
// ---------------------------------------------------------------------------

interface Milestone {
  date: Date;
  name: { en: string; zh: string };
  description: { en: string; zh: string };
  pathways: string[]; // which pathways this applies to
}

function generateMilestones(state: TimelineState): Milestone[] {
  const gradDate = addMonths(state.graduationDate, 0);
  const gradYear = gradDate.getFullYear();
  const gradMonth = gradDate.getMonth();
  const isStem = state.fieldType === 'stem';
  const milestones: Milestone[] = [];

  // O-1 Evidence Building Start (freshman year, ~4 years before graduation)
  const o1EvidenceStart = addMonths(state.graduationDate, -48);
  milestones.push({
    date: o1EvidenceStart,
    name: { en: 'O-1 Evidence Building Start', zh: 'O-1 证据积累开始' },
    description: {
      en: 'Begin collecting evidence: publications, awards, media coverage, peer reviews. Early is better.',
      zh: '开始收集证据：论文发表、奖项、媒体报道、同行评审。越早越好。',
    },
    pathways: ['o1', 'all'],
  });

  // Immigration Attorney Consultation (junior year, ~2 years before graduation)
  const attorneyConsult = addMonths(state.graduationDate, -24);
  milestones.push({
    date: attorneyConsult,
    name: { en: 'Immigration Attorney Consultation', zh: '移民律师咨询' },
    description: {
      en: 'Meet with an immigration attorney to discuss your options and create a personalized plan.',
      zh: '与移民律师面谈，讨论你的选项并制定个性化计划。',
    },
    pathways: ['h1b', 'o1', 'niw', 'all'],
  });

  // OPT Application (3 months before graduation)
  const optApp = addMonths(state.graduationDate, -3);
  milestones.push({
    date: optApp,
    name: { en: 'OPT Application', zh: 'OPT 申请' },
    description: {
      en: 'Apply for Optional Practical Training (OPT). You can file up to 90 days before graduation.',
      zh: '申请OPT（选择性实习训练）。最早可在毕业前90天提交。',
    },
    pathways: ['h1b', 'o1', 'niw', 'all'],
  });

  // H-1B Registration — March before or after graduation
  // If graduating in May or later, the March before graduation works
  // If graduating in Jan-Feb, use March of same year
  const h1bYear1 = gradMonth >= 3 ? gradYear : gradYear;
  const h1bReg1 = marchOf(h1bYear1);
  // If the March is before graduation and more than a year out, use next March
  const h1bRegDate = h1bReg1 < addMonths(state.graduationDate, -12) ? marchOf(gradYear) : h1bReg1;
  // Adjust: first H-1B attempt is the March closest to graduation
  const firstH1bMarch = gradMonth >= 3 ? marchOf(gradYear) : marchOf(gradYear);
  milestones.push({
    date: firstH1bMarch,
    name: { en: 'H-1B Registration (1st Attempt)', zh: 'H-1B 注册（第1次抽签）' },
    description: {
      en: 'Employer registers for H-1B lottery in March. Selection rate ~35% (FY2026). Start date Oct 1.',
      zh: '雇主在3月注册H-1B抽签。中签率约35%（FY2026）。入职日期10月1日。',
    },
    pathways: ['h1b', 'all'],
  });

  // Graduation
  milestones.push({
    date: gradDate,
    name: { en: 'Graduation', zh: '毕业' },
    description: {
      en: 'OPT clock starts. You have 12 months of initial OPT work authorization.',
      zh: 'OPT开始计时。你有12个月的初始OPT工作授权。',
    },
    pathways: ['h1b', 'o1', 'niw', 'all'],
  });

  // STEM OPT Extension (9-10 months after graduation, if STEM)
  if (isStem) {
    const stemOpt = addMonths(state.graduationDate, 10);
    milestones.push({
      date: stemOpt,
      name: { en: 'STEM OPT Extension Application', zh: 'STEM OPT 延期申请' },
      description: {
        en: 'Apply for 24-month STEM OPT extension before initial OPT expires. Total 36 months of work authorization.',
        zh: '在初始OPT到期前申请24个月STEM OPT延期。共36个月工作授权。',
      },
      pathways: ['h1b', 'all'],
    });
  }

  // Second H-1B Attempt (March, year 2)
  const secondH1b = marchOf(gradYear + 1);
  milestones.push({
    date: secondH1b,
    name: { en: 'H-1B Registration (2nd Attempt)', zh: 'H-1B 注册（第2次抽签）' },
    description: {
      en: 'Second H-1B lottery attempt. If on OPT/STEM OPT, you remain authorized to work.',
      zh: '第二次H-1B抽签。如在OPT/STEM OPT期间，你仍可合法工作。',
    },
    pathways: ['h1b', 'all'],
  });

  // Third H-1B Attempt (March, year 3, if STEM)
  if (isStem) {
    const thirdH1b = marchOf(gradYear + 2);
    milestones.push({
      date: thirdH1b,
      name: { en: 'H-1B Registration (3rd Attempt)', zh: 'H-1B 注册（第3次抽签）' },
      description: {
        en: 'Third and final H-1B lottery attempt under STEM OPT. Consider backup options.',
        zh: '在STEM OPT期间的第三次也是最后一次H-1B抽签。考虑备选方案。',
      },
      pathways: ['h1b', 'all'],
    });
  }

  // PERM Initiation (1-2 years after graduation)
  const permStart = addMonths(state.graduationDate, 18);
  milestones.push({
    date: permStart,
    name: { en: 'PERM Initiation', zh: 'PERM 劳工认证启动' },
    description: {
      en: 'Employer begins PERM labor certification process. Takes 6-18 months. Required for EB-2/EB-3.',
      zh: '雇主开始PERM劳工认证流程。耗时6-18个月。EB-2/EB-3必需。',
    },
    pathways: ['h1b', 'all'],
  });

  // O-1 Petition (~2-3 years post-graduation)
  const o1Petition = addMonths(state.graduationDate, 30);
  milestones.push({
    date: o1Petition,
    name: { en: 'O-1 Petition Filing', zh: 'O-1 申请提交' },
    description: {
      en: 'When your evidence portfolio is ready (~3 of 8 criteria met), file O-1A petition. No cap, no lottery.',
      zh: '当你的证据材料准备好（满足8项中的3项），提交O-1A申请。无配额、无抽签。',
    },
    pathways: ['o1', 'all'],
  });

  // Green Card Filing (varies by pathway)
  const gcFiling = addMonths(state.graduationDate, 36);
  milestones.push({
    date: gcFiling,
    name: { en: 'Green Card Filing', zh: '绿卡申请' },
    description: {
      en: 'File I-140 petition. EB-2 NIW: self-petition anytime. EB-2/EB-3: after PERM approval. Timeline varies by country.',
      zh: '提交I-140申请。EB-2 NIW：随时可自行申请。EB-2/EB-3：PERM批准后。时间因国家而异。',
    },
    pathways: ['niw', 'h1b', 'all'],
  });

  // Filter by target pathway
  const filtered = state.targetPathway === 'all'
    ? milestones
    : milestones.filter(m => m.pathways.includes(state.targetPathway));

  // Sort by date
  filtered.sort((a, b) => a.date.getTime() - b.date.getTime());

  return filtered;
}

// ---------------------------------------------------------------------------
// Render: Input form
// ---------------------------------------------------------------------------

function renderForm(container: HTMLElement, state: TimelineState) {
  const lang = currentLang();

  const yearOptions = [
    { v: 'freshman', en: 'Freshman', zh: '大一' },
    { v: 'sophomore', en: 'Sophomore', zh: '大二' },
    { v: 'junior', en: 'Junior', zh: '大三' },
    { v: 'senior', en: 'Senior', zh: '大四' },
    { v: 'graduate', en: 'Graduate Student', zh: '研究生' },
  ];

  const degreeOptions = [
    { v: 'bachelors', en: "Bachelor's", zh: '本科' },
    { v: 'masters', en: "Master's", zh: '硕士' },
    { v: 'phd', en: 'PhD', zh: '博士' },
  ];

  const pathwayOptions = [
    { v: 'all', en: 'All Pathways', zh: '所有路径' },
    { v: 'h1b', en: 'H-1B', zh: 'H-1B' },
    { v: 'o1', en: 'O-1', zh: 'O-1' },
    { v: 'niw', en: 'EB-2 NIW', zh: 'EB-2 NIW' },
  ];

  container.innerHTML = `<div class="fade-in" style="max-width:640px;margin:0 auto;padding:24px 20px 120px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
      <a href="/" style="color:var(--text-secondary);display:flex;align-items:center;gap:4px;font-size:14px">
        <i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${t('common.backHome')}
      </a>
    </div>
    <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:10px">
      <i data-lucide="calendar-range" style="width:28px;height:28px;color:var(--primary)"></i>
      ${tl({ en: 'Timeline Planner', zh: '时间规划' })}
    </h1>
    <p style="color:var(--text-secondary);margin-bottom:24px">${tl({ en: 'Map your immigration milestones backward from your graduation date.', zh: '从毕业日期倒推，规划你的移民里程碑。' })}</p>

    <div class="card" style="padding:28px">
      <!-- Graduation Date -->
      <div style="margin-bottom:20px">
        <label style="display:block;font-weight:600;margin-bottom:8px;font-size:15px">${tl({ en: 'Expected Graduation Date', zh: '预计毕业日期' })}</label>
        <input type="month" id="tl-grad-date" value="${state.graduationDate}" min="${new Date().toISOString().slice(0,7)}" style="font-size:16px">
        <div id="tl-grad-date-error" class="tl-field-error" style="display:none;color:var(--danger);font-size:14px;margin-top:8px"></div>
      </div>

      <!-- Year in School -->
      <div style="margin-bottom:20px">
        <label style="display:block;font-weight:600;margin-bottom:8px;font-size:15px">${tl({ en: 'Current Year in School', zh: '当前年级' })}</label>
        <select id="tl-year" style="font-size:16px">
          <option value="">${tl({ en: 'Select...', zh: '请选择...' })}</option>
          ${yearOptions.map(o => `<option value="${o.v}" ${state.yearInSchool === o.v ? 'selected' : ''}>${lang === 'en' ? o.en : o.zh}</option>`).join('')}
        </select>
        <div id="tl-year-error" class="tl-field-error" style="display:none;color:var(--danger);font-size:14px;margin-top:8px"></div>
      </div>

      <!-- Degree Level -->
      <div style="margin-bottom:20px">
        <label style="display:block;font-weight:600;margin-bottom:8px;font-size:15px">${tl({ en: 'Degree Level', zh: '学位等级' })}</label>
        <select id="tl-degree" style="font-size:16px">
          <option value="">${tl({ en: 'Select...', zh: '请选择...' })}</option>
          ${degreeOptions.map(o => `<option value="${o.v}" ${state.degreeLevel === o.v ? 'selected' : ''}>${lang === 'en' ? o.en : o.zh}</option>`).join('')}
        </select>
        <div id="tl-degree-error" class="tl-field-error" style="display:none;color:var(--danger);font-size:14px;margin-top:8px"></div>
      </div>

      <!-- Field Type -->
      <div style="margin-bottom:20px">
        <label style="display:block;font-weight:600;margin-bottom:8px;font-size:15px">${tl({ en: 'Field Type', zh: '专业类型' })}</label>
        <div style="display:flex;gap:24px;margin-top:4px">
          <label class="checkbox-item" style="cursor:pointer">
            <input type="radio" name="field-type" value="stem" ${state.fieldType === 'stem' ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--primary);cursor:pointer">
            <span style="font-size:15px">STEM</span>
          </label>
          <label class="checkbox-item" style="cursor:pointer">
            <input type="radio" name="field-type" value="non-stem" ${state.fieldType === 'non-stem' ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--primary);cursor:pointer">
            <span style="font-size:15px">${tl({ en: 'Non-STEM', zh: '非STEM' })}</span>
          </label>
        </div>
        <div id="tl-field-error" class="tl-field-error" style="display:none;color:var(--danger);font-size:14px;margin-top:8px"></div>
      </div>

      <!-- Target Pathway -->
      <div style="margin-bottom:24px">
        <label style="display:block;font-weight:600;margin-bottom:8px;font-size:15px">${tl({ en: 'Target Pathway', zh: '目标路径' })}</label>
        <select id="tl-pathway" style="font-size:16px">
          ${pathwayOptions.map(o => `<option value="${o.v}" ${state.targetPathway === o.v ? 'selected' : ''}>${lang === 'en' ? o.en : o.zh}</option>`).join('')}
        </select>
      </div>

      <!-- Generate Button -->
      <button class="btn-primary" id="tl-generate" style="width:100%;justify-content:center">
        <i data-lucide="calendar-check" style="width:18px;height:18px"></i>
        ${tl({ en: 'Generate Timeline', zh: '生成时间线' })}
      </button>
    </div>
  </div>`;

  activateIcons();

  // Bind form inputs
  document.getElementById('tl-grad-date')?.addEventListener('change', (e) => {
    state.graduationDate = (e.target as HTMLInputElement).value;
    setState(state);
  });
  document.getElementById('tl-year')?.addEventListener('change', (e) => {
    state.yearInSchool = (e.target as HTMLSelectElement).value;
    setState(state);
  });
  document.getElementById('tl-degree')?.addEventListener('change', (e) => {
    state.degreeLevel = (e.target as HTMLSelectElement).value;
    setState(state);
  });
  document.querySelectorAll('input[name="field-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.fieldType = (e.target as HTMLInputElement).value;
      setState(state);
    });
  });
  document.getElementById('tl-pathway')?.addEventListener('change', (e) => {
    state.targetPathway = (e.target as HTMLSelectElement).value;
    setState(state);
  });

  // Generate button
  document.getElementById('tl-generate')?.addEventListener('click', () => {
    // Validate required fields
    // Clear previous validation errors
    const clearErrors = () => {
      container.querySelectorAll('.tl-field-error').forEach(el => {
        (el as HTMLElement).style.display = 'none';
        el.textContent = '';
      });
    };
    clearErrors();

    const showFieldError = (fieldId: string, msg: string) => {
      const el = document.getElementById(fieldId);
      if (el) { el.textContent = msg; el.style.display = 'block'; }
    };

    if (!state.graduationDate) {
      showFieldError('tl-grad-date-error', tl({ en: 'Please select your graduation date.', zh: '请选择毕业日期。' }));
      return;
    }

    // Validate graduation date is in the future
    const [gradY, gradM] = state.graduationDate.split('-').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-based
    if (gradY < currentYear || (gradY === currentYear && gradM <= currentMonth)) {
      showFieldError('tl-grad-date-error', tl({ en: 'Graduation date must be in the future.', zh: '毕业日期必须是未来的日期。' }));
      return;
    }

    if (!state.yearInSchool) {
      showFieldError('tl-year-error', tl({ en: 'Please select your current year in school.', zh: '请选择当前年级。' }));
      return;
    }
    if (!state.degreeLevel) {
      showFieldError('tl-degree-error', tl({ en: 'Please select your degree level.', zh: '请选择学位等级。' }));
      return;
    }
    if (!state.fieldType) {
      showFieldError('tl-field-error', tl({ en: 'Please select your field type.', zh: '请选择专业类型。' }));
      return;
    }
    state.generated = true;
    setState(state);
    renderTimeline(container);
  });
}

// ---------------------------------------------------------------------------
// Render: Timeline results
// ---------------------------------------------------------------------------

function renderResults(container: HTMLElement, state: TimelineState) {
  const lang = currentLang();
  const now = new Date();
  const milestones = generateMilestones(state);

  // Find next upcoming milestone
  const upcoming = milestones.find(m => m.date > now);
  const monthsUntilNext = upcoming ? monthsBetween(now, upcoming.date) : null;

  // Determine dot class for each milestone
  function dotClass(m: Milestone): string {
    const diff = monthsBetween(now, m.date);
    if (diff < 0) return 'done';       // past
    if (diff <= 6) return 'urgent';     // within 6 months
    return '';                          // future (default or amber handled via inline)
  }

  function dotStyle(m: Milestone): string {
    const diff = monthsBetween(now, m.date);
    // 6-12 months: amber (upcoming)
    if (diff > 6 && diff <= 12) {
      return 'border-color: var(--warning); background: var(--accent-light);';
    }
    return '';
  }

  function badgeHtml(m: Milestone): string {
    const diff = monthsBetween(now, m.date);
    if (diff < 0) return `<span class="badge badge-green" style="font-size:11px">${tl({ en: 'Done', zh: '已过' })}</span>`;
    if (diff <= 6) return `<span class="badge badge-red" style="font-size:11px">${tl({ en: 'Urgent', zh: '紧急' })}</span>`;
    if (diff <= 12) return `<span class="badge badge-amber" style="font-size:11px">${tl({ en: 'Upcoming', zh: '即将到来' })}</span>`;
    return '';
  }

  const countdownHtml = upcoming && monthsUntilNext !== null
    ? `<div class="card" style="padding:20px;margin-bottom:24px;background:var(--primary-light);border-color:var(--primary);text-align:center">
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap">
          <i data-lucide="alarm-clock" style="width:20px;height:20px;color:var(--primary)"></i>
          <span style="font-size:18px;font-weight:600;color:var(--primary-dark)">
            ${tl({
              en: `You have ${monthsUntilNext} month${monthsUntilNext !== 1 ? 's' : ''} until ${upcoming.name.en}`,
              zh: `距离${upcoming.name.zh}还有 ${monthsUntilNext} 个月`
            })}
          </span>
        </div>
      </div>`
    : '';

  const timelineHtml = milestones.map(m => `
    <div class="timeline-item">
      <div class="timeline-dot ${dotClass(m)}" style="${dotStyle(m)}"></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
        <span style="font-size:13px;font-weight:600;color:var(--primary)">${formatMonth(m.date)}</span>
        ${badgeHtml(m)}
      </div>
      <h3 style="font-size:16px;font-weight:600;margin:0 0 4px">${lang === 'en' ? m.name.en : m.name.zh}</h3>
      <p style="font-size:14px;color:var(--text-secondary);margin:0;line-height:1.5">${lang === 'en' ? m.description.en : m.description.zh}</p>
    </div>
  `).join('');

  const pathwayLabel = state.targetPathway === 'all'
    ? tl({ en: 'All Pathways', zh: '所有路径' })
    : state.targetPathway === 'h1b' ? 'H-1B'
    : state.targetPathway === 'o1' ? 'O-1'
    : 'EB-2 NIW';

  container.innerHTML = `<div class="fade-in" style="max-width:640px;margin:0 auto;padding:24px 20px 120px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
      <a href="/" style="color:var(--text-secondary);display:flex;align-items:center;gap:4px;font-size:14px">
        <i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${t('common.backHome')}
      </a>
    </div>
    <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:10px">
      <i data-lucide="calendar-range" style="width:28px;height:28px;color:var(--primary)"></i>
      ${tl({ en: 'Your Immigration Timeline', zh: '你的移民时间线' })}
    </h1>
    <p style="color:var(--text-secondary);margin-bottom:8px">
      ${tl({ en: 'Graduation:', zh: '毕业日期：' })} <strong>${formatMonth(addMonths(state.graduationDate, 0))}</strong>
      &nbsp;&middot;&nbsp;
      ${tl({ en: 'Field:', zh: '专业：' })} <strong>${state.fieldType === 'stem' ? 'STEM' : tl({ en: 'Non-STEM', zh: '非STEM' })}</strong>
      &nbsp;&middot;&nbsp;
      ${tl({ en: 'Pathway:', zh: '路径：' })} <strong>${pathwayLabel}</strong>
    </p>
    <p style="color:var(--text-secondary);font-size:13px;margin-bottom:24px">${t('common.lastUpdated')}</p>

    ${countdownHtml}

    <div style="margin-bottom:24px">
      ${timelineHtml}
    </div>

    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
      <button class="btn-ghost" id="tl-back-btn">
        <i data-lucide="settings-2" style="width:16px;height:16px"></i>
        ${tl({ en: 'Change Settings', zh: '修改设置' })}
      </button>
      <button class="btn-ghost" id="tl-reset-btn">
        <i data-lucide="rotate-ccw" style="width:16px;height:16px"></i>
        ${tl({ en: 'Start Over', zh: '重新开始' })}
      </button>
    </div>
  </div>
  ${renderDisclaimer()}`;

  activateIcons();

  document.getElementById('tl-back-btn')?.addEventListener('click', () => {
    state.generated = false;
    setState(state);
    renderForm(container, state);
  });

  document.getElementById('tl-reset-btn')?.addEventListener('click', () => {
    const fresh = { ...defaultState };
    setState(fresh);
    renderForm(container, fresh);
  });
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function renderTimeline(container: HTMLElement): void {
  const state = getState();
  if (state.generated && state.graduationDate) {
    renderResults(container, state);
  } else {
    renderForm(container, state);
  }
}

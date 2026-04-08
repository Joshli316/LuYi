import { t, tl, currentLang } from '../i18n';
import { o1Criteria } from '../data/o1-criteria';
import { saveState, loadState } from '../utils/storage';

const STORAGE_KEY = 'o1-builder';

interface BuilderState {
  checked: Record<string, boolean>; // key: "criterionId-actionIndex"
  expanded: Record<number, boolean>; // criterionId -> expanded
}

function getState(): BuilderState {
  return loadState<BuilderState>(STORAGE_KEY) || { checked: {}, expanded: {} };
}

function setState(s: BuilderState) {
  saveState(STORAGE_KEY, s);
}

function getCheckKey(criterionId: number, actionIdx: number): string {
  return `${criterionId}-${actionIdx}`;
}

export function renderO1Builder(container: HTMLElement): void {
  const state = getState();
  render(container, state);
}

function render(container: HTMLElement, state: BuilderState) {
  const lang = currentLang();

  // Calculate overall progress
  let totalActions = 0;
  let totalCompleted = 0;
  let criteriaWithProgress = 0;

  o1Criteria.forEach(c => {
    const actions = lang === 'en' ? c.actions : c.actionsZh;
    const count = actions.length;
    totalActions += count;
    let done = 0;
    for (let i = 0; i < count; i++) {
      if (state.checked[getCheckKey(c.id, i)]) {
        done++;
        totalCompleted++;
      }
    }
    if (done > 0) criteriaWithProgress++;
  });

  const overallPct = totalActions > 0 ? Math.round((totalCompleted / totalActions) * 100) : 0;

  // Build criteria sections
  const sections = o1Criteria.map(c => {
    const actions = lang === 'en' ? c.actions : c.actionsZh;
    const timeline = lang === 'en' ? c.timelineHint : c.timelineHintZh;
    const count = actions.length;
    let done = 0;
    for (let i = 0; i < count; i++) {
      if (state.checked[getCheckKey(c.id, i)]) done++;
    }

    const isExpanded = !!state.expanded[c.id];

    // Status icon
    let statusIcon: string;
    let statusColor: string;
    if (done === count) {
      statusIcon = 'check-circle';
      statusColor = 'var(--success)';
    } else if (done > 0) {
      statusIcon = 'minus-circle';
      statusColor = 'var(--warning)';
    } else {
      statusIcon = 'circle';
      statusColor = 'var(--text-secondary)';
    }

    const sectionPct = count > 0 ? Math.round((done / count) * 100) : 0;

    const checkboxes = actions.map((action, i) => {
      const key = getCheckKey(c.id, i);
      const isChecked = !!state.checked[key];
      return `<label class="checkbox-item" style="padding:12px 16px;background:var(--bg);border-radius:10px;border:1px solid var(--border);cursor:pointer;${isChecked ? 'opacity:0.7;text-decoration:line-through' : ''}">
        <input type="checkbox" data-key="${key}" ${isChecked ? 'checked' : ''}>
        <span style="font-size:14px;line-height:1.6">${action}</span>
      </label>`;
    }).join('');

    return `<div class="card" style="padding:0;margin-bottom:12px;overflow:hidden">
      <!-- Section Header (clickable) -->
      <button class="section-toggle" data-criterion-id="${c.id}" style="width:100%;padding:20px 24px;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:12px;text-align:left;color:var(--text);font-family:inherit">
        <i data-lucide="${statusIcon}" style="width:22px;height:22px;color:${statusColor};flex-shrink:0"></i>
        <div style="flex:1;min-width:0">
          <div style="font-size:16px;font-weight:600">${lang === 'en' ? c.name : c.nameZh}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:2px">
            ${tl({ en: `${done} of ${count} actions completed`, zh: `${count}项行动中已完成${done}项` })}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;flex-shrink:0">
          <span style="font-size:13px;font-weight:600;color:${statusColor}">${sectionPct}%</span>
          <i data-lucide="${isExpanded ? 'chevron-up' : 'chevron-down'}" style="width:18px;height:18px;color:var(--text-secondary)"></i>
        </div>
      </button>

      <!-- Section Content -->
      ${isExpanded ? `<div style="padding:0 24px 24px;border-top:1px solid var(--border)">
        <!-- Section progress bar -->
        <div class="progress-bar" style="margin:16px 0;height:6px">
          <div class="progress-bar-fill" style="width:${sectionPct}%"></div>
        </div>

        <!-- Action checkboxes -->
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
          ${checkboxes}
        </div>

        <!-- Timeline hint -->
        <div style="display:flex;align-items:center;gap:8px;padding:12px 16px;background:var(--primary-light);border-radius:10px;font-size:13px;color:var(--text-secondary)">
          <i data-lucide="clock" style="width:16px;height:16px;flex-shrink:0;color:var(--primary)"></i>
          <span>${timeline}</span>
        </div>
      </div>` : ''}
    </div>`;
  }).join('');

  container.innerHTML = `<div class="fade-in" style="max-width:720px;margin:0 auto;padding:24px 20px 120px">
    <a href="#/" style="color:var(--text-secondary);display:flex;align-items:center;gap:4px;font-size:14px;margin-bottom:20px">
      <i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${t('common.backHome')}
    </a>

    <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:10px">
      <i data-lucide="clipboard-check" style="width:28px;height:28px;color:var(--primary)"></i>
      ${t('tool.o1Builder')}
    </h1>
    <p style="color:var(--text-secondary);margin-bottom:24px">${tl({ en: 'Track your progress building evidence for each O-1A criterion. Check off actions as you complete them.', zh: '追踪你为每项O-1A标准积累证据的进度。完成后勾选各项行动。' })}</p>

    <!-- Overall Progress -->
    <div class="card" style="padding:24px;margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h2 style="font-size:18px;font-weight:600;margin:0;display:flex;align-items:center;gap:8px">
          <i data-lucide="target" style="width:18px;height:18px;color:var(--primary)"></i>
          ${tl({ en: 'Overall Progress', zh: '总体进度' })}
        </h2>
        <span style="font-size:24px;font-weight:700;color:var(--primary)">${overallPct}%</span>
      </div>
      <div class="progress-bar" style="height:10px;margin-bottom:12px">
        <div class="progress-bar-fill" style="width:${overallPct}%"></div>
      </div>
      <p style="font-size:14px;color:var(--text-secondary);margin:0">
        ${tl({
          en: `You've completed ${totalCompleted} of ${totalActions} actions across ${criteriaWithProgress} criteria.`,
          zh: `你已在${criteriaWithProgress}项标准中完成了${totalActions}项行动中的${totalCompleted}项。`,
        })}
      </p>
    </div>

    <!-- Criteria Sections -->
    ${sections}

    <!-- Link to assessment -->
    <div style="text-align:center;margin-top:24px">
      <a href="#/o1-assess" class="btn-ghost" style="font-size:14px">
        <i data-lucide="award" style="width:16px;height:16px"></i>
        ${tl({ en: 'Take the O-1 Self-Assessment', zh: '进行O-1自我评估' })}
      </a>
    </div>
  </div>`;

  (window as any).lucide?.createIcons();

  // Bind section toggles
  container.querySelectorAll('.section-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const cId = parseInt((btn as HTMLElement).dataset.criterionId!, 10);
      state.expanded[cId] = !state.expanded[cId];
      setState(state);
      render(container, state);
    });
  });

  // Bind checkboxes
  container.querySelectorAll('input[type="checkbox"][data-key]').forEach(cb => {
    cb.addEventListener('change', () => {
      const key = (cb as HTMLElement).dataset.key!;
      state.checked[key] = (cb as HTMLInputElement).checked;
      setState(state);
      render(container, state);
    });
  });
}

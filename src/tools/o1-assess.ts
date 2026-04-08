import { t, tl, currentLang } from '../i18n';
import { o1Criteria } from '../data/o1-criteria';
import { saveState, loadState } from '../utils/storage';
import { renderDisclaimer, activateIcons } from '../utils/ui';

type Answer = 'yes' | 'partially' | 'no';

interface AssessState {
  step: number; // 0-based index into criteria, 8 = results
  answers: Record<number, Answer>;
}

const STORAGE_KEY = 'o1-assess';

function getState(): AssessState {
  return loadState<AssessState>(STORAGE_KEY) || { step: 0, answers: {} };
}

function setState(s: AssessState) {
  saveState(STORAGE_KEY, s);
}

function renderProgressBar(step: number, total: number): string {
  const pct = Math.round((step / total) * 100);
  return `<div style="margin-bottom:24px">
    <div style="display:flex;justify-content:space-between;font-size:14px;color:var(--text-secondary);margin-bottom:8px">
      <span>${tl({ en: `Criterion ${step} of ${total}`, zh: `第${step}项，共${total}项` })}</span>
      <span>${pct}%</span>
    </div>
    <div class="progress-bar"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
  </div>`;
}

export function renderO1Assess(container: HTMLElement): void {
  const state = getState();

  if (state.step >= o1Criteria.length) {
    renderResults(container, state);
  } else {
    renderCriterion(container, state);
  }
}

function renderCriterion(container: HTMLElement, state: AssessState) {
  const lang = currentLang();
  const criterion = o1Criteria[state.step];
  const currentAnswer = state.answers[criterion.id] || null;

  const strongExamples = lang === 'en' ? criterion.strongExamples : criterion.strongExamplesZh;
  const weakExamples = lang === 'en' ? criterion.weakExamples : criterion.weakExamplesZh;

  container.innerHTML = `<div class="fade-in" style="max-width:640px;margin:0 auto;padding:24px 20px 120px">
    <a href="#/" style="color:var(--text-secondary);display:flex;align-items:center;gap:4px;font-size:14px;margin-bottom:20px">
      <i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${t('common.backHome')}
    </a>

    <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:10px">
      <i data-lucide="award" style="width:28px;height:28px;color:var(--primary)"></i>
      ${t('tool.o1Assess')}
    </h1>
    <p style="color:var(--text-secondary);margin-bottom:24px">${tl({ en: 'Walk through each of the 8 O-1A criteria to assess your case strength.', zh: '逐一走过O-1A的8项标准，评估你的案件强度。' })}</p>

    ${renderProgressBar(state.step + 1, o1Criteria.length)}

    <div class="card" style="padding:28px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <span class="badge badge-amber" style="font-size:12px">${tl({ en: `Criterion ${criterion.id}`, zh: `标准${criterion.id}` })}</span>
      </div>
      <h2 style="font-size:22px;font-weight:700;margin:8px 0">${lang === 'en' ? criterion.name : criterion.nameZh}</h2>
      <p style="font-size:15px;color:var(--text-secondary);margin-bottom:24px;line-height:1.7">
        ${lang === 'en' ? criterion.description : criterion.descriptionZh}
      </p>

      <!-- Strong Examples -->
      <div style="margin-bottom:20px">
        <h3 style="font-size:14px;font-weight:600;color:var(--success);margin:0 0 10px;display:flex;align-items:center;gap:6px">
          <i data-lucide="check-circle" style="width:16px;height:16px"></i>
          ${tl({ en: 'Strong Evidence Examples', zh: '强有力的证据示例' })}
        </h3>
        <ul style="margin:0;padding-left:20px;font-size:14px;color:var(--text-secondary);line-height:1.8">
          ${strongExamples.map(ex => `<li>${ex}</li>`).join('')}
        </ul>
      </div>

      <!-- Weak Examples -->
      <div style="margin-bottom:28px">
        <h3 style="font-size:14px;font-weight:600;color:var(--danger);margin:0 0 10px;display:flex;align-items:center;gap:6px">
          <i data-lucide="x-circle" style="width:16px;height:16px"></i>
          ${tl({ en: 'Weak Evidence (Likely Insufficient)', zh: '较弱的证据（可能不充分）' })}
        </h3>
        <ul style="margin:0;padding-left:20px;font-size:14px;color:var(--text-secondary);line-height:1.8">
          ${weakExamples.map(ex => `<li>${ex}</li>`).join('')}
        </ul>
      </div>

      <!-- Question -->
      <div style="border-top:1px solid var(--border);padding-top:24px">
        <h3 style="font-size:16px;font-weight:600;margin:0 0 16px">
          ${tl({ en: 'Do you have evidence for this criterion?', zh: '你有这项标准的证据吗？' })}
        </h3>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button class="answer-btn ${currentAnswer === 'yes' ? 'btn-primary' : 'btn-ghost'}" data-answer="yes" style="flex:1;min-width:100px;justify-content:center">
            <i data-lucide="check" style="width:16px;height:16px"></i>
            ${tl({ en: 'Yes', zh: '是' })}
          </button>
          <button class="answer-btn ${currentAnswer === 'partially' ? 'btn-primary' : 'btn-ghost'}" data-answer="partially" style="flex:1;min-width:100px;justify-content:center">
            <i data-lucide="minus" style="width:16px;height:16px"></i>
            ${tl({ en: 'Partially', zh: '部分' })}
          </button>
          <button class="answer-btn ${currentAnswer === 'no' ? 'btn-primary' : 'btn-ghost'}" data-answer="no" style="flex:1;min-width:100px;justify-content:center">
            <i data-lucide="x" style="width:16px;height:16px"></i>
            ${tl({ en: 'No', zh: '否' })}
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div style="display:flex;justify-content:space-between;margin-top:20px">
      ${state.step === 0
        ? '<div></div>'
        : `<button class="btn-ghost" id="prev-btn"><i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${tl({ en: 'Back', zh: '返回' })}</button>`
      }
      <button class="btn-primary" id="next-btn" ${!currentAnswer ? 'disabled' : ''}>
        ${state.step === o1Criteria.length - 1
          ? tl({ en: 'See Results', zh: '查看结果' })
          : tl({ en: 'Next', zh: '下一步' })
        }
        ${state.step < o1Criteria.length - 1 ? '<i data-lucide="arrow-right" style="width:16px;height:16px"></i>' : ''}
      </button>
    </div>
  </div>`;

  activateIcons();

  // Bind answer buttons
  container.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = (btn as HTMLElement).dataset.answer as Answer;
      state.answers[criterion.id] = answer;
      setState(state);
      renderCriterion(container, state);
    });
  });

  // Bind prev
  document.getElementById('prev-btn')?.addEventListener('click', () => {
    state.step = Math.max(0, state.step - 1);
    setState(state);
    renderCriterion(container, state);
  });

  // Bind next
  document.getElementById('next-btn')?.addEventListener('click', () => {
    if (!state.answers[criterion.id]) return;
    state.step += 1;
    setState(state);
    if (state.step >= o1Criteria.length) {
      renderResults(container, state);
    } else {
      renderCriterion(container, state);
    }
  });
}

function renderResults(container: HTMLElement, state: AssessState) {
  const lang = currentLang();

  const yesCount = o1Criteria.filter(c => state.answers[c.id] === 'yes').length;
  const partialCount = o1Criteria.filter(c => state.answers[c.id] === 'partially').length;
  const noCount = o1Criteria.filter(c => state.answers[c.id] === 'no').length;

  let messageColor: string;
  let messageIcon: string;
  let messageBadgeClass: string;
  let messageText: { en: string; zh: string };

  if (yesCount >= 3) {
    messageColor = 'var(--success)';
    messageIcon = 'trophy';
    messageBadgeClass = 'green';
    messageText = {
      en: 'You may have a strong O-1A case! You meet the typical threshold of 3+ criteria. Consult an immigration attorney to review your evidence.',
      zh: '你可能有一个强有力的O-1A申请！你达到了3项以上标准的典型门槛。建议咨询移民律师审查你的证据。',
    };
  } else if (yesCount >= 1) {
    messageColor = 'var(--warning)';
    messageIcon = 'trending-up';
    messageBadgeClass = 'amber';
    messageText = {
      en: "You're building a foundation — here's what to work on. Focus on strengthening your \"Partially\" criteria and building new evidence.",
      zh: '你正在打基础——以下是需要努力的方向。重点加强"部分"满足的标准，并积累新的证据。',
    };
  } else {
    messageColor = 'var(--danger)';
    messageIcon = 'compass';
    messageBadgeClass = 'red';
    messageText = {
      en: 'O-1A may not be the right path yet. Consider building evidence over time, or explore H-1B, EB-2 NIW, or other pathways that may better fit your current profile.',
      zh: 'O-1A目前可能还不是最佳路径。考虑逐步积累证据，或探索H-1B、EB-2 NIW或其他更适合你当前情况的路径。',
    };
  }

  const criteriaRows = o1Criteria.map(c => {
    const answer = state.answers[c.id] || 'no';
    let icon: string;
    let color: string;
    let label: { en: string; zh: string };
    if (answer === 'yes') {
      icon = 'check-circle';
      color = 'var(--success)';
      label = { en: 'Met', zh: '满足' };
    } else if (answer === 'partially') {
      icon = 'minus-circle';
      color = 'var(--warning)';
      label = { en: 'Partial', zh: '部分' };
    } else {
      icon = 'x-circle';
      color = 'var(--danger)';
      label = { en: 'Not Met', zh: '未满足' };
    }

    return `<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--border)">
      <i data-lucide="${icon}" style="width:22px;height:22px;color:${color};flex-shrink:0"></i>
      <div style="flex:1">
        <div style="font-weight:600;font-size:15px">${lang === 'en' ? c.name : c.nameZh}</div>
        <div style="font-size:13px;color:var(--text-secondary)">${lang === 'en' ? c.description : c.descriptionZh}</div>
      </div>
      <span class="badge badge-${answer === 'yes' ? 'green' : answer === 'partially' ? 'amber' : 'red'}" style="white-space:nowrap">
        ${lang === 'en' ? label.en : label.zh}
      </span>
    </div>`;
  }).join('');

  container.innerHTML = `<div class="fade-in" style="max-width:720px;margin:0 auto;padding:24px 20px 120px">
    <a href="#/" style="color:var(--text-secondary);display:flex;align-items:center;gap:4px;font-size:14px;margin-bottom:20px">
      <i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${t('common.backHome')}
    </a>

    <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:10px">
      <i data-lucide="award" style="width:28px;height:28px;color:var(--primary)"></i>
      ${tl({ en: 'Your O-1A Assessment Results', zh: '你的O-1A评估结果' })}
    </h1>
    <p style="color:var(--text-secondary);margin-bottom:24px">${tl({ en: 'Based on your self-assessment of the 8 O-1A criteria.', zh: '基于你对O-1A八项标准的自我评估。' })}</p>

    <!-- Score Summary -->
    <div class="result-card ${messageBadgeClass}" style="padding:28px;margin-bottom:20px">
      <div style="text-align:center;margin-bottom:20px">
        <i data-lucide="${messageIcon}" style="width:48px;height:48px;color:${messageColor}"></i>
      </div>
      <div style="display:flex;justify-content:center;gap:24px;margin-bottom:20px;flex-wrap:wrap">
        <div style="text-align:center">
          <div style="font-size:36px;font-weight:700;color:var(--success)">${yesCount}</div>
          <div style="font-size:13px;color:var(--text-secondary)">${tl({ en: 'Criteria Met', zh: '满足标准' })}</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:36px;font-weight:700;color:var(--warning)">${partialCount}</div>
          <div style="font-size:13px;color:var(--text-secondary)">${tl({ en: 'Partial', zh: '部分满足' })}</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:36px;font-weight:700;color:var(--danger)">${noCount}</div>
          <div style="font-size:13px;color:var(--text-secondary)">${tl({ en: 'Not Met', zh: '未满足' })}</div>
        </div>
      </div>
      <p style="font-size:15px;text-align:center;margin:0;line-height:1.7;color:var(--text)">
        ${lang === 'en' ? messageText.en : messageText.zh}
      </p>
    </div>

    <!-- Approval Rate -->
    <div class="card" style="padding:20px;margin-bottom:20px;text-align:center">
      <div style="display:flex;align-items:center;justify-content:center;gap:8px">
        <i data-lucide="trending-up" style="width:20px;height:20px;color:var(--success)"></i>
        <span style="font-size:15px">
          <strong>${tl({ en: 'O-1A Approval Rate: ~92-94%', zh: 'O-1A批准率：约92-94%' })}</strong>
          ${tl({ en: ' for well-prepared cases', zh: ' （准备充分的案件）' })}
        </span>
      </div>
    </div>

    <!-- Criteria Breakdown -->
    <div class="card" style="padding:24px;margin-bottom:20px">
      <h2 style="font-size:18px;font-weight:600;margin:0 0 8px">${tl({ en: 'Criteria Breakdown', zh: '标准详情' })}</h2>
      <p style="font-size:13px;color:var(--text-secondary);margin:0 0 16px">${tl({ en: 'USCIS requires evidence for at least 3 of 8 criteria.', zh: 'USCIS要求至少满足8项标准中的3项。' })}</p>
      ${criteriaRows}
    </div>

    <!-- Action Buttons -->
    <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px">
      <a href="#/o1-builder" class="btn-primary" style="justify-content:center;font-size:16px">
        <i data-lucide="clipboard-check" style="width:18px;height:18px"></i>
        ${tl({ en: 'Build Your Evidence Portfolio', zh: '构建你的证据材料' })}
      </a>
      <button class="btn-ghost" id="restart-btn" style="justify-content:center">
        <i data-lucide="rotate-ccw" style="width:16px;height:16px"></i>
        ${tl({ en: 'Start Over', zh: '重新评估' })}
      </button>
    </div>

    <div style="text-align:center;font-size:13px;color:var(--text-secondary);margin-bottom:20px">
      ${t('common.lastUpdated')}
    </div>
  </div>
  ${renderDisclaimer()}`;

  activateIcons();

  document.getElementById('restart-btn')?.addEventListener('click', () => {
    const fresh: AssessState = { step: 0, answers: {} };
    setState(fresh);
    renderO1Assess(container);
  });
}

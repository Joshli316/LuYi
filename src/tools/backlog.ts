import { t, tl, currentLang } from '../i18n';
import { visaBulletin, estimatedWaitTimes, historicalEB2India, historicalEB2China } from '../data/visa-bulletin';
import { countries } from '../data/countries';
import { saveState, loadState } from '../utils/storage';
import { renderDisclaimer, activateIcons } from '../utils/ui';

interface BacklogState {
  country: string;
  category: string;
}

function getState(): BacklogState {
  return loadState<BacklogState>('backlog') || { country: '', category: 'eb2' };
}

function setState(s: BacklogState) {
  saveState('backlog', s);
}

type BacklogCategoryKey = 'india' | 'china' | 'mexico' | 'philippines' | 'row';
type EBKey = 'eb1' | 'eb2' | 'eb3';

function getFAD(backlogCat: BacklogCategoryKey, ebCat: EBKey): string {
  const catData = visaBulletin.finalActionDates[ebCat];
  if (backlogCat === 'india') return catData.india;
  if (backlogCat === 'china') return catData.china;
  if (backlogCat === 'mexico') return catData.mexico;
  if (backlogCat === 'philippines') return catData.philippines;
  return catData.restOfWorld;
}

function getROWFAD(ebCat: EBKey): string {
  return visaBulletin.finalActionDates[ebCat].restOfWorld;
}

function getWaitTime(backlogCat: BacklogCategoryKey, ebCat: EBKey): string {
  if (backlogCat === 'india') return estimatedWaitTimes.india[ebCat];
  if (backlogCat === 'china') return estimatedWaitTimes.china[ebCat];
  return estimatedWaitTimes.row[ebCat];
}

function getWaitColor(waitTime: string): 'green' | 'amber' | 'red' {
  if (waitTime === 'Current') return 'green';
  // Parse "X-Y years" or "X+ years"
  const match = waitTime.match(/(\d+)/);
  if (!match) return 'amber';
  const years = parseInt(match[1], 10);
  if (years >= 5) return 'red';
  if (years >= 2) return 'amber';
  return 'green';
}

function renderInputSection(container: HTMLElement, state: BacklogState): void {
  const lang = currentLang();

  const countryOpts = countries.map(c =>
    `<option value="${c.value}" ${state.country === c.value ? 'selected' : ''}>${lang === 'en' ? c.label : c.labelZh}</option>`
  ).join('');

  const categories: { value: string; en: string; zh: string }[] = [
    { value: 'eb1', en: 'EB-1', zh: 'EB-1' },
    { value: 'eb2', en: 'EB-2', zh: 'EB-2' },
    { value: 'eb3', en: 'EB-3', zh: 'EB-3' },
  ];

  container.innerHTML = `<div class="fade-in" style="max-width:720px;margin:0 auto;padding:24px 20px 120px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
      <a href="#/" style="color:var(--text-secondary);display:flex;align-items:center;gap:4px;font-size:14px">
        <i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${t('common.backHome')}
      </a>
    </div>

    <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:10px">
      <i data-lucide="clock" style="width:28px;height:28px;color:var(--primary)"></i>
      ${t('tool.backlog')}
    </h1>
    <p style="color:var(--text-secondary);margin-bottom:24px">${tl({ en: 'Check current green card wait times based on your country of birth and EB category.', zh: '根据你的出生国和EB类别查看当前绿卡排期。' })}</p>

    <div class="card" style="padding:24px;margin-bottom:24px">
      <div style="margin-bottom:20px">
        <label style="font-size:14px;font-weight:600;display:block;margin-bottom:8px">
          <i data-lucide="globe" style="width:16px;height:16px;vertical-align:-3px"></i>
          ${tl({ en: 'Country of Birth', zh: '出生国' })}
        </label>
        <select id="backlog-country" style="font-size:16px;width:100%">
          <option value="">${tl({ en: 'Select your country...', zh: '选择你的出生国...' })}</option>
          ${countryOpts}
        </select>
      </div>

      <div>
        <label style="font-size:14px;font-weight:600;display:block;margin-bottom:12px">
          <i data-lucide="layers" style="width:16px;height:16px;vertical-align:-3px"></i>
          ${tl({ en: 'EB Category', zh: 'EB类别' })}
        </label>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${categories.map(cat => `
            <label style="flex:1;min-width:80px;cursor:pointer">
              <input type="radio" name="eb-category" value="${cat.value}" ${state.category === cat.value ? 'checked' : ''} style="display:none">
              <div class="card card-hover" style="text-align:center;padding:12px 16px;font-size:16px;font-weight:600;border:2px solid ${state.category === cat.value ? 'var(--primary)' : 'transparent'};transition:border-color 200ms">
                ${lang === 'en' ? cat.en : cat.zh}
              </div>
            </label>
          `).join('')}
        </div>
      </div>
    </div>

    <div id="backlog-results"></div>
  </div>
  ${renderDisclaimer()}`;

  activateIcons();

  // Bind events
  const countrySelect = document.getElementById('backlog-country') as HTMLSelectElement | null;
  const radios = container.querySelectorAll('input[name="eb-category"]');

  countrySelect?.addEventListener('change', () => {
    state.country = countrySelect.value;
    setState(state);
    // Re-render radio border states
    container.querySelectorAll('input[name="eb-category"]').forEach(r => {
      const card = (r as HTMLInputElement).parentElement?.querySelector('.card') as HTMLElement | null;
      if (card) card.style.borderColor = (r as HTMLInputElement).checked ? 'var(--primary)' : 'transparent';
    });
    if (state.country) {
      renderResults(state);
    }
  });

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      state.category = (radio as HTMLInputElement).value;
      setState(state);
      // Update radio border states
      container.querySelectorAll('input[name="eb-category"]').forEach(r => {
        const card = (r as HTMLInputElement).parentElement?.querySelector('.card') as HTMLElement | null;
        if (card) card.style.borderColor = (r as HTMLInputElement).checked ? 'var(--primary)' : 'transparent';
      });
      if (state.country) {
        renderResults(state);
      }
    });
  });

  // If state already has selections, show results
  if (state.country) {
    renderResults(state);
  }
}

function renderResults(state: BacklogState): void {
  const lang = currentLang();
  const resultsContainer = document.getElementById('backlog-results');
  if (!resultsContainer) return;

  const countryObj = countries.find(c => c.value === state.country);
  if (!countryObj) return;

  const backlogCat = countryObj.backlogCategory as BacklogCategoryKey;
  const ebCat = state.category as EBKey;

  const fad = getFAD(backlogCat, ebCat);
  const rowFad = getROWFAD(ebCat);
  const waitTime = getWaitTime(backlogCat, ebCat);
  const waitColor = getWaitColor(waitTime);
  const countryName = lang === 'en' ? countryObj.label : countryObj.labelZh;

  const ebLabel = ebCat.toUpperCase().replace('EB', 'EB-');

  // Color mapping for result card
  const colorMap = {
    green: { bg: '#D1FAE5', border: 'var(--success)', text: '#065F46', darkBg: '#064E3B', darkText: '#6EE7B7' },
    amber: { bg: 'var(--accent-light)', border: 'var(--warning)', text: '#92400E', darkBg: '#78350F', darkText: '#FCD34D' },
    red: { bg: '#FEE2E2', border: 'var(--danger)', text: '#991B1B', darkBg: '#7F1D1D', darkText: '#FCA5A5' },
  };

  const color = colorMap[waitColor];

  // Main result card
  let html = `
    <div class="result-card ${waitColor}" style="margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:16px">
        <h3 style="font-size:20px;font-weight:700;margin:0">${countryName} - ${ebLabel}</h3>
        <span class="badge badge-${waitColor}" style="font-size:14px;padding:4px 12px">${waitTime}</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div class="card" style="padding:16px;text-align:center">
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px">
            ${tl({ en: 'Current Priority Date (FAD)', zh: '当前优先日期' })}
          </div>
          <div style="font-size:20px;font-weight:700;color:var(--primary)">
            ${fad}
          </div>
        </div>
        <div class="card" style="padding:16px;text-align:center">
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px">
            ${tl({ en: 'Estimated Wait', zh: '预计等待' })}
          </div>
          <div style="font-size:20px;font-weight:700;color:${waitColor === 'green' ? 'var(--success)' : waitColor === 'amber' ? 'var(--warning)' : 'var(--danger)'}">
            ${waitTime}
          </div>
        </div>
      </div>

      <!-- Country vs ROW comparison -->
      <h4 style="font-size:15px;font-weight:600;margin:0 0 12px;display:flex;align-items:center;gap:6px">
        <i data-lucide="git-compare" style="width:16px;height:16px;color:var(--primary)"></i>
        ${tl({ en: 'Your Country vs Rest of World', zh: '你的国家 vs 其他国家' })}
      </h4>
      <div class="comparison-table-wrapper">
        <table class="comparison-table" style="font-size:14px">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">${countryName}</th>
              <th scope="col">${tl({ en: 'Rest of World', zh: '其他国家' })}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight:600">${tl({ en: 'Final Action Date', zh: '最终行动日期' })}</td>
              <td>${fad}</td>
              <td>${rowFad}</td>
            </tr>
            <tr>
              <td style="font-weight:600">${tl({ en: 'Estimated Wait', zh: '预计等待' })}</td>
              <td><span class="badge badge-${waitColor}">${waitTime}</span></td>
              <td><span class="badge badge-${getWaitColor(estimatedWaitTimes.row[ebCat])}">${estimatedWaitTimes.row[ebCat]}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`;

  // Historical movement section (India EB-2 or China EB-2)
  const showIndiaHistory = backlogCat === 'india' && ebCat === 'eb2';
  const showChinaHistory = backlogCat === 'china' && ebCat === 'eb2';

  if (showIndiaHistory || showChinaHistory) {
    const historicalData = showIndiaHistory ? historicalEB2India : historicalEB2China;
    const countryLabel = showIndiaHistory
      ? tl({ en: 'India EB-2', zh: '印度 EB-2' })
      : tl({ en: 'China EB-2', zh: '中国 EB-2' });

    html += `
    <div class="card" style="padding:24px;margin-bottom:24px">
      <h3 style="font-size:18px;font-weight:700;margin:0 0 4px;display:flex;align-items:center;gap:8px">
        <i data-lucide="trending-up" style="width:20px;height:20px;color:var(--primary)"></i>
        ${tl({ en: 'Historical Priority Date Movement', zh: '历史优先日期变动' })}
      </h3>
      <p style="font-size:13px;color:var(--text-secondary);margin:0 0 16px">${countryLabel}</p>
      <div class="comparison-table-wrapper">
        <table class="comparison-table" style="font-size:14px">
          <thead>
            <tr>
              <th scope="col">${tl({ en: 'Bulletin Date', zh: '排期月份' })}</th>
              <th scope="col">${tl({ en: 'Final Action Date', zh: '最终行动日期' })}</th>
              <th scope="col">${tl({ en: 'Backlog', zh: '积压时间' })}</th>
            </tr>
          </thead>
          <tbody>
            ${historicalData.map(row => `<tr>
              <td style="font-weight:500">${row.date}</td>
              <td>${row.fad}</td>
              <td><span class="badge badge-red" style="font-size:12px">${row.backlog}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  // Strategy suggestions for long backlogs
  const waitMatch = waitTime.match(/(\d+)/);
  const waitYears = waitMatch ? parseInt(waitMatch[1], 10) : 0;
  const isCurrent = waitTime === 'Current';

  if (!isCurrent && waitYears >= 2) {
    const strategies: { icon: string; title: string; desc: string; show: boolean }[] = [
      {
        icon: 'star',
        title: tl({ en: 'Consider EB-1A Upgrade', zh: '考虑升级到EB-1A' }),
        desc: tl({
          en: 'EB-1A has much shorter backlogs and allows self-petition. If you have strong achievements (publications, awards, patents), this could cut years off your wait.',
          zh: 'EB-1A积压时间短得多，且可以自行申请。如果你有突出成就（论文、奖项、专利），可以大幅缩短等待时间。'
        }),
        show: waitYears >= 5,
      },
      {
        icon: 'user-check',
        title: tl({ en: 'NIW Allows Self-Petition', zh: 'NIW允许自行申请' }),
        desc: tl({
          en: 'EB-2 NIW lets you file without an employer. While it shares the EB-2 queue, you gain independence from employer sponsorship and can change jobs freely.',
          zh: 'EB-2 NIW无需雇主即可申请。虽然共享EB-2排期，但你无需依赖雇主担保，可以自由换工作。'
        }),
        show: waitYears >= 3,
      },
      {
        icon: 'heart',
        title: tl({ en: 'Cross-Chargeability with Spouse', zh: '配偶跨国出生地计算' }),
        desc: tl({
          en: 'If your spouse was born in a country with shorter backlogs (e.g., Rest of World = Current), you may be able to use their country of birth for visa chargeability, dramatically reducing your wait.',
          zh: '如果你的配偶出生在排期较短的国家（如其他国家=当前），你可以使用其出生国进行签证计算，大幅缩短等待时间。'
        }),
        show: true,
      },
    ];

    const visibleStrategies = strategies.filter(s => s.show);

    if (visibleStrategies.length > 0) {
      html += `
      <h3 style="font-size:18px;font-weight:700;margin:0 0 16px;display:flex;align-items:center;gap:8px">
        <i data-lucide="lightbulb" style="width:20px;height:20px;color:var(--primary)"></i>
        ${tl({ en: 'Strategy Suggestions', zh: '策略建议' })}
      </h3>
      <div style="display:grid;gap:12px;margin-bottom:24px">
        ${visibleStrategies.map(s => `
          <div class="card" style="padding:18px;border-left:4px solid var(--primary)">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <i data-lucide="${s.icon}" style="width:18px;height:18px;color:var(--primary);flex-shrink:0"></i>
              <h4 style="font-size:15px;font-weight:600;margin:0">${s.title}</h4>
            </div>
            <p style="font-size:14px;color:var(--text-secondary);margin:0;line-height:1.6">${s.desc}</p>
          </div>
        `).join('')}
      </div>`;
    }
  } else if (isCurrent) {
    html += `
    <div class="card" style="padding:20px;border-left:4px solid var(--success);margin-bottom:24px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <i data-lucide="party-popper" style="width:20px;height:20px;color:var(--success);flex-shrink:0"></i>
        <h4 style="font-size:16px;font-weight:600;margin:0;color:var(--success)">${tl({ en: 'No Backlog!', zh: '无排期！' })}</h4>
      </div>
      <p style="font-size:14px;color:var(--text-secondary);margin:0;line-height:1.6">${tl({
        en: 'Your country and category combination is current, meaning there is no wait for a visa number. Once your I-140 is approved, you can proceed directly to adjustment of status (I-485) or consular processing.',
        zh: '你的国家和类别组合排期为当前，无需等待签证号码。I-140获批后，你可以直接进行身份调整（I-485）或领事处理。'
      })}</p>
    </div>`;
  }

  // Data source note
  html += `
    <p style="font-size:13px;color:var(--text-secondary);text-align:center">
      <i data-lucide="database" style="width:14px;height:14px;vertical-align:-2px"></i>
      ${tl({ en: 'Data source: Visa Bulletin April 2026', zh: '数据来源：2026年4月签证排期' })}
    </p>`;

  resultsContainer.innerHTML = `<div class="fade-in">${html}</div>`;
  activateIcons();
}

export function renderBacklog(container: HTMLElement): void {
  const state = getState();
  renderInputSection(container, state);
}

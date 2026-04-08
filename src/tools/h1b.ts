import { t, tl, currentLang } from '../i18n';
import { h1bRates, wageWeights, h1bCapStructure } from '../data/h1b-rates';

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function renderDisclaimer(): string {
  return `<div class="disclaimer-bar">
    <i data-lucide="shield" style="width:18px;height:18px;flex-shrink:0"></i>
    <span>${tl({ en: 'This is for educational purposes only. This is not legal advice. Consult a qualified immigration attorney.', zh: '本工具仅供教育参考，不构成法律建议。请咨询合格的移民律师。' })}</span>
    <button onclick="this.parentElement.remove()" aria-label="Dismiss"><i data-lucide="x" style="width:16px;height:16px"></i></button>
  </div>`;
}

function calculate(degree: string, wageLevel: number): { probability: number; message: { en: string; zh: string } } {
  // Base rate from FY2026
  const fy2026 = h1bRates.find(r => r.year === 'FY2026');
  const baseRate = fy2026 ? fy2026.selectionRate : 35;

  // Advanced degree holders get entered into 20K pool first, then into regular pool
  // This gives them roughly a 10-15% advantage
  const advancedBoost = degree === 'advanced' ? 1.12 : 1.0;

  // Wage weight: Higher wage levels get more lottery entries
  // With weighted lottery, level 4 gets 4x entries = ~4x chance
  // We model this as a multiplier on the per-entry probability
  const wage = wageWeights.find(w => w.level === wageLevel);
  const entries = wage ? wage.entries : 1;

  // Calculate weighted probability
  // If everyone had equal entries, base rate applies
  // With weighted lottery, your probability scales with entries / average entries
  // Average entries across population is ~2 (rough estimate)
  const avgEntries = 2.0;
  const weightedMultiplier = entries / avgEntries;

  let prob = (baseRate / 100) * advancedBoost * weightedMultiplier * 100;
  prob = Math.min(prob, 95); // Cap at 95%
  prob = Math.max(prob, 5);  // Floor at 5%

  let message: { en: string; zh: string };
  if (prob >= 50) {
    message = {
      en: 'Your estimated odds look favorable! A higher wage level significantly improves your chances with the weighted lottery.',
      zh: '你的预估概率看起来很有利！较高的工资等级在加权抽签中会大幅提高你的机会。',
    };
  } else if (prob >= 25) {
    message = {
      en: 'Your odds are moderate. Consider strategies like STEM OPT to get multiple attempts, or explore O-1 and cap-exempt options.',
      zh: '你的概率属于中等。考虑利用STEM OPT获取多次抽签机会，或探索O-1和免配额选项。',
    };
  } else {
    message = {
      en: 'The odds are challenging at this wage level. Strongly consider alternative pathways like O-1, EB-2 NIW, or cap-exempt employers.',
      zh: '在这个工资等级下概率较低。强烈建议考虑O-1、EB-2 NIW或免配额雇主等替代路径。',
    };
  }

  return { probability: Math.round(prob * 10) / 10, message };
}

export function renderH1B(container: HTMLElement): void {
  const lang = currentLang();
  let degree = 'bachelors';
  let wageLevel = 1;

  function render() {
    const result = calculate(degree, wageLevel);
    const probColor = result.probability >= 50 ? 'var(--success)' : result.probability >= 25 ? 'var(--warning)' : 'var(--danger)';

    const wageOptions = wageWeights.map(w => {
      const desc = lang === 'en' ? w.description : w.descriptionZh;
      return `<option value="${w.level}" ${wageLevel === w.level ? 'selected' : ''}>
        ${tl({ en: `Level ${w.level}`, zh: `级别${w.level}` })} — ${desc} (${w.entries}x ${tl({ en: 'entries', zh: '投入' })})
      </option>`;
    }).join('');

    const historyRows = h1bRates.map(r => `
      <tr>
        <td style="font-weight:600">${r.year}</td>
        <td>${fmt(r.registrations)}</td>
        <td>${fmt(r.selections)}</td>
        <td style="font-weight:600">${r.selectionRate}%</td>
        <td>${r.rounds}</td>
      </tr>`).join('');

    container.innerHTML = `<div class="fade-in" style="max-width:720px;margin:0 auto;padding:24px 20px 120px">
      <a href="#/" style="color:var(--text-secondary);display:flex;align-items:center;gap:4px;font-size:14px;margin-bottom:20px">
        <i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${t('common.backHome')}
      </a>

      <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:10px">
        <i data-lucide="dice-3" style="width:28px;height:28px;color:var(--primary)"></i>
        ${t('tool.h1b')}
      </h1>
      <p style="color:var(--text-secondary);margin-bottom:24px">${tl({ en: 'Estimate your H-1B lottery selection chances based on degree level and wage tier.', zh: '根据学位水平和工资等级，估算你的H-1B抽签中签概率。' })}</p>

      <!-- Inputs -->
      <div class="card" style="padding:28px;margin-bottom:20px">
        <h2 style="font-size:18px;font-weight:600;margin:0 0 20px">
          <i data-lucide="sliders-horizontal" style="width:18px;height:18px;color:var(--primary);vertical-align:middle"></i>
          ${tl({ en: 'Your Profile', zh: '你的条件' })}
        </h2>

        <!-- Degree Level -->
        <div style="margin-bottom:20px">
          <label style="font-size:14px;font-weight:600;display:block;margin-bottom:10px">
            ${tl({ en: 'Degree Level', zh: '学位水平' })}
          </label>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <label style="display:flex;align-items:center;gap:8px;padding:12px 20px;background:var(--surface);border:2px solid ${degree === 'bachelors' ? 'var(--primary)' : 'var(--border)'};border-radius:12px;cursor:pointer;flex:1;min-width:180px">
              <input type="radio" name="degree" value="bachelors" ${degree === 'bachelors' ? 'checked' : ''} style="accent-color:var(--primary);width:18px;height:18px">
              <div>
                <div style="font-weight:600;font-size:15px">${tl({ en: "Bachelor's", zh: '本科' })}</div>
                <div style="font-size:13px;color:var(--text-secondary)">${tl({ en: `Regular cap (${fmt(h1bCapStructure.regularCap)} slots)`, zh: `常规配额（${fmt(h1bCapStructure.regularCap)}个名额）` })}</div>
              </div>
            </label>
            <label style="display:flex;align-items:center;gap:8px;padding:12px 20px;background:var(--surface);border:2px solid ${degree === 'advanced' ? 'var(--primary)' : 'var(--border)'};border-radius:12px;cursor:pointer;flex:1;min-width:180px">
              <input type="radio" name="degree" value="advanced" ${degree === 'advanced' ? 'checked' : ''} style="accent-color:var(--primary);width:18px;height:18px">
              <div>
                <div style="font-weight:600;font-size:15px">${tl({ en: 'Advanced (MS/PhD)', zh: '高学历（硕/博）' })}</div>
                <div style="font-size:13px;color:var(--text-secondary)">${tl({ en: `Extra pool (+${fmt(h1bCapStructure.advancedDegreeCap)} slots)`, zh: `额外配额池（+${fmt(h1bCapStructure.advancedDegreeCap)}个名额）` })}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Wage Level -->
        <div>
          <label style="font-size:14px;font-weight:600;display:block;margin-bottom:10px">
            ${tl({ en: 'Wage Level (Weighted Lottery — FY2027+)', zh: '工资等级（加权抽签 — FY2027起）' })}
          </label>
          <select id="wage-select" style="font-size:16px">
            ${wageOptions}
          </select>
        </div>
      </div>

      <!-- Results -->
      <div class="card" style="padding:28px;margin-bottom:20px;text-align:center">
        <div style="font-size:14px;color:var(--text-secondary);margin-bottom:8px">${tl({ en: 'Estimated Selection Probability', zh: '预估中签概率' })}</div>
        <div style="font-size:56px;font-weight:700;color:${probColor};line-height:1.1;margin-bottom:12px">${result.probability}%</div>
        <div class="progress-bar" style="margin-bottom:16px;height:12px">
          <div class="progress-bar-fill" style="width:${result.probability}%;background:${probColor}"></div>
        </div>
        <p style="font-size:15px;color:var(--text-secondary);margin:0;line-height:1.6">
          ${lang === 'en' ? result.message.en : result.message.zh}
        </p>
        <div style="margin-top:12px;font-size:13px;color:var(--text-secondary)">
          ${tl({ en: `Based on FY2026 baseline (${h1bRates.find(r => r.year === 'FY2026')?.selectionRate}% rate) with weighted lottery modeling`, zh: `基于FY2026基线（${h1bRates.find(r => r.year === 'FY2026')?.selectionRate}%中签率）和加权抽签模型` })}
        </div>
      </div>

      <!-- Cap Structure -->
      <div class="card" style="padding:20px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-around;text-align:center;flex-wrap:wrap;gap:16px">
          <div>
            <div style="font-size:24px;font-weight:700;color:var(--primary)">${fmt(h1bCapStructure.regularCap)}</div>
            <div style="font-size:13px;color:var(--text-secondary)">${tl({ en: 'Regular Cap', zh: '常规配额' })}</div>
          </div>
          <div style="font-size:24px;color:var(--text-secondary);align-self:center">+</div>
          <div>
            <div style="font-size:24px;font-weight:700;color:var(--primary)">${fmt(h1bCapStructure.advancedDegreeCap)}</div>
            <div style="font-size:13px;color:var(--text-secondary)">${tl({ en: 'Advanced Degree', zh: '高学历配额' })}</div>
          </div>
          <div style="font-size:24px;color:var(--text-secondary);align-self:center">=</div>
          <div>
            <div style="font-size:24px;font-weight:700;color:var(--primary)">${fmt(h1bCapStructure.total)}</div>
            <div style="font-size:13px;color:var(--text-secondary)">${tl({ en: 'Total Annual', zh: '年度总额' })}</div>
          </div>
        </div>
      </div>

      <!-- Historical Data -->
      <div class="card" style="padding:28px;margin-bottom:20px">
        <h2 style="font-size:18px;font-weight:600;margin:0 0 16px;display:flex;align-items:center;gap:8px">
          <i data-lucide="bar-chart-3" style="width:18px;height:18px;color:var(--primary)"></i>
          ${tl({ en: 'Historical Selection Rates', zh: '历年中签率' })}
        </h2>
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>${tl({ en: 'Fiscal Year', zh: '财年' })}</th>
                <th>${tl({ en: 'Registrations', zh: '注册数' })}</th>
                <th>${tl({ en: 'Selections', zh: '中签数' })}</th>
                <th>${tl({ en: 'Rate', zh: '比率' })}</th>
                <th>${tl({ en: 'Rounds', zh: '轮次' })}</th>
              </tr>
            </thead>
            <tbody>
              ${historyRows}
            </tbody>
          </table>
        </div>
        <div style="margin-top:12px;font-size:13px;color:var(--text-secondary)">
          ${tl({ en: 'Source: USCIS. Last updated: April 2026', zh: '来源：USCIS。最后更新：2026年4月' })}
        </div>
      </div>

      <!-- Context Cards -->
      <div style="display:grid;gap:16px;grid-template-columns:1fr;margin-bottom:20px">
        <!-- What if not selected -->
        <div class="card" style="padding:24px">
          <h3 style="font-size:16px;font-weight:600;margin:0 0 12px;display:flex;align-items:center;gap:8px">
            <i data-lucide="life-buoy" style="width:18px;height:18px;color:var(--warning)"></i>
            ${tl({ en: 'What if You\'re Not Selected?', zh: '如果没有中签怎么办？' })}
          </h3>
          <ul style="margin:0;padding-left:20px;font-size:14px;color:var(--text-secondary);line-height:1.8">
            <li><strong>${tl({ en: 'STEM OPT Extension', zh: 'STEM OPT延期' })}</strong> — ${tl({ en: 'If STEM field, get 24 extra months (3 lottery attempts total)', zh: 'STEM专业可获额外24个月（共3次抽签机会）' })}</li>
            <li><strong>${tl({ en: 'O-1 Visa', zh: 'O-1签证' })}</strong> — ${tl({ en: 'No lottery, no cap. ~92-94% approval rate.', zh: '无需抽签，无配额限制。批准率约92-94%。' })} <a href="#/o1-assess">${tl({ en: 'Start Assessment', zh: '开始评估' })} →</a></li>
            <li><strong>${tl({ en: 'Cap-Exempt Employers', zh: '免配额雇主' })}</strong> — ${tl({ en: 'Universities, nonprofits, and government research orgs skip the lottery entirely', zh: '大学、非营利组织和政府研究机构完全免于抽签' })}</li>
            <li><strong>${tl({ en: 'EB-2 NIW', zh: 'EB-2 NIW' })}</strong> — ${tl({ en: 'Self-petition green card with no employer needed', zh: '无需雇主的自行申请绿卡' })} <a href="#/eb-compare">${tl({ en: 'Compare EB', zh: '对比EB类别' })} →</a></li>
          </ul>
        </div>

        <!-- Cap-Gap Protection -->
        <div class="card" style="padding:24px">
          <h3 style="font-size:16px;font-weight:600;margin:0 0 12px;display:flex;align-items:center;gap:8px">
            <i data-lucide="shield-check" style="width:18px;height:18px;color:var(--success)"></i>
            ${tl({ en: 'Cap-Gap Protection', zh: '配额间隙保护' })}
          </h3>
          <p style="font-size:14px;color:var(--text-secondary);margin:0;line-height:1.7">
            ${tl({
              en: 'If your OPT expires before October 1 but you were selected in the H-1B lottery, your work authorization is automatically extended to April 1 of the following year. This "cap-gap" protection ensures you can keep working while your H-1B petition is pending.',
              zh: '如果你的OPT在10月1日前到期但你在H-1B抽签中被选中，你的工作授权将自动延长至次年4月1日。这项"配额间隙"保护确保你在H-1B申请待审期间可以继续工作。',
            })}
          </p>
        </div>

        <!-- Weighted Lottery -->
        <div class="card" style="padding:24px">
          <h3 style="font-size:16px;font-weight:600;margin:0 0 12px;display:flex;align-items:center;gap:8px">
            <i data-lucide="scale" style="width:18px;height:18px;color:var(--primary)"></i>
            ${tl({ en: 'Weighted Lottery (FY2027+)', zh: '加权抽签（FY2027起）' })}
          </h3>
          <p style="font-size:14px;color:var(--text-secondary);margin:0;line-height:1.7">
            ${tl({
              en: 'Starting FY2027, USCIS will implement a wage-based weighted lottery system. Higher wage levels receive more lottery entries: Level 1 gets 1 entry, Level 2 gets 2, Level 3 gets 3, and Level 4 gets 4 entries. This significantly improves odds for higher-paid positions while reducing chances for entry-level roles. The goal is to prioritize positions that demonstrate genuine specialty occupation need.',
              zh: '从FY2027起，USCIS将实施基于工资的加权抽签制度。更高的工资等级获得更多的抽签投入：级别1获1次投入，级别2获2次，级别3获3次，级别4获4次。这大幅提高了高薪职位的中签概率，同时降低了入门级职位的机会。目的是优先考虑真正体现专业职业需求的职位。',
            })}
          </p>
        </div>
      </div>

      <div style="text-align:center;font-size:13px;color:var(--text-secondary);margin-bottom:20px">
        ${t('common.lastUpdated')}
      </div>
    </div>
    ${renderDisclaimer()}`;

    (window as any).lucide?.createIcons();

    // Bind degree radio buttons
    container.querySelectorAll('input[name="degree"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        degree = (e.target as HTMLInputElement).value;
        render();
      });
    });

    // Bind wage level select
    document.getElementById('wage-select')?.addEventListener('change', (e) => {
      wageLevel = parseInt((e.target as HTMLSelectElement).value, 10);
      render();
    });
  }

  render();
}

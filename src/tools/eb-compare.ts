import { t, tl, currentLang } from '../i18n';
import { ebCategories } from '../data/eb-categories';
import { renderDisclaimer, activateIcons } from '../utils/ui';

function yesNo(val: boolean, favorable: boolean): string {
  const label = val
    ? tl({ en: 'Yes', zh: '是' })
    : tl({ en: 'No', zh: '否' });
  const isGood = favorable ? val : !val;
  const badgeClass = isGood ? 'badge-green' : 'badge-red';
  return `<span class="badge ${badgeClass}">${label}</span>`;
}

function difficultyBadge(cat: typeof ebCategories[0]): string {
  const lang = currentLang();
  const label = lang === 'en' ? cat.difficulty : cat.difficultyZh;
  let badgeClass = 'badge-amber';
  if (cat.difficulty === 'High') badgeClass = 'badge-red';
  if (cat.difficulty === 'Low-Moderate') badgeClass = 'badge-green';
  return `<span class="badge ${badgeClass}">${label}</span>`;
}

export function renderEBCompare(container: HTMLElement): void {
  const lang = currentLang();

  const cats = ebCategories;
  // Shorthand accessor
  const n = (cat: typeof cats[0]) => lang === 'en' ? cat.name.split(': ')[0] : cat.nameZh.split('：')[0];
  const shortNames = cats.map(c => n(c));

  const rows = [
    {
      label: tl({ en: 'Self-Petition', zh: '自行申请' }),
      cells: cats.map(c => yesNo(c.selfPetition, true)),
    },
    {
      label: tl({ en: 'Employer Sponsor', zh: '雇主担保' }),
      cells: cats.map(c => yesNo(c.employerRequired, false)),
    },
    {
      label: tl({ en: 'PERM Required', zh: '需PERM' }),
      cells: cats.map(c => yesNo(c.permRequired, false)),
    },
    {
      label: tl({ en: 'Job Offer Required', zh: '需工作Offer' }),
      cells: cats.map(c => yesNo(c.jobOfferRequired, false)),
    },
    {
      label: tl({ en: 'Education Minimum', zh: '最低学历' }),
      cells: cats.map(c => `<span style="font-size:13px">${lang === 'en' ? c.educationMin : c.educationMinZh}</span>`),
    },
    {
      label: tl({ en: 'Premium Processing', zh: '加急处理' }),
      cells: cats.map(c => `<span style="font-size:13px">${c.premiumProcessing}</span>`),
    },
    {
      label: tl({ en: 'Typical Timeline (ROW)', zh: '典型时间线（其他国家）' }),
      cells: cats.map(c => `<span style="font-size:13px">${c.totalTimelineROW}</span>`),
    },
    {
      label: tl({ en: 'Difficulty', zh: '难度' }),
      cells: cats.map(c => difficultyBadge(c)),
    },
    {
      label: tl({ en: 'Best For', zh: '最适合' }),
      cells: cats.map(c => `<span style="font-size:13px">${lang === 'en' ? c.bestFor : c.bestForZh}</span>`),
    },
  ];

  const tableHeaderHtml = `<tr>
    <th scope="col" style="min-width:140px">${tl({ en: 'Feature', zh: '特征' })}</th>
    ${shortNames.map(name => `<th scope="col" style="min-width:140px">${name}</th>`).join('')}
  </tr>`;

  const tableBodyHtml = rows.map(row => `<tr>
    <td style="font-weight:600;white-space:nowrap">${row.label}</td>
    ${row.cells.map(cell => `<td>${cell}</td>`).join('')}
  </tr>`).join('');

  // Key differences highlight cards
  const highlights = [
    {
      icon: 'user-check',
      title: tl({ en: 'NIW = No employer needed', zh: 'NIW = 无需雇主' }),
      desc: tl({ en: 'EB-2 NIW lets you self-petition. No PERM, no job offer, no employer dependency. Ideal for STEM researchers and entrepreneurs.', zh: 'EB-2 NIW可以自行申请。无需PERM、无需工作offer、无需依赖雇主。适合STEM研究人员和创业者。' }),
      color: 'var(--primary)',
    },
    {
      icon: 'zap',
      title: tl({ en: 'EB-1A = Fastest if you qualify', zh: 'EB-1A = 符合条件则最快' }),
      desc: tl({ en: 'Self-petition with 15-day premium processing. Priority dates current for most countries. The gold standard — but requires extraordinary ability evidence.', zh: '可自行申请，15天加急处理。大多数国家排期为当前。黄金标准——但需要杰出能力证据。' }),
      color: 'var(--success)',
    },
    {
      icon: 'building-2',
      title: tl({ en: 'EB-2 PERM = Most common path', zh: 'EB-2 PERM = 最常见途径' }),
      desc: tl({ en: 'The standard employer-sponsored green card route. Well-established but requires PERM labor certification and ties you to one employer. Watch out for India/China backlogs.', zh: '标准的雇主担保绿卡路线。流程成熟但需PERM劳工认证，且绑定单一雇主。注意印度/中国的排期积压。' }),
      color: 'var(--warning)',
    },
  ];

  const highlightsHtml = highlights.map(h => `
    <div class="card" style="padding:20px;border-left:4px solid ${h.color}">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <i data-lucide="${h.icon}" style="width:22px;height:22px;color:${h.color};flex-shrink:0"></i>
        <h3 style="font-size:17px;font-weight:700;margin:0">${h.title}</h3>
      </div>
      <p style="font-size:14px;color:var(--text-secondary);margin:0;line-height:1.6">${h.desc}</p>
    </div>
  `).join('');

  // Expandable detail cards for each category
  const detailCardsHtml = cats.map((cat, idx) => {
    const name = lang === 'en' ? cat.name : cat.nameZh;
    const desc = lang === 'en' ? cat.description : cat.descriptionZh;
    const pros = lang === 'en' ? cat.pros : cat.prosZh;
    const cons = lang === 'en' ? cat.cons : cat.consZh;
    return `
    <details class="card" style="padding:0;overflow:hidden" id="eb-detail-${idx}">
      <summary style="padding:18px 20px;cursor:pointer;font-size:16px;font-weight:600;display:flex;align-items:center;gap:10px;list-style:none;user-select:none">
        <i data-lucide="chevron-right" class="detail-chevron" style="width:18px;height:18px;color:var(--text-secondary);flex-shrink:0;transition:transform 200ms"></i>
        ${name}
        ${difficultyBadge(cat)}
      </summary>
      <div style="padding:0 20px 20px;border-top:1px solid var(--border)">
        <p style="font-size:14px;color:var(--text-secondary);margin:16px 0;line-height:1.6">${desc}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div>
            <h4 style="font-size:13px;font-weight:600;color:var(--success);margin:0 0 8px;display:flex;align-items:center;gap:6px">
              <i data-lucide="thumbs-up" style="width:14px;height:14px"></i>
              ${tl({ en: 'Pros', zh: '优势' })}
            </h4>
            <ul style="margin:0;padding-left:18px;font-size:13px;color:var(--text-secondary);line-height:1.7">
              ${pros.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h4 style="font-size:13px;font-weight:600;color:var(--warning);margin:0 0 8px;display:flex;align-items:center;gap:6px">
              <i data-lucide="alert-triangle" style="width:14px;height:14px"></i>
              ${tl({ en: 'Considerations', zh: '注意事项' })}
            </h4>
            <ul style="margin:0;padding-left:18px;font-size:13px;color:var(--text-secondary);line-height:1.7">
              ${cons.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </details>`;
  }).join('');

  container.innerHTML = `<div class="fade-in" style="max-width:960px;margin:0 auto;padding:24px 20px 120px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
      <a href="/" style="color:var(--text-secondary);display:flex;align-items:center;gap:4px;font-size:14px">
        <i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${t('common.backHome')}
      </a>
    </div>

    <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:10px">
      <i data-lucide="columns-3" style="width:28px;height:28px;color:var(--primary)"></i>
      ${t('tool.ebCompare')}
    </h1>
    <p style="color:var(--text-secondary);margin-bottom:24px">${tl({ en: 'Side-by-side comparison of EB green card categories. Scroll horizontally on mobile.', zh: 'EB绿卡类别并排对比。移动端可左右滑动查看。' })}</p>

    <!-- Comparison Table -->
    <div class="comparison-table-wrapper" style="margin-bottom:32px">
      <table class="comparison-table">
        <thead>${tableHeaderHtml}</thead>
        <tbody>${tableBodyHtml}</tbody>
      </table>
    </div>

    <!-- Key Differences -->
    <h2 style="font-size:22px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px">
      <i data-lucide="lightbulb" style="width:22px;height:22px;color:var(--primary)"></i>
      ${tl({ en: 'Key Differences', zh: '关键区别' })}
    </h2>
    <div style="display:grid;gap:12px;margin-bottom:32px">
      ${highlightsHtml}
    </div>

    <!-- Category Details -->
    <h2 style="font-size:22px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px">
      <i data-lucide="book-open" style="width:22px;height:22px;color:var(--primary)"></i>
      ${tl({ en: 'Category Details', zh: '类别详情' })}
    </h2>
    <p style="color:var(--text-secondary);font-size:14px;margin-bottom:16px">${tl({ en: 'Click each category to see full description, pros, and considerations.', zh: '点击各类别查看完整说明、优势和注意事项。' })}</p>
    <div style="display:grid;gap:12px;margin-bottom:32px">
      ${detailCardsHtml}
    </div>

    <p style="font-size:13px;color:var(--text-secondary);text-align:center;margin-bottom:16px">
      <i data-lucide="info" style="width:14px;height:14px;vertical-align:-2px"></i>
      ${t('common.lastUpdated')}
    </p>
  </div>
  ${renderDisclaimer()}`;

  activateIcons();

  // Handle detail chevron rotation on toggle
  container.querySelectorAll('details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      const chevron = detail.querySelector('.detail-chevron') as HTMLElement | null;
      if (chevron) {
        chevron.style.transform = detail.open ? 'rotate(90deg)' : 'rotate(0deg)';
      }
    });
  });
}

import { t, tl, currentLang } from '../i18n';

function renderDisclaimer(): string {
  return `<div class="disclaimer-bar">
    <i data-lucide="shield" style="width:18px;height:18px;flex-shrink:0"></i>
    <span>${tl({en:'This is for educational purposes only. This is not legal advice. Consult a qualified immigration attorney.',zh:'本工具仅供教育参考，不构成法律建议。请咨询合格的移民律师。'})}</span>
    <button onclick="this.parentElement.remove()" aria-label="Dismiss"><i data-lucide="x" style="width:16px;height:16px"></i></button>
  </div>`;
}

interface ScamCategory {
  icon: string;
  name: { en: string; zh: string };
  desc: { en: string; zh: string };
  howToSpot: { en: string[]; zh: string[] };
  whatToDo: { en: string[]; zh: string[] };
  example: { en: string; zh: string };
  severity: 'red' | 'amber';
}

const scamCategories: ScamCategory[] = [
  {
    icon: 'phone-off',
    name: { en: 'Government Impersonation Scams', zh: '冒充政府机构骗局' },
    desc: {
      en: 'Fraudsters call or email claiming to be USCIS, DHS, or IRS. They demand immediate payment via wire transfer, gift cards, or crypto, threatening arrest or deportation.',
      zh: '骗子致电或发邮件冒充USCIS、DHS或IRS，要求立即通过电汇、礼品卡或加密货币付款，并以逮捕或驱逐出境相威胁。',
    },
    howToSpot: {
      en: [
        'USCIS never calls to demand payment — they communicate by official mail',
        'Caller ID can be spoofed to show government numbers',
        'Threats of immediate arrest or deportation',
        'Demands payment via gift cards, wire transfer, or cryptocurrency',
      ],
      zh: [
        'USCIS从不致电要求付款——他们通过官方邮件沟通',
        '来电显示可以被伪造为政府号码',
        '威胁立即逮捕或驱逐出境',
        '要求通过礼品卡、电汇或加密货币付款',
      ],
    },
    whatToDo: {
      en: [
        'Hang up immediately',
        'Report to USCIS tip form at uscis.gov/report-fraud',
        'File a complaint with the FTC at ReportFraud.ftc.gov',
      ],
      zh: [
        '立即挂断电话',
        '向USCIS举报：uscis.gov/report-fraud',
        '向FTC投诉：ReportFraud.ftc.gov',
      ],
    },
    example: {
      en: 'FBI IC3 2025 alert: Organized schemes targeting Middle Eastern and South Asian students with fake USCIS calls demanding thousands in "back fees."',
      zh: 'FBI IC3 2025年警报：有组织的诈骗团伙针对中东和南亚学生，冒充USCIS致电要求支付数千美元的"欠费"。',
    },
    severity: 'red',
  },
  {
    icon: 'stamp',
    name: { en: 'Notario Fraud', zh: '"公证人"欺诈' },
    desc: {
      en: 'In Latin America, "notario" means a licensed lawyer. In the US, a "notary public" can only witness signatures. Scammers exploit this confusion, charging $3,000-$10,000+ for immigration services they are not qualified to provide, often filing incorrect or fraudulent applications.',
      zh: '在拉丁美洲，"notario"指的是执业律师。但在美国，"notary public"（公证人）只能见证签名。骗子利用这一混淆，收费$3,000-$10,000+提供他们无资质的移民服务，经常提交错误或欺诈性申请。',
    },
    howToSpot: {
      en: [
        'Advertises as "notario" or "immigration consultant"',
        'Promises guaranteed green cards or visa approvals',
        'Accepts cash only with no receipts',
        'No state bar license or EOIR registration',
      ],
      zh: [
        '自称"notario"或"移民顾问"',
        '承诺保证获得绿卡或签证批准',
        '只收现金且不提供收据',
        '无州律师执照或EOIR注册',
      ],
    },
    whatToDo: {
      en: [
        'Report to your state Attorney General',
        'File a complaint with the FTC',
        'NYC doubled penalties to $7,500-$10,000 per violation',
      ],
      zh: [
        '向你所在州的总检察长举报',
        '向FTC投诉',
        '纽约市已将处罚加倍至每次违规$7,500-$10,000',
      ],
    },
    example: {
      en: 'Hundreds of complaints across multiple states, with estimated $1.2M+ in annual losses to notario fraud victims.',
      zh: '多个州收到数百起投诉，受害者每年估计损失超过120万美元。',
    },
    severity: 'red',
  },
  {
    icon: 'building',
    name: { en: 'H-1B Mills / Body Shops', zh: 'H-1B工厂/中介公司' },
    desc: {
      en: 'Companies that sponsor H-1B visas but bench workers without pay, charge filing fees to employees, hold passports, require repayment clauses, or have no actual work site for you.',
      zh: '这些公司虽然为H-1B提供担保，但会让员工无薪待岗、向员工收取申请费、扣押护照、要求偿还条款，或者没有实际的工作地点。',
    },
    howToSpot: {
      en: [
        'No project or client lined up before your start date',
        'Below-market wages or no pay between projects ("benching")',
        'Employee is asked to pay H-1B filing fees',
        'Threats of deportation if you leave the company',
        'Employer holds your passport or immigration documents',
      ],
      zh: [
        '入职前没有项目或客户安排',
        '低于市场的工资或项目间无薪（"待岗"）',
        '要求员工支付H-1B申请费',
        '以驱逐出境威胁你不要离开公司',
        '雇主扣押你的护照或移民文件',
      ],
    },
    whatToDo: {
      en: [
        'Report to the Department of Labor (DOL)',
        'File a complaint with USCIS',
        'You have a 60-day grace period if employment ends to find a new sponsor',
      ],
      zh: [
        '向劳工部(DOL)举报',
        '向USCIS投诉',
        '如果雇佣关系终止，你有60天宽限期寻找新的担保人',
      ],
    },
    example: {
      en: 'DOL Project Firewall (2025): 200+ investigations into H-1B abuse. FDNS site visits to employers have doubled since FY2024.',
      zh: 'DOL "防火墙"项目(2025)：对H-1B滥用进行了200+调查。FDNS雇主现场访问量自FY2024以来翻了一番。',
    },
    severity: 'red',
  },
  {
    icon: 'graduation-cap',
    name: { en: 'Pay-to-Stay Schools / Visa Mills', zh: '花钱续签学校/签证工厂' },
    desc: {
      en: 'Schools that maintain SEVP certification but where students never actually attend classes. Used to maintain F-1 status while working illegally.',
      zh: '这些学校保持着SEVP认证，但学生从不实际上课。被用来维持F-1身份同时非法工作。',
    },
    howToSpot: {
      en: [
        'No real classes or meaningful academic engagement',
        'Online-only with no physical campus',
        'Marketing focuses on work authorization, not education',
        'Unusually low tuition for the "degree" offered',
      ],
      zh: [
        '没有真正的课程或有意义的学术参与',
        '纯在线无实体校园',
        '宣传重点是工作许可而非教育',
        '"学位"收费异常低廉',
      ],
    },
    whatToDo: {
      en: [
        'Verify the school on Study in the States (studyinthestates.dhs.gov)',
        'Visit the campus in person before enrolling',
        'Contact the school\'s international student office and ask detailed questions',
      ],
      zh: [
        '在Study in the States网站(studyinthestates.dhs.gov)上验证学校',
        '注册前亲自参观校园',
        '联系学校的国际学生办公室并详细询问',
      ],
    },
    example: {
      en: 'University of Farmington: ICE sting operation. 600+ students affected, $6M collected in tuition, 130 people arrested. The "university" had no real classes.',
      zh: '法明顿大学(University of Farmington)：ICE钓鱼执法行动。600+学生受影响，收取600万美元学费，130人被捕。该"大学"没有任何真正的课程。',
    },
    severity: 'red',
  },
  {
    icon: 'ticket',
    name: { en: 'DV Lottery Scams', zh: '绿卡抽签(DV)骗局' },
    desc: {
      en: 'The Diversity Visa Lottery is free to enter ($1 fee since 2025). Scammers charge $50-$500 to "submit" entries or send fake winner notification emails demanding processing fees.',
      zh: '多元化签证抽签是免费参加的（2025年起收$1费用）。骗子收取$50-$500来"提交"申请，或发送虚假中奖通知邮件要求支付处理费。',
    },
    howToSpot: {
      en: [
        'The only legitimate submission site is dvprogram.state.gov',
        'The State Department never emails or calls winners',
        'Any site charging a fee to submit your DV entry is a scam',
        'Emails claiming you "won" before results are officially posted',
      ],
      zh: [
        '唯一合法的提交网站是dvprogram.state.gov',
        '国务院从不给中奖者发邮件或致电',
        '任何收费提交DV申请的网站都是骗局',
        '在官方公布结果前声称你"中奖"的邮件',
      ],
    },
    whatToDo: {
      en: [
        'Report to the FTC at ReportFraud.ftc.gov',
        'Only use dvprogram.state.gov to check results',
        'Never pay anyone to submit a DV lottery entry',
      ],
      zh: [
        '向FTC举报：ReportFraud.ftc.gov',
        '只通过dvprogram.state.gov查看结果',
        '不要付钱给任何人提交DV抽签申请',
      ],
    },
    example: {
      en: '2.5 million fraudulent DV-2025 entries discovered by the State Department, many submitted by scam services charging victims hundreds of dollars.',
      zh: '国务院发现250万份DV-2025欺诈申请，其中许多由骗局服务提交，向受害者收取数百美元。',
    },
    severity: 'amber',
  },
];

interface VerifyStep {
  icon: string;
  title: { en: string; zh: string };
  desc: { en: string; zh: string };
}

const verifySteps: VerifyStep[] = [
  {
    icon: 'scale',
    title: { en: 'State Bar License', zh: '州律师执照' },
    desc: {
      en: 'Search your state\'s bar association website to verify active license status. Every licensed attorney has a publicly searchable bar number.',
      zh: '在你所在州的律师协会网站上搜索，验证其执照是否有效。每位执业律师都有可公开查询的律师编号。',
    },
  },
  {
    icon: 'award',
    title: { en: 'AILA Membership', zh: 'AILA会员资格' },
    desc: {
      en: 'Check aila.org (American Immigration Lawyers Association). Membership is voluntary but indicates specialization in immigration law.',
      zh: '查看aila.org（美国移民律师协会）。会员资格是自愿的，但表明专注于移民法。',
    },
  },
  {
    icon: 'gavel',
    title: { en: 'EOIR Registration', zh: 'EOIR注册' },
    desc: {
      en: 'Check the DOJ practitioners list at justice.gov/eoir. Attorneys practicing before immigration courts must be registered.',
      zh: '在justice.gov/eoir查看DOJ执业者名单。在移民法庭执业的律师必须注册。',
    },
  },
  {
    icon: 'search',
    title: { en: 'Disciplinary History', zh: '处分记录' },
    desc: {
      en: 'Search your state bar\'s discipline records for any sanctions, suspensions, or disbarments. Past issues are publicly available.',
      zh: '在你所在州律师协会的处分记录中搜索是否有制裁、停业或吊销执照的记录。历史问题可公开查询。',
    },
  },
  {
    icon: 'badge-check',
    title: { en: 'DOJ Accredited Representative', zh: 'DOJ认可代表' },
    desc: {
      en: 'For non-attorneys: verify accreditation at justice.gov/eoir. DOJ-recognized organizations can designate accredited representatives to assist with immigration cases.',
      zh: '针对非律师：在justice.gov/eoir验证认可资格。DOJ认可的组织可以指定认可代表协助处理移民案件。',
    },
  },
];

interface ReportRow {
  agency: { en: string; zh: string };
  whatToReport: { en: string; zh: string };
  howToReport: { en: string; zh: string };
}

const reportingResources: ReportRow[] = [
  {
    agency: { en: 'USCIS', zh: 'USCIS' },
    whatToReport: { en: 'Immigration benefit fraud', zh: '移民福利欺诈' },
    howToReport: { en: 'uscis.gov/report-fraud', zh: 'uscis.gov/report-fraud' },
  },
  {
    agency: { en: 'ICE / HSI', zh: 'ICE / HSI' },
    whatToReport: { en: 'Trafficking, employer exploitation', zh: '人口贩卖、雇主剥削' },
    howToReport: { en: '866-347-2423', zh: '866-347-2423' },
  },
  {
    agency: { en: 'DHS OIG', zh: 'DHS OIG' },
    whatToReport: { en: 'Government misconduct', zh: '政府不当行为' },
    howToReport: { en: 'oig.dhs.gov/hotline', zh: 'oig.dhs.gov/hotline' },
  },
  {
    agency: { en: 'EOIR', zh: 'EOIR' },
    whatToReport: { en: 'Immigration court fraud', zh: '移民法庭欺诈' },
    howToReport: { en: '877-388-3840', zh: '877-388-3840' },
  },
  {
    agency: { en: 'FTC', zh: 'FTC' },
    whatToReport: { en: 'Consumer fraud', zh: '消费者欺诈' },
    howToReport: { en: 'ReportFraud.ftc.gov', zh: 'ReportFraud.ftc.gov' },
  },
  {
    agency: { en: 'State AG', zh: '州总检察长' },
    whatToReport: { en: 'Notario fraud, unauthorized practice of law', zh: '"公证人"欺诈、无资质执业' },
    howToReport: { en: 'Search your state AG website', zh: '搜索你所在州的总检察长网站' },
  },
  {
    agency: { en: 'FBI IC3', zh: 'FBI IC3' },
    whatToReport: { en: 'Internet scams', zh: '网络诈骗' },
    howToReport: { en: 'ic3.gov', zh: 'ic3.gov' },
  },
];

interface QuizScenario {
  scenario: { en: string; zh: string };
  isScam: boolean;
  explanation: { en: string; zh: string };
}

const quizScenarios: QuizScenario[] = [
  {
    scenario: {
      en: 'A caller says they\'re from USCIS and you owe $2,000 in fees. Pay now with gift cards or face arrest.',
      zh: '一个来电者说他们来自USCIS，你欠了$2,000的费用。现在用礼品卡支付，否则将被逮捕。',
    },
    isScam: true,
    explanation: {
      en: 'USCIS never calls to demand payment. They send official mail. Gift card payments are a hallmark of fraud.',
      zh: 'USCIS从不致电要求付款，他们发送官方邮件。要求礼品卡支付是欺诈的典型标志。',
    },
  },
  {
    scenario: {
      en: 'Your employer files your H-1B petition but asks you to reimburse the $780 filing fee from your paycheck.',
      zh: '你的雇主为你提交了H-1B申请，但要求你从工资中报销$780的申请费。',
    },
    isScam: true,
    explanation: {
      en: 'The employer must pay all H-1B filing fees. Requiring employee reimbursement violates Department of Labor rules.',
      zh: '雇主必须支付所有H-1B申请费用。要求员工报销违反了劳工部的规定。',
    },
  },
  {
    scenario: {
      en: 'You find a school online that offers Day-1 CPT with all-online classes and no campus visits required.',
      zh: '你在网上找到一所学校，提供Day-1 CPT，全部在线课程，无需到校。',
    },
    isScam: true,
    explanation: {
      en: 'Likely a visa mill. Legitimate schools require meaningful academic engagement and have real campuses. Day-1 CPT with no campus is a major red flag.',
      zh: '很可能是签证工厂。正规学校要求有意义的学术参与并拥有真实校园。无需到校的Day-1 CPT是一个重大警告信号。',
    },
  },
  {
    scenario: {
      en: 'An immigration attorney gives you their bar number, provides a written retainer agreement, and explains the process step by step.',
      zh: '一位移民律师给你他的律师编号，提供书面委托协议，并逐步解释流程。',
    },
    isScam: false,
    explanation: {
      en: 'These are signs of a proper attorney: verifiable credentials, written agreements, and transparent communication.',
      zh: '这些是正规律师的标志：可验证的资质、书面协议和透明的沟通。',
    },
  },
  {
    scenario: {
      en: 'You receive an email saying you won the DV Lottery and need to pay $500 to process your green card.',
      zh: '你收到一封邮件说你中了DV抽签，需要支付$500来处理你的绿卡。',
    },
    isScam: true,
    explanation: {
      en: 'The State Department never emails winners. You can only check results at dvprogram.state.gov. The lottery entry costs $1 since 2025 — no other fees are required to "process" results.',
      zh: '国务院从不给中奖者发邮件。你只能在dvprogram.state.gov查看结果。抽签从2025年起仅需$1——不需要其他费用来"处理"结果。',
    },
  },
  {
    scenario: {
      en: 'A company offers you an H-1B position but says you must find your own client project and there\'s no pay between projects.',
      zh: '一家公司为你提供H-1B职位，但说你必须自己找客户项目，项目间没有工资。',
    },
    isScam: true,
    explanation: {
      en: 'This is classic body shop / benching behavior. H-1B employers must pay the prevailing wage at all times, including between projects. Not paying is a violation of DOL rules.',
      zh: '这是典型的中介公司/待岗行为。H-1B雇主必须始终支付现行工资，包括项目间隔期间。不支付工资违反了劳工部的规定。',
    },
  },
];

export function renderRedFlags(container: HTMLElement): void {
  const lang = currentLang();
  let quizStarted = false;
  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;

  function render() {
    // Build scam category cards
    const scamCardsHtml = scamCategories.map((cat, idx) => {
      const name = lang === 'en' ? cat.name.en : cat.name.zh;
      const desc = lang === 'en' ? cat.desc.en : cat.desc.zh;
      const spots = lang === 'en' ? cat.howToSpot.en : cat.howToSpot.zh;
      const actions = lang === 'en' ? cat.whatToDo.en : cat.whatToDo.zh;
      const example = lang === 'en' ? cat.example.en : cat.example.zh;
      const badgeClass = cat.severity === 'red' ? 'badge-red' : 'badge-amber';
      const badgeLabel = cat.severity === 'red'
        ? tl({ en: 'High Risk', zh: '高风险' })
        : tl({ en: 'Common Scam', zh: '常见骗局' });

      return `
      <details class="card" style="padding:0;overflow:hidden" id="scam-detail-${idx}">
        <summary style="padding:18px 20px;cursor:pointer;font-size:16px;font-weight:600;display:flex;align-items:center;gap:10px;list-style:none;user-select:none">
          <i data-lucide="chevron-right" class="detail-chevron" style="width:18px;height:18px;color:var(--text-secondary);flex-shrink:0;transition:transform 200ms"></i>
          <i data-lucide="${cat.icon}" style="width:20px;height:20px;color:var(--danger);flex-shrink:0"></i>
          <span style="flex:1">${name}</span>
          <span class="badge ${badgeClass}">${badgeLabel}</span>
        </summary>
        <div style="padding:0 20px 20px;border-top:1px solid var(--border)">
          <p style="font-size:14px;color:var(--text-secondary);margin:16px 0;line-height:1.7">${desc}</p>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
            <div>
              <h4 style="font-size:13px;font-weight:600;color:var(--danger);margin:0 0 8px;display:flex;align-items:center;gap:6px">
                <i data-lucide="eye" style="width:14px;height:14px"></i>
                ${tl({ en: 'How to Spot It', zh: '如何识别' })}
              </h4>
              <ul style="margin:0;padding-left:18px;font-size:13px;color:var(--text-secondary);line-height:1.7">
                ${spots.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
            <div>
              <h4 style="font-size:13px;font-weight:600;color:var(--success);margin:0 0 8px;display:flex;align-items:center;gap:6px">
                <i data-lucide="shield-check" style="width:14px;height:14px"></i>
                ${tl({ en: 'What to Do', zh: '应对措施' })}
              </h4>
              <ul style="margin:0;padding-left:18px;font-size:13px;color:var(--text-secondary);line-height:1.7">
                ${actions.map(a => `<li>${a}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 16px;display:flex;align-items:flex-start;gap:10px">
            <i data-lucide="file-warning" style="width:16px;height:16px;color:var(--warning);flex-shrink:0;margin-top:2px"></i>
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--warning);margin-bottom:4px">${tl({ en: 'Real Example', zh: '真实案例' })}</div>
              <div style="font-size:13px;color:var(--text-secondary);line-height:1.6">${example}</div>
            </div>
          </div>
        </div>
      </details>`;
    }).join('');

    // Build attorney verification steps
    const verifyHtml = verifySteps.map((step, idx) => {
      const title = lang === 'en' ? step.title.en : step.title.zh;
      const desc = lang === 'en' ? step.desc.en : step.desc.zh;
      return `
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="width:32px;height:32px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0">${idx + 1}</div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:600;margin-bottom:4px;display:flex;align-items:center;gap:8px">
            <i data-lucide="${step.icon}" style="width:16px;height:16px;color:var(--primary)"></i>
            ${title}
          </div>
          <div style="font-size:13px;color:var(--text-secondary);line-height:1.6">${desc}</div>
        </div>
      </div>`;
    }).join('');

    // Build reporting resources table
    const reportRows = reportingResources.map(r => {
      const agency = lang === 'en' ? r.agency.en : r.agency.zh;
      const what = lang === 'en' ? r.whatToReport.en : r.whatToReport.zh;
      const how = lang === 'en' ? r.howToReport.en : r.howToReport.zh;
      return `<tr>
        <td style="font-weight:600">${agency}</td>
        <td>${what}</td>
        <td style="font-size:13px">${how}</td>
      </tr>`;
    }).join('');

    // Build quiz section
    let quizHtml = '';
    if (!quizStarted) {
      quizHtml = `
      <div style="text-align:center;padding:20px 0">
        <p style="font-size:15px;color:var(--text-secondary);margin-bottom:20px;line-height:1.6">
          ${tl({ en: 'Test your ability to spot immigration scams with 6 real-world scenarios.', zh: '通过6个真实场景测试你识别移民骗局的能力。' })}
        </p>
        <button class="btn-primary" id="quiz-start" style="font-size:16px;padding:14px 32px">
          <i data-lucide="play" style="width:18px;height:18px;vertical-align:-3px"></i>
          ${tl({ en: 'Start Quiz', zh: '开始测试' })}
        </button>
      </div>`;
    } else if (quizIndex < quizScenarios.length) {
      const scenario = quizScenarios[quizIndex];
      const scenarioText = lang === 'en' ? scenario.scenario.en : scenario.scenario.zh;
      const explanation = lang === 'en' ? scenario.explanation.en : scenario.explanation.zh;

      quizHtml = `
      <div style="margin-bottom:8px;font-size:13px;color:var(--text-secondary)">
        ${tl({ en: `Question ${quizIndex + 1} of ${quizScenarios.length}`, zh: `第 ${quizIndex + 1} 题，共 ${quizScenarios.length} 题` })}
      </div>
      <div style="height:4px;background:var(--border);border-radius:4px;margin-bottom:20px">
        <div style="height:100%;width:${((quizIndex) / quizScenarios.length) * 100}%;background:var(--primary);border-radius:4px;transition:width 300ms"></div>
      </div>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:20px">
        <div style="display:flex;align-items:flex-start;gap:12px">
          <i data-lucide="message-circle" style="width:22px;height:22px;color:var(--primary);flex-shrink:0;margin-top:2px"></i>
          <p style="font-size:16px;line-height:1.6;margin:0;font-weight:500">${scenarioText}</p>
        </div>
      </div>
      ${quizAnswered ? `
        <div class="result-card ${(quizAnswered && ((document.querySelector('[data-user-answer]') as HTMLElement)?.dataset.userAnswer === 'correct')) ? 'green' : 'red'}" style="padding:16px 20px;margin-bottom:20px" id="quiz-feedback">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <i data-lucide="${(document.querySelector('[data-user-answer]') as HTMLElement)?.dataset.userAnswer === 'correct' ? 'check-circle' : 'x-circle'}" style="width:20px;height:20px"></i>
            <span style="font-weight:700;font-size:16px">${(document.querySelector('[data-user-answer]') as HTMLElement)?.dataset.userAnswer === 'correct'
              ? tl({ en: 'Correct!', zh: '正确！' })
              : tl({ en: 'Incorrect', zh: '不正确' })}</span>
          </div>
          <p style="font-size:14px;margin:0;line-height:1.6;color:var(--text-secondary)">${explanation}</p>
        </div>
        <div style="text-align:center">
          <button class="btn-primary" id="quiz-next" style="padding:12px 28px">
            ${quizIndex < quizScenarios.length - 1
              ? tl({ en: 'Next Question', zh: '下一题' })
              : tl({ en: 'See Results', zh: '查看结果' })}
            <i data-lucide="arrow-right" style="width:16px;height:16px;vertical-align:-3px"></i>
          </button>
        </div>` : `
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn-primary" id="quiz-scam" style="padding:14px 28px;font-size:16px;background:var(--danger)">
            <i data-lucide="alert-triangle" style="width:18px;height:18px;vertical-align:-3px"></i>
            ${tl({ en: 'Scam', zh: '骗局' })}
          </button>
          <button class="btn-primary" id="quiz-legit" style="padding:14px 28px;font-size:16px;background:var(--success)">
            <i data-lucide="check-circle" style="width:18px;height:18px;vertical-align:-3px"></i>
            ${tl({ en: 'Legitimate', zh: '合法' })}
          </button>
        </div>`}`;
    } else {
      // Quiz complete — show results
      const pct = Math.round((quizScore / quizScenarios.length) * 100);
      const resultColor = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';
      const resultClass = pct >= 80 ? 'green' : pct >= 50 ? 'amber' : 'red';
      const resultMsg = pct >= 80
        ? tl({ en: 'Excellent! You have a strong eye for immigration scams.', zh: '非常好！你对移民骗局有很强的辨别能力。' })
        : pct >= 50
          ? tl({ en: 'Good effort! Review the scam categories above to sharpen your awareness.', zh: '不错的尝试！查看上方的骗局分类以提高警觉。' })
          : tl({ en: 'Keep learning! Review each scam category carefully to protect yourself.', zh: '继续学习！仔细查看每个骗局分类以保护自己。' });

      quizHtml = `
      <div class="result-card ${resultClass}" style="padding:28px;text-align:center">
        <div style="font-size:48px;font-weight:700;color:${resultColor};margin-bottom:8px">${quizScore}/${quizScenarios.length}</div>
        <div style="font-size:14px;color:var(--text-secondary);margin-bottom:12px">${tl({ en: `${pct}% correct`, zh: `正确率 ${pct}%` })}</div>
        <p style="font-size:15px;color:var(--text-secondary);margin:0 0 20px;line-height:1.6">${resultMsg}</p>
        <button class="btn-ghost" id="quiz-restart" style="padding:10px 24px">
          <i data-lucide="rotate-ccw" style="width:16px;height:16px;vertical-align:-3px"></i>
          ${tl({ en: 'Try Again', zh: '再试一次' })}
        </button>
      </div>`;
    }

    container.innerHTML = `<div class="fade-in" style="max-width:800px;margin:0 auto;padding:24px 20px 120px">
      <a href="#/" style="color:var(--text-secondary);display:flex;align-items:center;gap:4px;font-size:14px;margin-bottom:20px">
        <i data-lucide="arrow-left" style="width:16px;height:16px"></i> ${t('common.backHome')}
      </a>

      <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:10px">
        <i data-lucide="shield-alert" style="width:28px;height:28px;color:var(--danger)"></i>
        ${t('tool.redFlags')}
      </h1>
      <p style="color:var(--text-secondary);margin-bottom:24px;line-height:1.6">${tl({
        en: 'Immigration scams cost victims millions every year. Learn to spot the most common schemes, verify your attorney, and know where to report fraud.',
        zh: '移民骗局每年让受害者损失数百万美元。学会识别最常见的骗局、验证你的律师资质，以及了解如何举报欺诈。',
      })}</p>

      <!-- Section 1: Scam Categories -->
      <h2 style="font-size:22px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px">
        <i data-lucide="alert-triangle" style="width:22px;height:22px;color:var(--danger)"></i>
        ${tl({ en: 'Common Scam Types', zh: '常见骗局类型' })}
      </h2>
      <p style="color:var(--text-secondary);font-size:14px;margin-bottom:16px">${tl({ en: 'Click each category to see details, warning signs, and real examples.', zh: '点击各分类查看详情、警告信号和真实案例。' })}</p>
      <div style="display:grid;gap:12px;margin-bottom:32px">
        ${scamCardsHtml}
      </div>

      <!-- Section 2: Attorney Verification -->
      <h2 style="font-size:22px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px">
        <i data-lucide="user-check" style="width:22px;height:22px;color:var(--primary)"></i>
        ${tl({ en: 'Attorney Verification Checklist', zh: '律师资质验证清单' })}
      </h2>
      <div class="card" style="padding:24px;margin-bottom:32px">
        <p style="font-size:14px;color:var(--text-secondary);margin:0 0 20px;line-height:1.6">
          ${tl({
            en: 'Before hiring anyone for immigration help, verify their credentials with these 5 steps:',
            zh: '在雇用任何人提供移民帮助之前，通过以下5个步骤验证其资质：',
          })}
        </p>
        <div style="display:grid;gap:20px">
          ${verifyHtml}
        </div>
      </div>

      <!-- Section 3: Reporting Resources -->
      <h2 style="font-size:22px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px">
        <i data-lucide="megaphone" style="width:22px;height:22px;color:var(--warning)"></i>
        ${tl({ en: 'Where to Report Fraud', zh: '举报欺诈渠道' })}
      </h2>
      <div class="card" style="padding:0;margin-bottom:32px;overflow:hidden">
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>${tl({ en: 'Agency', zh: '机构' })}</th>
                <th>${tl({ en: 'What to Report', zh: '举报内容' })}</th>
                <th>${tl({ en: 'How to Report', zh: '举报方式' })}</th>
              </tr>
            </thead>
            <tbody>
              ${reportRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 4: Quiz -->
      <h2 style="font-size:22px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px">
        <i data-lucide="brain" style="width:22px;height:22px;color:var(--primary)"></i>
        ${tl({ en: '"Is This a Scam?" Quiz', zh: '"这是骗局吗？"测验' })}
      </h2>
      <div class="card" style="padding:24px;margin-bottom:32px" id="quiz-container">
        ${quizHtml}
      </div>

      <p style="font-size:13px;color:var(--text-secondary);text-align:center;margin-bottom:16px">
        <i data-lucide="info" style="width:14px;height:14px;vertical-align:-2px"></i>
        ${t('common.lastUpdated')}
      </p>
    </div>
    ${renderDisclaimer()}`;

    (window as any).lucide?.createIcons();

    // Bind detail chevron rotation
    container.querySelectorAll('details').forEach(detail => {
      detail.addEventListener('toggle', () => {
        const chevron = detail.querySelector('.detail-chevron') as HTMLElement | null;
        if (chevron) {
          chevron.style.transform = detail.open ? 'rotate(90deg)' : 'rotate(0deg)';
        }
      });
    });

    // Bind quiz start
    document.getElementById('quiz-start')?.addEventListener('click', () => {
      quizStarted = true;
      quizIndex = 0;
      quizScore = 0;
      quizAnswered = false;
      render();
      document.getElementById('quiz-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Bind quiz answer buttons
    document.getElementById('quiz-scam')?.addEventListener('click', () => handleQuizAnswer(true));
    document.getElementById('quiz-legit')?.addEventListener('click', () => handleQuizAnswer(false));

    // Bind quiz next button
    document.getElementById('quiz-next')?.addEventListener('click', () => {
      quizIndex++;
      quizAnswered = false;
      render();
      document.getElementById('quiz-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Bind quiz restart
    document.getElementById('quiz-restart')?.addEventListener('click', () => {
      quizStarted = false;
      quizIndex = 0;
      quizScore = 0;
      quizAnswered = false;
      render();
      document.getElementById('quiz-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function handleQuizAnswer(userSaidScam: boolean) {
    const scenario = quizScenarios[quizIndex];
    const isCorrect = userSaidScam === scenario.isScam;
    if (isCorrect) quizScore++;
    quizAnswered = true;

    // Re-render quiz section only (avoid full page re-render flicker)
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    const explanation = currentLang() === 'en' ? scenario.explanation.en : scenario.explanation.zh;
    const resultClass = isCorrect ? 'green' : 'red';

    quizContainer.innerHTML = `
      <div style="margin-bottom:8px;font-size:13px;color:var(--text-secondary)">
        ${tl({ en: `Question ${quizIndex + 1} of ${quizScenarios.length}`, zh: `第 ${quizIndex + 1} 题，共 ${quizScenarios.length} 题` })}
      </div>
      <div style="height:4px;background:var(--border);border-radius:4px;margin-bottom:20px">
        <div style="height:100%;width:${((quizIndex + 1) / quizScenarios.length) * 100}%;background:var(--primary);border-radius:4px;transition:width 300ms"></div>
      </div>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:20px">
        <div style="display:flex;align-items:flex-start;gap:12px">
          <i data-lucide="message-circle" style="width:22px;height:22px;color:var(--primary);flex-shrink:0;margin-top:2px"></i>
          <p style="font-size:16px;line-height:1.6;margin:0;font-weight:500">${currentLang() === 'en' ? scenario.scenario.en : scenario.scenario.zh}</p>
        </div>
      </div>
      <div class="result-card ${resultClass}" style="padding:16px 20px;margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <i data-lucide="${isCorrect ? 'check-circle' : 'x-circle'}" style="width:20px;height:20px"></i>
          <span style="font-weight:700;font-size:16px">${isCorrect
            ? tl({ en: 'Correct!', zh: '正确！' })
            : tl({ en: 'Incorrect', zh: '不正确' })}</span>
          <span class="badge ${scenario.isScam ? 'badge-red' : 'badge-green'}" style="margin-left:auto">${scenario.isScam
            ? tl({ en: 'SCAM', zh: '骗局' })
            : tl({ en: 'LEGITIMATE', zh: '合法' })}</span>
        </div>
        <p style="font-size:14px;margin:0;line-height:1.6;color:var(--text-secondary)">${explanation}</p>
      </div>
      <div style="text-align:center">
        <button class="btn-primary" id="quiz-next" style="padding:12px 28px">
          ${quizIndex < quizScenarios.length - 1
            ? tl({ en: 'Next Question', zh: '下一题' })
            : tl({ en: 'See Results', zh: '查看结果' })}
          <i data-lucide="arrow-right" style="width:16px;height:16px;vertical-align:-3px"></i>
        </button>
      </div>`;

    (window as any).lucide?.createIcons();

    // Bind next button
    document.getElementById('quiz-next')?.addEventListener('click', () => {
      quizIndex++;
      quizAnswered = false;
      render();
      document.getElementById('quiz-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  render();
}

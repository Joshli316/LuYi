# LuYi 路易 — Design Document

## Problem Statement
International students think H-1B is their only option to stay in the US after graduation. They don't know about alternatives (O-1, EB-2 NIW, L-1), start preparing too late, and panic when the H-1B lottery rate sits at 25-35%. This creates unnecessary stress, missed opportunities, and vulnerability to scams.

## Target Users
- **Primary:** International students (undergrad and graduate) in the US, 18-30 years old
- **Secondary:** Recent graduates on OPT/STEM OPT planning their next move
- **Language:** Bilingual English/Chinese (largest international student population)
- **Emotional state:** Anxious, overwhelmed, uncertain about their future in the US
- **Tech comfort:** High — digital natives who prefer self-service tools over appointments

## User Journey

### Discovery
Student hears about LuYi from a friend, WeChat group, or university career center. They're worried about the H-1B lottery and looking for alternatives.

### First Visit
1. Land on home screen → see 9 clear tool cards, warm/friendly tone, "Your immigration journey, simplified"
2. Start with **Pathway Wizard** → answer 5 questions about their situation
3. See personalized results: "Based on your profile, here are your options" — ranked by viability
4. Click into specific tools to go deeper (O-1 assessment, EB comparison, timeline)

### Ongoing Use
- Return to check H-1B lottery odds before registration season (March)
- Use O-1 Evidence Builder checklist throughout grad school
- Check Green Card Backlog Tracker when considering employers
- Use Employer Questions Checklist before job interviews
- Share Red Flags Guide with friends who got suspicious offers

### Exit
- Feel informed and empowered, not more anxious
- Know their next concrete step (not just "consult a lawyer")
- Have a realistic timeline of what to do and when
- Can identify scams and bad employers

## What LuYi IS
- An educational tool that explains immigration pathways in plain language
- A self-assessment tool that helps students evaluate their options
- A planning tool with timelines, checklists, and action items
- A protection tool that teaches students to spot scams
- Free, private, and bilingual

## What LuYi is NOT
- Not legal advice — every screen says so
- Not a case evaluator — we assess likelihood, not guarantee outcomes
- Not a lawyer directory — we teach how to verify lawyers, not recommend specific ones
- Not a filing tool — we don't generate forms or submit applications
- Not a paid service — no premium tier, no upsells, no data collection

## Key Design Rationale

### Why 9 tools instead of one big wizard?
Students have different needs at different points. A senior preparing for the H-1B lottery needs the odds estimator. A freshman wants the evidence builder. A job-seeker needs the employer checklist. Modular tools let users self-select.

### Why client-side only?
Immigration status is extremely sensitive personal information. Zero server = zero breach risk. Students should never have to wonder "who has my data?"

### Why bilingual EN/ZH?
Chinese students are the largest international student population in the US (~290,000). Many are more comfortable reading about complex legal topics in their native language. Full bilingual support isn't a nice-to-have — it's the core differentiator.

### Why "Friendly Guide" design, not "Government Form"?
The immigration system is already intimidating enough. If the tool feels like another government website, students won't use it. The warm, encouraging tone ("Let's explore your options together") reduces anxiety and increases engagement. Duolingo proved that serious educational tools can feel fun.

### Why disclaimers on every output screen?
Legal liability. Immigration advice without a license is unauthorized practice of law. The disclaimers protect both users (sets expectations) and the creator (limits liability). They're non-negotiable.

## Data Sources
All immigration data sourced from 13 research reports (April 2026):
- USCIS official data (H-1B registration numbers, approval rates)
- Department of State Visa Bulletin (priority dates)
- Department of Labor (PERM processing, prevailing wages)
- Immigration law firm analyses (O-1 criteria standards, NIW trends)
- Government enforcement data (scam cases, fraud statistics)

Data is hardcoded (not fetched from APIs) since immigration rules change slowly and accuracy matters more than real-time updates. Note "Last updated: April 2026" prominently.

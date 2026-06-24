/* Default Amazon iNOPs sprint plan (24 Jun - 6 Jul 2026).
   Used on first load and when "Reset to plan" is clicked.
   status: todo | inprogress | done | blocked
   workstream: Form | mGrant | Training | Reports | App  */
window.INOPS_SEED = [
  { id:'t1',  title:'Share finalised execution plan & tracker with Amazon',                     date:'2026-06-24', owner:'Banita',           workstream:'Form',     status:'inprogress', notes:'' },
  { id:'t2',  title:'Send theme-wise form-walkthrough invites to all 12 NGO partners',          date:'2026-06-24', owner:'Banita',           workstream:'Form',     status:'inprogress', notes:'' },
  { id:'t3',  title:'Prepare current-form walkthrough decks (one set per theme)',               date:'2026-06-24', owner:'Fathima + Banita', workstream:'Form',     status:'inprogress', notes:'' },
  { id:'t4',  title:'Form walkthrough & feedback — ICEP: SAAD, Way for Life, Read India',        date:'2026-06-25', owner:'Banita',           workstream:'Form',     status:'todo',       notes:'Theme 1' },
  { id:'t5',  title:'Form walkthrough & feedback — HHH, Jan Sahas',                              date:'2026-06-26', owner:'Banita',           workstream:'Form',     status:'todo',       notes:'Theme 2 Social Entitlement' },
  { id:'t6',  title:'Form walkthrough & feedback — Pinkishe, SHE and We',                        date:'2026-06-26', owner:'Banita',           workstream:'Form',     status:'todo',       notes:'Theme 3 Menstrual Hygiene' },
  { id:'t7',  title:'Form walkthrough & feedback — Food Security: SNEHA, Hunger',                date:'2026-06-29', owner:'Banita',           workstream:'Form',     status:'todo',       notes:'Theme 4' },
  { id:'t8',  title:'Entrepreneurship FORM DESIGN review call — Buzz, ACCESS, GAME',             date:'2026-06-29', owner:'Banita',           workstream:'Form',     status:'todo',       notes:'Theme 5 — call scheduled Monday' },
  { id:'t9',  title:'Consolidate all partner feedback into one master requirement log',          date:'2026-06-29', owner:'Banita',           workstream:'Form',     status:'todo',       notes:'' },
  { id:'t10', title:'Sign off consolidated requirements; begin form revision in mForm',          date:'2026-06-30', owner:'Fathima + Banita', workstream:'Form',     status:'todo',       notes:'' },
  { id:'t11', title:'mGrant — create NGO partner profiles (partner profiling)',                  date:'2026-06-30', owner:'Akshat',           workstream:'mGrant',   status:'todo',       notes:'' },
  { id:'t12', title:'Continue form revision; run internal review of revised forms',              date:'2026-07-01', owner:'Fathima + Banita', workstream:'Form',     status:'todo',       notes:'' },
  { id:'t13', title:'mGrant — create grants per partner-wise grant application plan',            date:'2026-07-01', owner:'Akshat',           workstream:'mGrant',   status:'todo',       notes:'' },
  { id:'t14', title:'Finish form revision; internal validation; onboarding + NGO training pack', date:'2026-07-02', owner:'Fathima + Banita', workstream:'Form',     status:'todo',       notes:'' },
  { id:'t15', title:'mGrant — application set-up + GAF data upload + create NGO users',          date:'2026-07-02', owner:'Akshat',           workstream:'mGrant',   status:'todo',       notes:'' },
  { id:'t16', title:'DEMO data-collection App to Amazon; form sign-off; surveyor training pack', date:'2026-07-03', owner:'Banita + Fathima', workstream:'App',      status:'todo',       notes:'🏁 ANCHOR — App Demo Ready' },
  { id:'t17', title:'mGrant — onboard users + set up Weekly & Monthly reports + rehearse demo',  date:'2026-07-03', owner:'Akshat + Banita',  workstream:'mGrant',   status:'todo',       notes:'' },
  { id:'t18', title:'DEMO mGrant to Amazon — including Weekly & Monthly reports',                date:'2026-07-06', owner:'Banita + Akshat',  workstream:'mGrant',   status:'todo',       notes:'🏁 ANCHOR — mGrant Demo Ready' },
  { id:'t19', title:'Schedule & kick off NGO partner training on mGrant',                        date:'2026-07-06', owner:'Banita',           workstream:'Training', status:'todo',       notes:'' },
  { id:'t20', title:'Weekly Report — build & validate (mGrant)',                                 date:'2026-07-03', owner:'Banita',           workstream:'Reports',  status:'inprogress', notes:'Milestone M1' },
  { id:'t21', title:'Monthly Report — build & validate (mGrant)',                                date:'2026-07-03', owner:'Banita',           workstream:'Reports',  status:'inprogress', notes:'Milestone M1' },
  { id:'t22', title:'Legacy data upload (scope to be expanded)',                                 date:'',           owner:'Akshat',           workstream:'mGrant',   status:'todo',       notes:'Banita to detail source files, scope & cut-off' }
];

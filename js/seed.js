/* ===== Amazon iNOPs — epics + seed plan =====
   status: todo | inprogress | atrisk | done | blocked
   Every task has exactly ONE epic (primary). Epic progress is computed
   from task status (see app.js); baseline is a reference starting point. */

window.INOPS_EPICS = [
  /* Go-Live roll-ups — progress collated from their member epics + own tasks */
  { key:'mgrant-golive', name:'mGrant Go-Live', project:'mGrant', baseline:0, goLiveDate:'2026-07-01',
    goLiveNote:'platform ~90% ready · data upload & validation in progress',
    rollup:['mgrant-setup','mgrant-onboard','mgrant-train','data-upload','dash-reports','kpi'] },
  { key:'mform-golive',  name:'mForm Go-Live',  project:'mForm', baseline:0, goLiveDate:'2026-07-03', goLiveNote:'temporary — depends on Play Store listing the app',
    rollup:['form-design','form-dev','app-dev','app-train','app-onboard','partner-fb'] },
  /* mForm project (app + form + their training/onboarding) */
  { key:'form-design',    name:'Form Design Refinement',     project:'mForm', baseline:100 },
  { key:'partner-fb',     name:'Partner Feedback – Round 1',  project:'mForm', baseline:100 },
  { key:'form-dev',       name:'Form Development',           project:'mForm', baseline:60 },
  { key:'app-dev',        name:'Application Development',     project:'mForm', baseline:30 },
  { key:'app-train',      name:'App Training',               project:'mForm', baseline:0  },
  { key:'app-onboard',    name:'App User Onboarding',        project:'mForm', baseline:0  },
  /* mGrant project (everything else) */
  /* weight = relative effort toward mGrant go-live; platform Setup is the dominant chunk */
  { key:'mgrant-setup',   name:'mGrant Setup',               project:'mGrant', baseline:95, weight:88 },
  { key:'mgrant-onboard', name:'mGrant User Onboarding',     project:'mGrant', baseline:0,  weight:2  },
  { key:'mgrant-train',   name:'mGrant Training',            project:'mGrant', baseline:0,  weight:2  },
  { key:'data-upload',    name:'Data Upload',                project:'mGrant', baseline:0,  weight:5  },
  { key:'dash-reports',   name:'Dashboard & Reports',        project:'mGrant', baseline:0,  weight:2  },
  { key:'kpi',            name:'KPI Refinement',             project:'mGrant', baseline:0,  weight:1  },

  /* ===== Phase 2 — planned roadmap (post go-live), ref. M1–M4 milestone plan ===== */
  { key:'fin-disb',  name:'Financial, Disbursement & Invoicing', project:'mGrant', phase:2, band:'M2 · Jul',       baseline:0 },
  { key:'analytics', name:'Analytics & Workflow Pilot',          project:'mGrant', phase:2, band:'M2 · Jul',       baseline:0 },
  { key:'csr-aap',   name:'CSR Plan & AAP (+ Landing Pages)',    project:'mGrant', phase:2, band:'M3 · Aug',       baseline:0 },
  { key:'approvals', name:'Approval Workflows',                  project:'mGrant', phase:2, band:'M4 · Aug–Sep',   baseline:0 },
  { key:'notifs',    name:'Notifications',                       project:'mGrant', phase:2, band:'M4 · Sep',       baseline:0 },
  { key:'alignment', name:'Alignment & Stabilisation',          project:'mGrant', phase:2, band:'M4 · Sep–Oct',   baseline:0 },
  { key:'pfb-r2',    name:'Partner Feedback – Round 2 (enhancements)', project:'mForm', phase:2, band:'Next phase', baseline:0 }
];

window.INOPS_SEED = [
  /* ---------- Partner Feedback — Cycle 1 (completed) ---------- */
  { id:'r1a', title:'Round 1 — partner form walkthroughs (all 12 partners)', date:'', owner:'Banita', epic:'partner-fb', status:'done', notes:'Cycle 1 complete' },
  { id:'r1b', title:'Round 1 — feedback consolidated', date:'', owner:'Banita', epic:'partner-fb', status:'done', notes:'Cycle 1 complete' },
  { id:'r1c', title:'Round 1 — form change requests logged', date:'', owner:'Banita', epic:'partner-fb', status:'done', notes:'Cycle 1 complete' },
  { id:'r1d', title:'Round 1 — partner sign-off captured', date:'', owner:'Banita', epic:'partner-fb', status:'done', notes:'Cycle 1 complete' },

  /* Cycle 2 (Round 2) partner-feedback tasks removed — deferred to next phase per mail thread.
     Tracked as the Phase 2 epic 'Partner Feedback – Round 2 (enhancements)'. */

  /* ---------- Form Design Refinement ---------- */
  { id:'fd1', title:'Finalise ICEP form design',                date:'', owner:'Fathima + Banita', epic:'form-design', status:'done', notes:'' },
  { id:'fd2', title:'Finalise Social Entitlement form design',  date:'', owner:'Fathima + Banita', epic:'form-design', status:'done', notes:'' },
  { id:'fd3', title:'Finalise Menstrual Hygiene form design',   date:'', owner:'Fathima + Banita', epic:'form-design', status:'done', notes:'' },
  { id:'fd4', title:'Finalise Food Security form design',       date:'', owner:'Fathima + Banita', epic:'form-design', status:'done', notes:'' },
  { id:'t3',  title:'Prepare current-form walkthrough decks (per theme)', date:'2026-06-24', owner:'Fathima + Banita', epic:'form-design', status:'inprogress', notes:'' },
  { id:'t8',  title:'Entrepreneurship form design review call — Buzz, ACCESS, GAME', date:'2026-06-29', owner:'Banita', epic:'form-design', status:'todo', milestone:true, notes:'Call scheduled Monday 29 Jun' },
  { id:'fd5', title:'SAAD Foundation form design',              date:'', owner:'Banita', epic:'form-design', status:'blocked',
    risk:'MoU not yet supplied by SAAD Foundation', impact:'SAAD form design & build cannot start; their data collection is blocked',
    resolution:'2026-07-04', mitigation:'Escalate to Amazon to expedite MoU; proceed with other 11 partners in parallel', notes:'Blocked on MoU' },

  /* ---------- Form Development ---------- */
  { id:'fv1', title:'Build ICEP forms in mForm',                 date:'', owner:'Fathima + Banita', epic:'form-dev', status:'done', notes:'' },
  { id:'fv2', title:'Build Social Entitlement & Menstrual forms', date:'', owner:'Fathima + Banita', epic:'form-dev', status:'done', notes:'' },
  { id:'fv3', title:'Build Food Security & Entrepreneurship forms', date:'', owner:'Fathima + Banita', epic:'form-dev', status:'done', notes:'' },
  { id:'fv4', title:'Configure form logic & validations',        date:'', owner:'Fathima + Banita', epic:'form-dev', status:'done', notes:'' },
  { id:'t10', title:'Sign off requirements; begin form revision (mForm)', date:'2026-06-30', owner:'Fathima + Banita', epic:'form-dev', status:'todo', notes:'' },
  { id:'t12', title:'Continue form revision; run internal review',        date:'2026-07-01', owner:'Fathima + Banita', epic:'form-dev', status:'todo', notes:'' },
  { id:'t14', title:'Finish form revision; internal validation; onboarding pack', date:'2026-07-02', owner:'Fathima + Banita', epic:'form-dev', status:'todo', notes:'' },

  /* ---------- Application Development ---------- */
  { id:'ad1', title:'Build data-collection app (mForm) core',  date:'', owner:'Dev + Fathima', epic:'app-dev', status:'done', notes:'Application ready per agreed scope' },
  { id:'ad2', title:'App–form integration & rendering',        date:'', owner:'Dev + Fathima', epic:'app-dev', status:'done', notes:'' },
  { id:'ad3', title:'App build & UAT smoke test',              date:'', owner:'Dev + Fathima', epic:'app-dev', status:'done', notes:'' },
  { id:'t16', title:'DEMO data-collection App to Amazon; form sign-off; surveyor training pack', date:'2026-07-03', owner:'Banita + Fathima', epic:'app-dev', status:'todo', milestone:true, notes:'🏁 ANCHOR — App Demo Ready' },

  /* ---------- mGrant Setup ---------- */
  { id:'ms1', title:'mGrant instance & programme hierarchy config', date:'', owner:'Akshat', epic:'mgrant-setup', status:'done', notes:'' },
  { id:'ms2', title:'Grant types & lifecycle workflow config',      date:'', owner:'Akshat', epic:'mgrant-setup', status:'done', notes:'' },
  { id:'ms3', title:'Roles, permissions & approval workflow',       date:'', owner:'Akshat', epic:'mgrant-setup', status:'done', notes:'' },
  { id:'ms4', title:'Donor & financial year setup',                 date:'', owner:'Akshat', epic:'mgrant-setup', status:'done', notes:'' },
  { id:'ms5', title:'Final setup QA & validation',                  date:'', owner:'Akshat', epic:'mgrant-setup', status:'inprogress', notes:'Platform built; final validation in progress (~90–95%)' },

  /* ---------- mGrant User Onboarding ---------- */
  { id:'t11', title:'mGrant — create NGO partner profiles (profiling)', date:'2026-06-30', owner:'Akshat', epic:'mgrant-onboard', status:'todo', notes:'' },
  { id:'t13', title:'mGrant — create grants per partner-wise application plan', date:'2026-07-01', owner:'Akshat', epic:'mgrant-onboard', status:'todo', notes:'' },
  { id:'t17', title:'mGrant — onboard NGO users + rehearse demo', date:'2026-07-03', owner:'Akshat + Banita', epic:'mgrant-onboard', status:'todo', notes:'' },

  /* ---------- Data Upload ---------- */
  { id:'t15', title:'mGrant — application set-up + GAF data upload + create users', date:'2026-07-02', owner:'Akshat', epic:'data-upload', status:'inprogress', notes:'Data upload in progress' },
  { id:'t22', title:'Legacy data upload', date:'', owner:'Akshat', epic:'data-upload', status:'atrisk',
    risk:'Legacy data scope, source files & cut-off date not yet defined', impact:'Historical data may be missing at go-live; reporting continuity affected',
    resolution:'2026-07-10', mitigation:'Banita to define legacy scope & share source files; schedule upload after mGrant demo', notes:'Scope to be expanded' },

  /* ---------- KPI Refinement ---------- */
  { id:'k1', title:'Refine programme KPIs & logframe indicators', date:'2026-07-13', owner:'Banita', epic:'kpi', status:'todo', notes:'Post 10 Jul rollout' },
  { id:'k2', title:'Map KPIs to mGrant & forms',                  date:'2026-07-13', owner:'Banita', epic:'kpi', status:'todo', notes:'Post 10 Jul rollout' },

  /* ---------- mGrant Training ---------- */
  { id:'t19', title:'Schedule & kick off NGO partner training on mGrant', date:'2026-07-06', owner:'Banita', epic:'mgrant-train', status:'todo', notes:'' },
  { id:'mt1', title:'Prepare mGrant training material & demo environment', date:'', owner:'Banita', epic:'mgrant-train', status:'todo', notes:'' },

  /* ---------- App Training ---------- */
  { id:'at1', title:'Prepare app training material', date:'', owner:'Banita', epic:'app-train', status:'todo', notes:'' },
  { id:'at2', title:'Conduct surveyor / field-team app training sessions', date:'', owner:'Banita', epic:'app-train', status:'todo', notes:'' },
  { id:'ob6', title:'Partner onboarding support, app training & query resolution', date:'2026-07-06', owner:'Banita', epic:'app-train', status:'todo', notes:'6 – 10 Jul' },

  /* ---------- App User Onboarding ---------- */
  { id:'ob1', title:'ICEP — user onboarding for all 3 partners (SAAD, Way for Life, Read India)', date:'2026-06-29', owner:'Banita', epic:'app-onboard', status:'todo', notes:'Rollout — agreed app flow' },
  { id:'ob2', title:'Social Entitlement — Triple H (HHH) user onboarding',                        date:'2026-06-29', owner:'Banita', epic:'app-onboard', status:'todo', notes:'Rollout' },
  { id:'ob3', title:'Menstrual Hygiene — user creation & onboarding initiation (Pinkishe, SHE and We)', date:'2026-06-30', owner:'Banita', epic:'app-onboard', status:'todo', notes:'30 Jun – 1 Jul' },
  { id:'ob4', title:'Entrepreneurship — discussion with Amazon team & ADS walkthrough scheduling', date:'2026-06-30', owner:'Banita', epic:'app-onboard', status:'todo', notes:'' },
  { id:'ob5', title:'ADS (ACCESS) application walkthrough',                                        date:'2026-07-02', owner:'Banita', epic:'app-onboard', status:'todo', notes:'2 – 3 Jul' },
  { id:'ao2', title:'Confirm app adoption for own-platform partners', date:'', owner:'Banita', epic:'app-onboard', status:'atrisk',
    risk:'HHH (TTC), Jan Sahas (Resilience Connect) & Buzz (Buzz app) use their own field apps', impact:'These partners may not adopt the data-collection app; data-integration gap',
    resolution:'2026-07-08', mitigation:'Confirm per partner: adopt app vs API/data-sync from existing platform', notes:'' },

  /* ---------- Dashboard & Reports ---------- */
  { id:'t20', title:'Weekly Report — build & validate (mGrant)',  date:'2026-07-03', owner:'Banita', epic:'dash-reports', status:'inprogress', notes:'Milestone M1' },
  { id:'t21', title:'Monthly Report — build & validate (mGrant)', date:'2026-07-03', owner:'Banita', epic:'dash-reports', status:'inprogress', notes:'Milestone M1' },
  { id:'dr1', title:'Build programme & CSR dashboards',           date:'2026-07-13', owner:'Banita', epic:'dash-reports', status:'todo', notes:'Post 10 Jul rollout' },

  /* ---------- Go-Live ---------- */
  { id:'t18', title:'DEMO mGrant to Amazon — incl Weekly & Monthly reports', date:'2026-07-06', owner:'Banita + Akshat', epic:'mgrant-golive', status:'todo', milestone:true, notes:'🏁 ANCHOR — mGrant Demo Ready' },
  { id:'gl1', title:'mGrant production go-live', date:'2026-07-01', owner:'Banita + Akshat', epic:'mgrant-golive', status:'todo', milestone:true, notes:'Target go-live 1 Jul' },
  { id:'gl2', title:'mForm production go-live',  date:'2026-07-03', owner:'Banita + Fathima', epic:'mform-golive', status:'todo', milestone:true, notes:'Temporary 3 Jul — depends on Play Store listing the app' },

  /* ========== PHASE 2 — planned (M2–M4, Jul–Sep 2026) ========== */
  { id:'p2a', title:'Configure Financial module',                       date:'2026-07-15', owner:'Akshat', epic:'fin-disb',  status:'todo', phase:2, notes:'M2' },
  { id:'p2b', title:'Disbursement + Utilisation Certificate (UC) workflow', date:'2026-07-18', owner:'Akshat', epic:'fin-disb', status:'todo', phase:2, notes:'M2' },
  { id:'p2c', title:'PO & Invoice management',                          date:'2026-07-22', owner:'Akshat', epic:'fin-disb',  status:'todo', phase:2, notes:'M2' },
  { id:'p2d', title:'IA + Admin Expense tracking',                      date:'2026-07-25', owner:'Akshat', epic:'fin-disb',  status:'todo', phase:2, notes:'M2' },
  { id:'p2e', title:'Analytics setup',                                  date:'2026-07-20', owner:'Banita', epic:'analytics', status:'todo', phase:2, notes:'M2' },
  { id:'p2f', title:'Workflow pilot with one partner',                  date:'2026-07-28', owner:'Akshat', epic:'analytics', status:'todo', phase:2, notes:'M2' },
  { id:'p2g', title:'CSR Annual Action Plan (AAP) module',              date:'2026-08-12', owner:'Banita', epic:'csr-aap',   status:'todo', phase:2, notes:'M3' },
  { id:'p2h', title:'Landing pages',                                    date:'2026-08-20', owner:'Banita', epic:'csr-aap',   status:'todo', phase:2, notes:'M3' },
  { id:'p2i', title:'Configure multi-level approval workflows',         date:'2026-08-28', owner:'Akshat', epic:'approvals', status:'todo', phase:2, notes:'M4' },
  { id:'p2j', title:'Approval matrix per grant type',                   date:'2026-09-05', owner:'Akshat', epic:'approvals', status:'todo', phase:2, notes:'M4' },
  { id:'p2k', title:'Notification & email templates',                   date:'2026-09-12', owner:'Banita', epic:'notifs',    status:'todo', phase:2, notes:'M4' },
  { id:'p2l', title:'Notification trigger configuration',               date:'2026-09-18', owner:'Akshat', epic:'notifs',    status:'todo', phase:2, notes:'M4' },
  { id:'p2m', title:'Final alignment review with Amazon',               date:'2026-09-25', owner:'Banita', epic:'alignment', status:'todo', phase:2, notes:'M4' },
  { id:'p2n', title:'Stabilisation & troubleshooting',                  date:'2026-10-15', owner:'Banita + Akshat', epic:'alignment', status:'todo', phase:2, notes:'Q4' }
];

/* ===== Amazon iNOPs — epics + seed plan =====
   status: todo | inprogress | atrisk | done | blocked
   Every task has exactly ONE epic (primary). Epic progress is computed
   from task status (see app.js); baseline is a reference starting point. */

window.INOPS_EPICS = [
  { key:'form-design',    name:'Form Design Refinement',     baseline:100 },
  { key:'partner-fb',     name:'Partner Feedback (2 cycles)', baseline:50 },
  { key:'form-dev',       name:'Form Development',           baseline:60 },
  { key:'app-dev',        name:'Application Development',     baseline:30 },
  { key:'mgrant-setup',   name:'mGrant Setup',               baseline:95 },
  { key:'kpi',            name:'KPI Refinement',             baseline:0  },
  { key:'data-upload',    name:'Data Upload',                baseline:0  },
  { key:'mgrant-onboard', name:'mGrant User Onboarding',     baseline:0  },
  { key:'app-onboard',    name:'App User Onboarding',        baseline:0  },
  { key:'mgrant-train',   name:'mGrant Training',            baseline:0  },
  { key:'app-train',      name:'App Training',               baseline:0  },
  { key:'dash-reports',   name:'Dashboard & Reports',        baseline:0  },
  { key:'mform-golive',   name:'mForm Go-Live',              baseline:0  },
  { key:'mgrant-golive',  name:'mGrant Go-Live',             baseline:0  }
];

window.INOPS_SEED = [
  /* ---------- Partner Feedback — Cycle 1 (completed) ---------- */
  { id:'r1a', title:'Round 1 — partner form walkthroughs (all 12 partners)', date:'', owner:'Banita', epic:'partner-fb', status:'done', notes:'Cycle 1 complete' },
  { id:'r1b', title:'Round 1 — feedback consolidated', date:'', owner:'Banita', epic:'partner-fb', status:'done', notes:'Cycle 1 complete' },
  { id:'r1c', title:'Round 1 — form change requests logged', date:'', owner:'Banita', epic:'partner-fb', status:'done', notes:'Cycle 1 complete' },
  { id:'r1d', title:'Round 1 — partner sign-off captured', date:'', owner:'Banita', epic:'partner-fb', status:'done', notes:'Cycle 1 complete' },

  /* ---------- Partner Feedback — Cycle 2 (this sprint) ---------- */
  { id:'t1',  title:'Share finalised execution plan & tracker with Amazon',                 date:'2026-06-24', owner:'Banita',           epic:'partner-fb', status:'inprogress', notes:'Round 2 kickoff' },
  { id:'t2',  title:'Send theme-wise form-walkthrough invites to all 12 NGO partners',      date:'2026-06-24', owner:'Banita',           epic:'partner-fb', status:'inprogress', notes:'Round 2' },
  { id:'t4',  title:'Round 2 walkthrough & feedback — ICEP: SAAD, Way for Life, Read India', date:'2026-06-25', owner:'Banita',          epic:'partner-fb', status:'todo', notes:'' },
  { id:'t5',  title:'Round 2 walkthrough & feedback — HHH, Jan Sahas',                       date:'2026-06-26', owner:'Banita',          epic:'partner-fb', status:'todo', notes:'' },
  { id:'t6',  title:'Round 2 walkthrough & feedback — Pinkishe, SHE and We',                 date:'2026-06-26', owner:'Banita',          epic:'partner-fb', status:'todo', notes:'' },
  { id:'t7',  title:'Round 2 walkthrough & feedback — Food Security: SNEHA, Hunger',         date:'2026-06-29', owner:'Banita',          epic:'partner-fb', status:'todo', notes:'' },
  { id:'t9',  title:'Round 2 — consolidate all partner feedback into master log',           date:'2026-06-29', owner:'Banita',           epic:'partner-fb', status:'todo', notes:'Closes Cycle 2 -> 100%' },

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
  { id:'ad1', title:'Build data-collection app (mForm) core',  date:'', owner:'Dev + Fathima', epic:'app-dev', status:'inprogress', notes:'' },
  { id:'ad2', title:'App–form integration & rendering',        date:'', owner:'Dev + Fathima', epic:'app-dev', status:'inprogress', notes:'' },
  { id:'ad3', title:'App build & UAT smoke test',              date:'', owner:'Dev + Fathima', epic:'app-dev', status:'todo', notes:'' },
  { id:'t16', title:'DEMO data-collection App to Amazon; form sign-off; surveyor training pack', date:'2026-07-03', owner:'Banita + Fathima', epic:'app-dev', status:'todo', milestone:true, notes:'🏁 ANCHOR — App Demo Ready' },

  /* ---------- mGrant Setup ---------- */
  { id:'ms1', title:'mGrant instance & programme hierarchy config', date:'', owner:'Akshat', epic:'mgrant-setup', status:'done', notes:'' },
  { id:'ms2', title:'Grant types & lifecycle workflow config',      date:'', owner:'Akshat', epic:'mgrant-setup', status:'done', notes:'' },
  { id:'ms3', title:'Roles, permissions & approval workflow',       date:'', owner:'Akshat', epic:'mgrant-setup', status:'done', notes:'' },
  { id:'ms4', title:'Donor & financial year setup',                 date:'', owner:'Akshat', epic:'mgrant-setup', status:'done', notes:'' },
  { id:'ms5', title:'Final setup QA & UAT',                         date:'', owner:'Akshat', epic:'mgrant-setup', status:'inprogress', notes:'' },

  /* ---------- mGrant User Onboarding ---------- */
  { id:'t11', title:'mGrant — create NGO partner profiles (profiling)', date:'2026-06-30', owner:'Akshat', epic:'mgrant-onboard', status:'todo', notes:'' },
  { id:'t13', title:'mGrant — create grants per partner-wise application plan', date:'2026-07-01', owner:'Akshat', epic:'mgrant-onboard', status:'todo', notes:'' },
  { id:'t17', title:'mGrant — onboard NGO users + rehearse demo', date:'2026-07-03', owner:'Akshat + Banita', epic:'mgrant-onboard', status:'todo', notes:'' },

  /* ---------- Data Upload ---------- */
  { id:'t15', title:'mGrant — application set-up + GAF data upload + create users', date:'2026-07-02', owner:'Akshat', epic:'data-upload', status:'todo', notes:'' },
  { id:'t22', title:'Legacy data upload', date:'', owner:'Akshat', epic:'data-upload', status:'atrisk',
    risk:'Legacy data scope, source files & cut-off date not yet defined', impact:'Historical data may be missing at go-live; reporting continuity affected',
    resolution:'2026-07-10', mitigation:'Banita to define legacy scope & share source files; schedule upload after mGrant demo', notes:'Scope to be expanded' },

  /* ---------- KPI Refinement ---------- */
  { id:'k1', title:'Refine programme KPIs & logframe indicators', date:'', owner:'Banita', epic:'kpi', status:'todo', notes:'' },
  { id:'k2', title:'Map KPIs to mGrant & forms',                  date:'', owner:'Banita', epic:'kpi', status:'todo', notes:'' },

  /* ---------- mGrant Training ---------- */
  { id:'t19', title:'Schedule & kick off NGO partner training on mGrant', date:'2026-07-06', owner:'Banita', epic:'mgrant-train', status:'todo', notes:'' },
  { id:'mt1', title:'Prepare mGrant training material & demo environment', date:'', owner:'Banita', epic:'mgrant-train', status:'todo', notes:'' },

  /* ---------- App Training ---------- */
  { id:'at1', title:'Prepare app training material', date:'', owner:'Banita', epic:'app-train', status:'todo', notes:'' },
  { id:'at2', title:'Conduct surveyor / field-team app training sessions', date:'', owner:'Banita', epic:'app-train', status:'todo', notes:'' },

  /* ---------- App User Onboarding ---------- */
  { id:'ao1', title:'Create app users for field surveyors', date:'', owner:'Banita', epic:'app-onboard', status:'todo', notes:'' },
  { id:'ao2', title:'Confirm app adoption for own-platform partners', date:'', owner:'Banita', epic:'app-onboard', status:'atrisk',
    risk:'HHH (TTC), Jan Sahas (Resilience Connect) & Buzz (Buzz app) use their own field apps', impact:'These partners may not adopt the data-collection app; data-integration gap',
    resolution:'2026-07-08', mitigation:'Confirm per partner: adopt app vs API/data-sync from existing platform', notes:'' },

  /* ---------- Dashboard & Reports ---------- */
  { id:'t20', title:'Weekly Report — build & validate (mGrant)',  date:'2026-07-03', owner:'Banita', epic:'dash-reports', status:'inprogress', notes:'Milestone M1' },
  { id:'t21', title:'Monthly Report — build & validate (mGrant)', date:'2026-07-03', owner:'Banita', epic:'dash-reports', status:'inprogress', notes:'Milestone M1' },
  { id:'dr1', title:'Build programme & CSR dashboards',           date:'', owner:'Banita', epic:'dash-reports', status:'todo', notes:'Milestone M3 (Jul–Aug)' },

  /* ---------- Go-Live ---------- */
  { id:'t18', title:'DEMO mGrant to Amazon — incl Weekly & Monthly reports', date:'2026-07-06', owner:'Banita + Akshat', epic:'mgrant-golive', status:'todo', milestone:true, notes:'🏁 ANCHOR — mGrant Demo Ready' },
  { id:'gl1', title:'mGrant production go-live', date:'2026-07-29', owner:'Banita + Akshat', epic:'mgrant-golive', status:'todo', notes:'Target 29 Jul' },
  { id:'gl2', title:'mForm production go-live',  date:'2026-07-29', owner:'Banita + Fathima', epic:'mform-golive', status:'todo', notes:'Target early Aug possible' }
];

/* Amazon iNOPs Task Tracker — vanilla JS, localStorage persistence */
(function () {
  'use strict';
  const KEY = 'inops_tasks_v4';   // bump = ignore old cached data, load current plan
  const STATUSES = {
    todo:       { label: 'Not Started', color: 'var(--todo)'  },
    inprogress: { label: 'In Progress', color: 'var(--prog)'  },
    atrisk:     { label: 'At Risk',     color: 'var(--risk)'  },
    done:       { label: 'Done',        color: 'var(--done)'  },
    blocked:    { label: 'Blocked',     color: 'var(--block)' }
  };
  const EPICS = window.INOPS_EPICS || [];
  const epicName = k => (EPICS.find(e => e.key === k) || {}).name || k || '—';
  const epicProject = k => (EPICS.find(e => e.key === k) || {}).project || 'mGrant';
  const epicPhase = k => (EPICS.find(e => e.key === k) || {}).phase || 1;
  const epicBand = k => (EPICS.find(e => e.key === k) || {}).band || '';
  const SPRINT_START = '2026-06-24';
  const SPRINT_END   = '2026-07-06';

  let tasks = load();
  stampProjects();

  /* ---------- storage ---------- */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return clone(window.INOPS_SEED || []);
  }
  // link every task to its project (mForm / mGrant) and phase via its epic
  function stampProjects() { tasks.forEach(t => { t.project = epicProject(t.epic); t.phase = epicPhase(t.epic); }); }
  function save() { localStorage.setItem(KEY, JSON.stringify(tasks)); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function uid() { return 't' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36); }

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }
  function dow(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long' });
  }
  function isWeekend(iso) {
    const n = new Date(iso + 'T00:00:00').getDay();
    return n === 0 || n === 6;
  }
  const pad2 = n => String(n).padStart(2, '0');
  function todayISO() { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
  function isoToDate(iso) { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); }
  function dateToISO(dt) { return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`; }
  function mondayOf(iso) { const dt = isoToDate(iso); const k = (dt.getDay() + 6) % 7; dt.setDate(dt.getDate() - k); return dateToISO(dt); }
  function addDays(iso, n) { const dt = isoToDate(iso); dt.setDate(dt.getDate() + n); return dateToISO(dt); }
  const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const STATUS_ORDER = { blocked: 0, atrisk: 1, inprogress: 2, todo: 3, done: 4 };
  const isOverdue = t => t.status !== 'done' && t.date && t.date < todayISO();
  let weekStart = null;
  const curWeek = () => weekStart || (weekStart = mondayOf(todayISO()));

  /* ---------- views ---------- */
  function show(view) {
    $$('.view').forEach(v => v.classList.add('hidden'));
    $('#view-' + view).classList.remove('hidden');
    $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === view));
    if (view === 'dashboard') renderDashboard();
    if (view === 'today') renderToday();
    if (view === 'tasks') renderTasks();
    if (view === 'week') renderWeek();
  }

  /* ---------- week view (Mon–Sun calendar) ---------- */
  function renderWeek() {
    const start = curWeek();
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    const a = isoToDate(start), b = isoToDate(days[6]);
    const opt = { day: 'numeric', month: 'short' };
    $('#wkRange').textContent =
      a.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' – ' + b.toLocaleDateString('en-GB', opt);

    const today = todayISO();
    const byDate = {};
    tasks.forEach(t => { if (t.date) (byDate[t.date] = byDate[t.date] || []).push(t); });

    $('#weekGrid').innerHTML = days.map((iso, i) => {
      const dt = isoToDate(iso);
      const items = (byDate[iso] || []).slice()
        .sort((x, y) => (STATUS_ORDER[x.status] ?? 4) - (STATUS_ORDER[y.status] ?? 4));
      const cls = [iso === today ? 'today' : '', i >= 5 ? 'weekend' : ''].join(' ');
      const body = items.length
        ? items.map(t =>
            `<div class="evt st-${t.status}" data-id="${t.id}" data-act="edit" title="${esc(t.status)} · ${esc(t.owner || '')}">
               <div class="et">${esc(t.title)}</div>
               <div class="eo">${esc(t.owner || '—')}${t.workstream ? ' · ' + esc(t.workstream) : ''}</div>
             </div>`).join('')
        : (isWeekend(iso) ? '<div class="none">Weekend — rest</div>' : '<div class="none">—</div>');
      return `<div class="daycol ${cls}">
        <div class="dh"><div class="dow">${DOW[i]}</div><div class="dn">${dt.getDate()}</div></div>
        <div class="wbody">${body}</div></div>`;
    }).join('');
  }

  /* ---------- dashboard ---------- */
  function statsFor(list) {
    const c = { total: list.length, done: 0, inprogress: 0, atrisk: 0, blocked: 0, todo: 0 };
    list.forEach(t => { c[t.status] = (c[t.status] || 0) + 1; });
    c.pct = c.total ? Math.round(100 * (c.done + 0.5 * c.inprogress) / c.total) : 0;
    return c;
  }
  function epicStats(key) {
    const ep = EPICS.find(e => e.key === key) || { baseline: 0 };
    if (ep.rollup) {
      const pool = tasks.filter(t => t.epic === key || ep.rollup.includes(t.epic));   // collate member epics + own
      const s = statsFor(pool);
      // if member epics carry effort weights, compute readiness as a weighted average of their progress
      if (ep.rollup.some(m => (EPICS.find(e => e.key === m) || {}).weight)) {
        let wsum = 0, acc = 0;
        ep.rollup.forEach(m => {
          const me = EPICS.find(e => e.key === m) || {}, w = me.weight || 0;
          if (!w) return;
          const ms = statsFor(tasks.filter(t => t.epic === m));
          acc += w * (ms.total ? ms.pct : (me.baseline || 0)); wsum += w;
        });
        if (wsum) s.pct = Math.round(acc / wsum);
      }
      if (s.total === 0) s.pct = ep.baseline;
      s.baseline = ep.baseline;
      return s;
    }
    const s = statsFor(tasks.filter(t => t.epic === key));
    if (s.total === 0) s.pct = ep.baseline;
    s.baseline = ep.baseline;
    return s;
  }
  function daysUntil(iso) { return Math.round((isoToDate(iso) - isoToDate(todayISO())) / 86400000); }
  function whenLabel(iso) {
    const d = daysUntil(iso);
    return d > 0 ? `in ${d} day${d > 1 ? 's' : ''}` : d === 0 ? 'today' : `${-d} day${d < -1 ? 's' : ''} overdue`;
  }

  function renderDashboard() {
    const all = statsFor(tasks.filter(t => (t.phase || 1) === 1));   // headline = Phase 1 (current execution)
    const overdue = tasks.filter(isOverdue).length;
    const risks = tasks.filter(t => t.status === 'atrisk' || t.status === 'blocked')
      .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
    const today = todayISO();
    const horizon = addDays(today, 14);
    const milestones = tasks.filter(t => t.milestone && t.date && t.date >= today && t.date <= horizon)
      .sort((a, b) => a.date.localeCompare(b.date));

    // readiness status
    const riskCount = all.blocked + all.atrisk + overdue;
    let stCls = 'ok', stLabel = 'On track';
    if (riskCount >= 3) { stCls = 'bad'; stLabel = 'At risk'; }
    else if (riskCount > 0) { stCls = 'watch'; stLabel = 'Watch'; }

    /* ---- readiness hero ---- */
    $('#hero').innerHTML = `<div class="hero">
      <div class="hero-main">
        <div class="hero-lbl">Overall progress · Phase 1</div>
        <div class="hero-pct">${all.pct}<span>%</span></div>
        <div class="track lg"><div class="fill" style="width:${all.pct}%"></div></div>
        <div class="hero-sub">${all.done} of ${all.total} tasks complete &nbsp;·&nbsp;
          <span class="hero-status ${stCls}">● ${stLabel}</span></div>
      </div>
      <div class="hero-goals">
        ${EPICS.filter(e => e.goLiveDate).map(e => {
          const r = epicStats(e.key);
          return `<div class="hero-goal">
            <div class="hg-top"><span class="hg-name">${esc(e.name)}</span><span class="hg-pct">${r.pct}%</span></div>
            <div class="track sm"><div class="fill" style="width:${r.pct}%"></div></div>
            <div class="hg-date">🎯 ${fmtDate(e.goLiveDate)} · ${whenLabel(e.goLiveDate)}</div>
            ${e.goLiveNote ? `<div class="hg-note">${esc(e.goLiveNote)}</div>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>`;

    /* ---- stat strip ---- */
    $('#statStrip').innerHTML = [
      ['', all.total, 'Total'], ['done', all.done, 'Done'], ['prog', all.inprogress, 'In Progress'],
      ['risk', all.atrisk, 'At Risk'], ['block', all.blocked, 'Blocked']
    ].map(([c, n, l]) => `<div class="stat2 ${c} ${n === 0 ? 'z' : ''}"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');

    /* ---- task status by epic (simplified list) ---- */
    const epicRow = e => {
      const s = epicStats(e.key);
      const flags = (s.blocked || s.atrisk)
        ? `${s.blocked ? `<span class="flag blk">⛔ ${s.blocked}</span>` : ''}${s.atrisk ? `<span class="flag rsk">⚠ ${s.atrisk}</span>` : ''}`
        : '<span class="muted">—</span>';
      const sub = e.goLiveDate ? `<div class="erow-sub gl">🎯 ${fmtDate(e.goLiveDate)} · ${whenLabel(e.goLiveDate)}</div>` : '';
      return `<tr class="${e.rollup ? 'er-golive' : ''}">
        <td class="ename">${esc(e.name)}${e.rollup ? ' <span class="rollup-badge">roll-up</span>' : ''}${sub}</td>
        <td class="eprog"><div class="track"><div class="fill" style="width:${s.pct}%"></div></div></td>
        <td class="epct">${s.pct}%</td>
        <td class="etasks">${s.done}/${s.total}</td>
        <td class="eflags">${flags}</td>
      </tr>`;
    };
    $('#epicGrid').innerHTML = `<div class="card etable-card"><div class="scroll"><table class="etable">
      <thead><tr><th>Epic</th><th class="th-prog">Progress</th><th>%</th><th>Tasks</th><th>Flags</th></tr></thead>
      <tbody>${EPICS.filter(e => (e.phase || 1) === 1).map(epicRow).join('')}</tbody></table></div></div>`;

    // Phase 2 — lightweight roadmap list (all planned)
    $('#epicGrid2').innerHTML = `<div class="card p2list">${EPICS.filter(e => e.phase === 2).map(e =>
      `<div class="p2item"><span class="p2name">${esc(e.name)}</span><span class="p2band">${esc(e.band || '')}</span></div>`).join('')}</div>`;

    /* ---- upcoming milestones ---- */
    $('#milestonesCard').innerHTML = `<div class="card"><h3>Upcoming milestones · next 2 weeks</h3>
      ${milestones.length ? '<ul class="clean-list">' + milestones.map(t =>
        `<li><span class="mile-date">${fmtDate(t.date)}</span> ${esc(t.title)}</li>`).join('') + '</ul>'
        : '<p class="muted">No milestones in the next 14 days.</p>'}</div>`;
  }

  /* ---------- tasks list ---------- */
  function renderTasks() {
    populateFilters();
    const q = $('#search').value.toLowerCase();
    const fp = $('#fProject').value, fph = $('#fPhase').value, fe = $('#fEpic').value, fo = $('#fOwner').value, fs = $('#fStatus').value;
    const list = tasks.filter(t =>
      (!q || (t.title + ' ' + (t.notes || '') + ' ' + (t.risk || '')).toLowerCase().includes(q)) &&
      (!fp || t.project === fp) && (!fph || String(t.phase || 1) === fph) &&
      (!fe || t.epic === fe) && (!fo || t.owner === fo) && (!fs || t.status === fs));

    const sortFn = (a, b) => (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) || ((a.date || '9999').localeCompare(b.date || '9999'));
    let html = '';
    EPICS.forEach(e => {
      const items = list.filter(t => t.epic === e.key).sort(sortFn);
      if (!items.length) return;
      const s = statsFor(items);
      html += `<div class="epic-group">
        <div class="epic-group-h"><span>${esc(e.name)}</span><span class="muted">${s.done}/${s.total} done · ${s.pct}%</span></div>
        <div class="task-list">${items.map(taskCard).join('')}</div></div>`;
    });
    const orphans = list.filter(t => !EPICS.some(e => e.key === t.epic)).sort(sortFn);
    if (orphans.length) html += `<div class="epic-group"><div class="epic-group-h"><span>Unassigned</span></div>
      <div class="task-list">${orphans.map(taskCard).join('')}</div></div>`;

    $('#taskList').innerHTML = html || '<p class="muted" style="padding:20px;text-align:center">No tasks match.</p>';
  }
  function taskCard(t) {
    const od = isOverdue(t);
    const showRisk = (t.status === 'atrisk' || t.status === 'blocked') && t.risk;
    return `<div class="task st-${t.status}${od ? ' overdue' : ''}" data-id="${t.id}">
      <button class="check" data-act="toggle" title="Mark done">${t.status === 'done' ? '✓' : ''}</button>
      <div class="body">
        <div class="title">${esc(t.title)}</div>
        <div class="meta">
          <span class="tag proj ${t.project === 'mForm' ? 'pf' : 'pg'}">${esc(t.project || epicProject(t.epic))}</span>
          <span class="tag epic">${esc(epicName(t.epic))}</span>
          <span class="tag owner">${esc(t.owner || '—')}</span>
          ${t.date ? `<span class="tag date${od ? ' od' : ''}">${fmtDate(t.date)}${od ? ' · overdue' : ''}</span>` : ''}
          ${t.milestone ? '<span class="tag mile">★ milestone</span>' : ''}
          <select class="status-sel" data-act="status">
            ${Object.keys(STATUSES).map(s => `<option value="${s}" ${s === t.status ? 'selected' : ''}>${STATUSES[s].label}</option>`).join('')}
          </select>
        </div>
        ${showRisk ? `<div class="risk-note"><b>${t.status === 'blocked' ? '⛔ Blocker' : '⚠ Risk'}:</b> ${esc(t.risk)}${t.mitigation ? ` <span class="muted">→ ${esc(t.mitigation)}</span>` : ''}</div>` : ''}
        ${t.notes ? `<div class="notes">${esc(t.notes)}</div>` : ''}
      </div>
      <button class="edit" data-act="edit" title="Edit">✎</button>
    </div>`;
  }
  function populateFilters() {
    const ow = [...new Set(tasks.map(t => t.owner).filter(Boolean))].sort();
    const fe = $('#fEpic'), cur = fe.value;
    fe.innerHTML = '<option value="">All epics</option>' + EPICS.map(e => `<option value="${e.key}">${esc(e.name)}</option>`).join('');
    fe.value = cur;
    fillSelect('#fOwner', ow);
    $('#ownerOptions').innerHTML = ow.map(o => `<option value="${esc(o)}">`).join('');
  }
  function fillSelect(sel, vals) {
    const el = $(sel), cur = el.value;
    el.innerHTML = `<option value="">${el.options[0].text}</option>` +
      vals.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join('');
    el.value = cur;
  }

  /* ---------- today's focus ---------- */
  function renderToday() {
    const today = todayISO();
    const byStatus = (a, b) => (STATUS_ORDER[a.status] ?? 4) - (STATUS_ORDER[b.status] ?? 4);
    const todays = tasks.filter(t => t.date === today).sort(byStatus);
    const overdue = tasks.filter(t => t.date && t.date < today && t.status !== 'done').sort(byStatus);

    $('#todayDate').textContent = isoToDate(today)
      .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

    let html = '';
    if (todays.length) {
      html += `<h3 class="grp">Today · ${todays.length} task${todays.length > 1 ? 's' : ''}</h3>
        <div class="task-list">${todays.map(taskCard).join('')}</div>`;
    } else {
      html += `<div class="today-empty">🎉 No tasks scheduled for today.</div>`;
    }
    if (overdue.length) {
      html += `<h3 class="grp grp-od">Overdue / carried over · ${overdue.length}</h3>
        <div class="task-list">${overdue.map(taskCard).join('')}</div>`;
    }
    $('#todayList').innerHTML = html;
  }

  /* ---------- task ops ---------- */
  function findTask(id) { return tasks.find(t => t.id === id); }
  function toggleDone(id) {
    const t = findTask(id); if (!t) return;
    t.status = t.status === 'done' ? 'todo' : 'done';
    save(); refresh();
  }
  function setStatus(id, s) { const t = findTask(id); if (t) { t.status = s; save(); refresh(); } }
  function refresh() {
    const active = $('.tab.active').dataset.view;
    show(active);
  }

  /* ---------- modal ---------- */
  function toggleRiskFields() {
    const s = $('#fStatusInput').value;
    $('#riskFields').classList.toggle('hidden', !(s === 'atrisk' || s === 'blocked'));
  }
  function updateProjHint() {
    const p = epicProject($('#fEpicInput').value);
    $('#projHint').innerHTML = `Project: <b class="${p === 'mForm' ? 'pf' : 'pg'}">${p}</b> <span class="muted">(auto-linked from epic)</span>`;
  }
  function openModal(task) {
    $('#fEpicInput').innerHTML = EPICS.map(e => `<option value="${e.key}">${esc(e.name)}</option>`).join('');
    $('#modalTitle').textContent = task ? 'Edit Task' : 'New Task';
    $('#taskId').value = task ? task.id : '';
    $('#fTitle').value = task ? task.title : '';
    $('#fDate').value = task ? (task.date || '') : '';
    $('#fOwnerInput').value = task ? (task.owner || '') : '';
    $('#fEpicInput').value = task ? (task.epic || EPICS[0].key) : EPICS[0].key;
    $('#fStatusInput').value = task ? task.status : 'todo';
    $('#fNotes').value = task ? (task.notes || '') : '';
    $('#fRisk').value = task ? (task.risk || '') : '';
    $('#fImpact').value = task ? (task.impact || '') : '';
    $('#fResolution').value = task ? (task.resolution || '') : '';
    $('#fMitigation').value = task ? (task.mitigation || '') : '';
    toggleRiskFields();
    updateProjHint();
    $('#btnDelete').classList.toggle('hidden', !task);
    $('#modal').classList.remove('hidden');
    $('#fTitle').focus();
  }
  function closeModal() { $('#modal').classList.add('hidden'); }

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const tab = e.target.closest('.tab');
    if (tab) return show(tab.dataset.view);

    const act = e.target.closest('[data-act]');
    if (act) {
      const card = e.target.closest('[data-id]');
      const id = card && card.dataset.id;
      const a = act.dataset.act;
      if (a === 'toggle') return toggleDone(id);
      if (a === 'edit') return openModal(findTask(id));
      return;
    }
    // menu
    if (e.target.id === 'btnMenu') { $('#menuList').classList.toggle('hidden'); return; }
    if (!e.target.closest('.menu')) $('#menuList').classList.add('hidden');
  });

  document.addEventListener('change', e => {
    if (e.target.dataset.act === 'status') {
      const id = e.target.closest('[data-id]').dataset.id;
      setStatus(id, e.target.value);
    }
  });

  $('#search').addEventListener('input', renderTasks);
  ['#fProject', '#fPhase', '#fEpic', '#fOwner', '#fStatus'].forEach(s => $(s).addEventListener('change', renderTasks));
  $('#fStatusInput').addEventListener('change', toggleRiskFields);
  $('#fEpicInput').addEventListener('change', updateProjHint);

  $('#wkPrev').addEventListener('click', () => { weekStart = addDays(curWeek(), -7); renderWeek(); });
  $('#wkNext').addEventListener('click', () => { weekStart = addDays(curWeek(), 7); renderWeek(); });
  $('#wkToday').addEventListener('click', () => { weekStart = mondayOf(todayISO()); renderWeek(); });

  $('#btnNew').addEventListener('click', () => openModal(null));
  $('#btnCancel').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });

  $('#taskForm').addEventListener('submit', e => {
    e.preventDefault();
    const id = $('#taskId').value;
    const data = {
      title: $('#fTitle').value.trim(),
      date: $('#fDate').value,
      owner: $('#fOwnerInput').value.trim(),
      epic: $('#fEpicInput').value,
      status: $('#fStatusInput').value,
      project: epicProject($('#fEpicInput').value),
      notes: $('#fNotes').value.trim(),
      risk: $('#fRisk').value.trim(),
      impact: $('#fImpact').value.trim(),
      resolution: $('#fResolution').value,
      mitigation: $('#fMitigation').value.trim()
    };
    if (!data.title) return;
    if (id) { Object.assign(findTask(id), data); }
    else { tasks.push(Object.assign({ id: uid() }, data)); }
    save(); closeModal(); refresh();
  });

  $('#btnDelete').addEventListener('click', () => {
    const id = $('#taskId').value;
    if (id && confirm('Delete this task?')) {
      tasks = tasks.filter(t => t.id !== id);
      save(); closeModal(); refresh();
    }
  });

  $('#btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'inops-tasks.json';
    a.click();
    $('#menuList').classList.add('hidden');
  });
  $('#btnImport').addEventListener('click', () => { $('#importFile').click(); $('#menuList').classList.add('hidden'); });
  $('#importFile').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const arr = JSON.parse(r.result);
        if (Array.isArray(arr)) { tasks = arr; stampProjects(); save(); refresh(); alert('Imported ' + arr.length + ' tasks.'); }
      } catch (err) { alert('Could not read that file.'); }
    };
    r.readAsText(f);
    e.target.value = '';
  });
  $('#btnReset').addEventListener('click', () => {
    if (confirm('Reset to the default iNOPs plan? Your changes will be lost.')) {
      tasks = clone(window.INOPS_SEED || []); stampProjects(); save(); refresh();
      $('#menuList').classList.add('hidden');
    }
  });

  /* ---------- go ---------- */
  show('dashboard');
})();

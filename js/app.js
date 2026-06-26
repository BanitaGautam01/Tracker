/* Amazon iNOPs Task Tracker — vanilla JS, localStorage persistence */
(function () {
  'use strict';
  const KEY = 'inops_tasks_v1';
  const STATUSES = {
    todo:       { label: 'Not Started', color: 'var(--todo)'  },
    inprogress: { label: 'In Progress', color: 'var(--prog)'  },
    done:       { label: 'Done',        color: 'var(--done)'  },
    blocked:    { label: 'Blocked',     color: 'var(--block)' }
  };
  const SPRINT_START = '2026-06-24';
  const SPRINT_END   = '2026-07-06';

  let tasks = load();

  /* ---------- storage ---------- */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return clone(window.INOPS_SEED || []);
  }
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
  const STATUS_ORDER = { blocked: 0, inprogress: 1, todo: 2, done: 3 };
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
  function renderDashboard() {
    const total = tasks.length;
    const by = { todo: 0, inprogress: 0, done: 0, blocked: 0 };
    tasks.forEach(t => by[t.status] = (by[t.status] || 0) + 1);
    const pct = total ? Math.round((by.done / total) * 100) : 0;

    $('#statGrid').innerHTML = [
      ['s-total', total, 'Total Tasks'],
      ['s-done', by.done, 'Done'],
      ['s-prog', by.inprogress, 'In Progress'],
      ['s-todo', by.todo, 'Not Started'],
      ['s-block', by.blocked, 'Blocked']
    ].map(([c, n, l]) => `<div class="stat ${c}"><div class="num">${n}</div><div class="lbl">${l}</div></div>`).join('');

    // donut
    const seg = [
      ['done', by.done, 'var(--done)'],
      ['inprogress', by.inprogress, 'var(--prog)'],
      ['blocked', by.blocked, 'var(--block)'],
      ['todo', by.todo, 'var(--todo)']
    ];
    let acc = 0, stops = [];
    seg.forEach(([, n, col]) => {
      if (!total) return;
      const a = (acc / total) * 360, b = ((acc + n) / total) * 360;
      stops.push(`${col} ${a}deg ${b}deg`); acc += n;
    });
    $('#donut').style.background = total
      ? `conic-gradient(${stops.join(',')})`
      : 'var(--bg)';
    $('#donut').style.webkitMask = 'radial-gradient(circle 52px at center, transparent 98%, #000 100%)';
    $('#donut').style.mask = 'radial-gradient(circle 52px at center, transparent 98%, #000 100%)';
    $('#donutPct').textContent = pct + '%';
    $('#donutLegend').innerHTML = seg.map(([k, n, col]) =>
      `<div class="li"><span class="dot" style="background:${col}"></span>${STATUSES[k].label} <b style="margin-left:auto">${n}</b></div>`
    ).join('');

    renderBars('#wsBars', groupBy('workstream'));
    renderBars('#ownerBars', groupBy('owner'));
  }
  function groupBy(field) {
    const m = {};
    tasks.forEach(t => {
      const k = t[field] || '—';
      m[k] = m[k] || { total: 0, done: 0 };
      m[k].total++; if (t.status === 'done') m[k].done++;
    });
    return m;
  }
  function renderBars(sel, map) {
    const rows = Object.entries(map).sort((a, b) => b[1].total - a[1].total);
    $(sel).innerHTML = rows.map(([k, v]) => {
      const p = v.total ? Math.round((v.done / v.total) * 100) : 0;
      return `<div class="bar-row"><div class="bl"><span>${esc(k)}</span><b>${v.done}/${v.total}</b></div>
        <div class="track"><div class="fill" style="width:${p}%"></div></div></div>`;
    }).join('') || '<p class="muted">No data</p>';
  }

  /* ---------- tasks list ---------- */
  function renderTasks() {
    populateFilters();
    const q = $('#search').value.toLowerCase();
    const fw = $('#fWorkstream').value, fo = $('#fOwner').value, fs = $('#fStatus').value;
    const list = tasks.filter(t =>
      (!q || (t.title + ' ' + (t.notes || '')).toLowerCase().includes(q)) &&
      (!fw || t.workstream === fw) && (!fo || t.owner === fo) && (!fs || t.status === fs)
    ).sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));

    $('#taskList').innerHTML = list.map(taskCard).join('') ||
      '<p class="muted" style="padding:20px;text-align:center">No tasks match.</p>';
  }
  function taskCard(t) {
    return `<div class="task st-${t.status}" data-id="${t.id}">
      <button class="check" data-act="toggle" title="Mark done">${t.status === 'done' ? '✓' : ''}</button>
      <div class="body">
        <div class="title">${esc(t.title)}</div>
        <div class="meta">
          <span class="tag ws">${esc(t.workstream || '—')}</span>
          <span class="tag owner">${esc(t.owner || '—')}</span>
          ${t.date ? `<span class="tag date">${fmtDate(t.date)}</span>` : ''}
          <select class="status-sel" data-act="status">
            ${Object.keys(STATUSES).map(s => `<option value="${s}" ${s === t.status ? 'selected' : ''}>${STATUSES[s].label}</option>`).join('')}
          </select>
        </div>
        ${t.notes ? `<div class="notes">${esc(t.notes)}</div>` : ''}
      </div>
      <button class="edit" data-act="edit" title="Edit">✎</button>
    </div>`;
  }
  function populateFilters() {
    const ws = [...new Set(tasks.map(t => t.workstream).filter(Boolean))].sort();
    const ow = [...new Set(tasks.map(t => t.owner).filter(Boolean))].sort();
    fillSelect('#fWorkstream', ws); fillSelect('#fOwner', ow);
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
  function openModal(task) {
    $('#modalTitle').textContent = task ? 'Edit Task' : 'New Task';
    $('#taskId').value = task ? task.id : '';
    $('#fTitle').value = task ? task.title : '';
    $('#fDate').value = task ? task.date : '';
    $('#fOwnerInput').value = task ? task.owner : '';
    $('#fWsInput').value = task ? task.workstream : 'Form';
    $('#fStatusInput').value = task ? task.status : 'todo';
    $('#fNotes').value = task ? (task.notes || '') : '';
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
  ['#fWorkstream', '#fOwner', '#fStatus'].forEach(s => $(s).addEventListener('change', renderTasks));

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
      workstream: $('#fWsInput').value,
      status: $('#fStatusInput').value,
      notes: $('#fNotes').value.trim()
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
        if (Array.isArray(arr)) { tasks = arr; save(); refresh(); alert('Imported ' + arr.length + ' tasks.'); }
      } catch (err) { alert('Could not read that file.'); }
    };
    r.readAsText(f);
    e.target.value = '';
  });
  $('#btnReset').addEventListener('click', () => {
    if (confirm('Reset to the default iNOPs plan? Your changes will be lost.')) {
      tasks = clone(window.INOPS_SEED || []); save(); refresh();
      $('#menuList').classList.add('hidden');
    }
  });

  /* ---------- go ---------- */
  show('dashboard');
})();

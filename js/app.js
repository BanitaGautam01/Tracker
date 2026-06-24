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

  /* ---------- views ---------- */
  function show(view) {
    $$('.view').forEach(v => v.classList.add('hidden'));
    $('#view-' + view).classList.remove('hidden');
    $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === view));
    if (view === 'dashboard') renderDashboard();
    if (view === 'tasks') renderTasks();
    if (view === 'plan') renderPlan();
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

  /* ---------- day-wise plan ---------- */
  function renderPlan() {
    const days = [];
    let d = new Date(SPRINT_START + 'T00:00:00');
    const end = new Date(SPRINT_END + 'T00:00:00');
    while (d <= end) {
      days.push(d.toISOString().slice(0, 10));
      d.setDate(d.getDate() + 1);
    }
    $('#planList').innerHTML = days.map(iso => {
      const items = tasks.filter(t => t.date === iso);
      const wknd = isWeekend(iso);
      let body;
      if (wknd && !items.length) {
        body = `<div class="day-rest">Weekend — team unavailable (rest day)</div>`;
      } else if (!items.length) {
        body = `<div class="day-rest">No tasks</div>`;
      } else {
        body = `<div class="day-body">` + items.map(t =>
          `<div class="ptask st-${t.status}" data-id="${t.id}">
             <button class="check" data-act="toggle">${t.status === 'done' ? '✓' : ''}</button>
             <span class="pt-title">${esc(t.title)}</span>
             <span class="tag owner">${esc(t.owner || '')}</span>
           </div>`).join('') + `</div>`;
      }
      const done = items.filter(t => t.status === 'done').length;
      return `<div class="day ${wknd ? 'weekend' : ''}">
        <div class="day-head"><span class="d">${fmtDate(iso)}</span><span class="dow">${dow(iso)}</span>
          ${items.length ? `<span class="cnt">${done}/${items.length} done</span>` : ''}</div>
        ${body}</div>`;
    }).join('');
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

(() => {
  'use strict';

  const DATA_URL = 'internships.json';

  const els = {
    form: document.getElementById('filter-form'),
    search: document.getElementById('search'),
    domain: document.getElementById('domain'),
    status: document.getElementById('status'),
    list: document.getElementById('list'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    errorDetail: document.getElementById('error-detail'),
    empty: document.getElementById('empty'),
    retry: document.getElementById('retry'),
    emptyReset: document.getElementById('empty-reset'),
    results: document.getElementById('results'),
  };

  let internships = [];
  const saved = new Set();

  /* ---------- helpers ---------- */
  const el = (tag, opts = {}, children = []) => {
    const node = document.createElement(tag);
    if (opts.className) node.className = opts.className;
    if (opts.text) node.textContent = opts.text;
    if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => node.setAttribute(k, v));
    children.forEach((c) => node.appendChild(c));
    return node;
  };

  const show = (name) => {
    els.loading.hidden = name !== 'loading';
    els.error.hidden = name !== 'error';
    els.empty.hidden = name !== 'empty';
    els.list.hidden = name !== 'list';
  };

  /* ---------- reusable card ---------- */
  function createCard(item) {
    const titleId = `title-${item.id}`;

    const meta = el('dl', { className: 'meta' }, [
      el('dt', { text: 'Location' }), el('dd', { text: item.location }),
      el('dt', { text: 'Duration' }), el('dd', { text: item.duration }),
      el('dt', { text: 'Stipend' }), el('dd', { text: item.stipend }),
    ]);

    const skills = el('ul', { className: 'skills', attrs: { 'aria-label': 'Required skills' } },
      item.skills.map((s) => el('li', { text: s })));

    const saveBtn = el('button', {
      className: 'btn btn-secondary save-btn',
      text: saved.has(item.id) ? 'Saved' : 'Save',
      attrs: { type: 'button', 'aria-pressed': String(saved.has(item.id)), 'aria-label': `Save ${item.title} at ${item.company}` },
    });
    saveBtn.addEventListener('click', () => {
      if (saved.has(item.id)) saved.delete(item.id); else saved.add(item.id);
      const on = saved.has(item.id);
      saveBtn.setAttribute('aria-pressed', String(on));
      saveBtn.textContent = on ? 'Saved' : 'Save';
    });

    const article = el('article', { className: 'card', attrs: { 'aria-labelledby': titleId } }, [
      el('span', { className: 'badge', text: item.domain }),
      el('h2', { text: item.title, attrs: { id: titleId } }),
      el('p', { className: 'company', text: item.company }),
      meta,
      el('p', { className: 'summary', text: item.summary }),
      skills,
      el('div', { className: 'card-actions' }, [saveBtn]),
    ]);

    return el('li', {}, [article]);
  }

  /* ---------- filtering ---------- */
  function getFiltered() {
    const q = els.search.value.trim().toLowerCase();
    const domain = els.domain.value;
    return internships.filter((i) => {
      const matchesDomain = domain === 'all' || i.domain === domain;
      const haystack = [i.title, i.company, i.location, i.domain, ...i.skills].join(' ').toLowerCase();
      return matchesDomain && (!q || haystack.includes(q));
    });
  }

  function render() {
    const results = getFiltered();
    els.list.replaceChildren(...results.map(createCard));

    if (results.length === 0) {
      show('empty');
      els.status.textContent = 'No internships match your filters.';
    } else {
      show('list');
      els.status.textContent = `Showing ${results.length} of ${internships.length} internships.`;
    }
  }

  function populateDomains() {
    const domains = [...new Set(internships.map((i) => i.domain))].sort();
    els.domain.replaceChildren(
      el('option', { text: 'All domains', attrs: { value: 'all' } }),
      ...domains.map((d) => el('option', { text: d, attrs: { value: d } }))
    );
  }

  /* ---------- data loading ---------- */
  async function load() {
    show('loading');
    els.status.textContent = 'Loading internships…';
    try {
      const res = await fetch(DATA_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Unexpected data format');
      internships = data;
      populateDomains();
      render();
    } catch (err) {
      console.error(err);
      els.errorDetail.textContent =
        'Could not load internship data. If you opened this file directly, run a local server (e.g. "python3 -m http.server") and try again.';
      els.status.textContent = 'Error loading internships.';
      show('error');
      els.error.focus?.();
    }
  }

  /* ---------- events ---------- */
  let timer;
  els.search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(render, 150);
  });
  els.domain.addEventListener('change', render);
  els.form.addEventListener('submit', (e) => { e.preventDefault(); render(); });
  els.form.addEventListener('reset', () => setTimeout(render, 0));
  els.emptyReset.addEventListener('click', () => {
    els.form.reset();
    els.search.focus();
  });
  els.retry.addEventListener('click', load);

  // Keyboard shortcuts: "/" focuses search, Esc clears it
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      els.search.focus();
    } else if (e.key === 'Escape' && document.activeElement === els.search && els.search.value) {
      els.search.value = '';
      render();
    }
  });

  load();
})();

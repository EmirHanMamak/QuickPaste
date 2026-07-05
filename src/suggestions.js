const tauriApi = window.__TAURI__ || {};
const invoke = tauriApi.core?.invoke;
const listen = tauriApi.event?.listen;
const getCurrentWindow = tauriApi.window?.getCurrentWindow;

const appWindow = typeof getCurrentWindow === 'function' ? getCurrentWindow() : null;

const elements = {
  filterInput: document.getElementById('filterInput'),
  queryValue: document.getElementById('queryValue'),
  list: document.getElementById('list'),
};

const state = {
  query: '',
  deleteGraphemes: 0,
  suggestions: [],
  filter: '',
};

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function render() {
  elements.queryValue.textContent = state.query || '—';
  const filter = normalize(state.filter);
  const items = state.suggestions.filter((item) => {
    if (!filter) return true;
    return normalize(item.trigger).includes(filter)
      || normalize(item.description).includes(filter)
      || normalize(item.replacementPreview).includes(filter);
  });

  if (items.length === 0) {
    elements.list.innerHTML = `
      <div class="rounded-xl border border-dashed border-[var(--qp-border)] px-3 py-4 text-sm text-[var(--qp-muted)]">
        No matching suggestions.
      </div>
    `;
    return;
  }

  elements.list.innerHTML = items.map((item) => `
    <button
      type="button"
      class="item w-full rounded-xl px-3 py-2 text-left flex flex-col gap-1"
      data-trigger="${escapeHtml(item.trigger)}"
    >
      <div class="flex items-center justify-between gap-3">
        <span class="font-semibold text-sm text-[var(--qp-primary)]">${escapeHtml(item.trigger)}</span>
        <span class="text-[10px] uppercase tracking-[0.22em] text-[var(--qp-muted)]">Select</span>
      </div>
      <div class="text-xs text-[var(--qp-text)] whitespace-pre-wrap">${escapeHtml(item.replacementPreview || '')}</div>
      ${item.description ? `<div class="text-[11px] text-[var(--qp-muted)]">${escapeHtml(item.description)}</div>` : ''}
    </button>
  `).join('');

  elements.list.querySelectorAll('[data-trigger]').forEach((button) => {
    button.addEventListener('click', async () => {
      const trigger = button.getAttribute('data-trigger');
      if (!trigger || typeof invoke !== 'function') {
        return;
      }
      try {
        await invoke('apply_text_expansion_trigger', {
          trigger,
          deleteGraphemes: state.deleteGraphemes,
        });
      } catch (error) {
        console.error(error);
      }
    });
  });
}

async function main() {
  if (typeof listen === 'function') {
    await listen('text-expansion-suggestions', (event) => {
      const payload = event?.payload || {};
      state.query = String(payload.query || '');
      state.deleteGraphemes = Number(payload.deleteGraphemes || 0);
      state.suggestions = Array.isArray(payload.suggestions) ? payload.suggestions : [];
      state.filter = state.query;
      if (elements.filterInput) {
        elements.filterInput.value = state.filter;
      }
      render();
    });
  }

  elements.filterInput.addEventListener('input', () => {
    state.filter = elements.filterInput.value;
    render();
  });

  elements.filterInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (appWindow?.hide) {
        await appWindow.hide();
      }
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const first = elements.list.querySelector('[data-trigger]');
      if (first) {
        first.click();
      }
    }
  });

  render();
}

main().catch((error) => {
  console.error(error);
  elements.list.innerHTML = `
    <div class="rounded-xl border border-red-500/25 bg-gradient-to-b from-red-500/12 to-red-500/6 px-3 py-4 text-sm text-red-50 shadow-[0_16px_32px_rgba(0,0,0,0.24)]">
      Failed to load suggestions.
    </div>
  `;
});

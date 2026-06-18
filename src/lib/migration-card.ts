const STORAGE_KEY = 'migration-card-layout';

interface CardLayout {
  x: number;
  y: number;
  w: number;
  minimized: boolean;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function readLayout(fallback: CardLayout): CardLayout {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<CardLayout>;
    if (
      typeof parsed.x === 'number' &&
      typeof parsed.y === 'number' &&
      typeof parsed.w === 'number'
    ) {
      return {
        x: parsed.x,
        y: parsed.y,
        w: parsed.w,
        minimized: Boolean(parsed.minimized),
      };
    }
  } catch {}
  return fallback;
}

function saveLayout(layout: CardLayout) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch {}
}

export function initMigrationCard() {
  const wrap = document.getElementById('migration-card-wrap');
  const card = wrap?.querySelector<HTMLElement>('.migration-card');
  const body = card?.querySelector<HTMLElement>('.migration-terminal-body');
  const titleBar = card?.querySelector<HTMLElement>('[data-terminal-drag]');
  const minBtn = card?.querySelector<HTMLButtonElement>('[data-tw-minimize]');
  if (!wrap || !card || !body || !titleBar) return;

  const bounds = () => wrap.parentElement?.getBoundingClientRect();
  const minW = 260;

  const fallback: CardLayout = {
    x: Math.max(20, window.innerWidth * 0.04),
    y: Math.max(20, window.innerHeight * 0.5 - 120),
    w: clamp(window.innerWidth * 0.36, minW, 440),
    minimized: false,
  };

  let layout = readLayout(fallback);
  const isMobile = () => window.matchMedia('(max-width: 640px)').matches;

  function setMinimized(minimized: boolean) {
    layout.minimized = minimized;
    applyLayout();
    saveLayout(layout);
    if (minBtn) {
      minBtn.setAttribute('aria-label', minimized ? 'Restore' : 'Minimize');
      minBtn.setAttribute('aria-pressed', minimized ? 'true' : 'false');
    }
  }

  function toggleMinimized() {
    setMinimized(!layout.minimized);
  }

  function applyLayout() {
    body.style.height = '';
    if (isMobile()) {
      wrap.style.left = '';
      wrap.style.top = '';
      wrap.style.width = '';
      wrap.style.height = '';
      wrap.style.transform = '';
      wrap.classList.remove('is-minimized');
      card.classList.remove('is-minimized');
      body.hidden = false;
      return;
    }
    const b = bounds();
    if (!b) return;

    layout.w = clamp(layout.w, minW, b.width - 24);
    layout.x = clamp(layout.x, 0, b.width - layout.w);
    layout.y = clamp(layout.y, 0, b.height - card.offsetHeight);

    wrap.style.left = `${layout.x}px`;
    wrap.style.top = `${layout.y}px`;
    wrap.style.width = `${layout.w}px`;
    wrap.style.height = 'auto';
    wrap.style.transform = 'none';

    const minimized = layout.minimized;
    wrap.classList.toggle('is-minimized', minimized);
    card.classList.toggle('is-minimized', minimized);
    body.hidden = minimized;
    if (minBtn) {
      minBtn.setAttribute('aria-label', minimized ? 'Restore' : 'Minimize');
      minBtn.setAttribute('aria-pressed', minimized ? 'true' : 'false');
    }
  }

  applyLayout();
  saveLayout(layout);

  new ResizeObserver(() => {
    applyLayout();
    saveLayout(layout);
  }).observe(card);

  window.addEventListener('migration-city-change', applyLayout);

  wrap.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('[data-tw-minimize]')) return;
    e.preventDefault();
    e.stopPropagation();
    toggleMinimized();
  });

  titleBar.addEventListener('dblclick', (e) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    toggleMinimized();
  });

  let mode: 'drag' | 'resize' | null = null;
  let axis = 'e';
  let startX = 0;
  let startY = 0;
  let startLayout: CardLayout = { ...layout };

  function onPointerMove(e: PointerEvent) {
    if (!mode) return;
    const b = bounds();
    if (!b) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (mode === 'drag') {
      layout.x = clamp(startLayout.x + dx, 0, b.width - layout.w);
      layout.y = clamp(startLayout.y + dy, 0, b.height - card.offsetHeight);
    } else if (axis === 'w') {
      const w = clamp(startLayout.w - dx, minW, startLayout.w + startLayout.x);
      layout.x = startLayout.x + (startLayout.w - w);
      layout.w = w;
    } else {
      layout.w = clamp(startLayout.w + dx, minW, b.width - layout.x);
    }
    applyLayout();
  }

  function onPointerUp() {
    if (!mode) return;
    mode = null;
    card.classList.remove('is-dragging');
    saveLayout(layout);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }

  titleBar.addEventListener('pointerdown', (e) => {
    if (isMobile()) return;
    if ((e.target as HTMLElement).closest('button')) return;
    mode = 'drag';
    startX = e.clientX;
    startY = e.clientY;
    startLayout = { ...layout };
    card.classList.add('is-dragging');
    titleBar.setPointerCapture(e.pointerId);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  });

  wrap.querySelectorAll<HTMLElement>('.migration-resize-handle').forEach((handle) => {
    handle.addEventListener('pointerdown', (e) => {
      if (isMobile()) return;
      if (layout.minimized) return;
      e.stopPropagation();
      mode = 'resize';
      axis = handle.dataset.axis ?? 'e';
      startX = e.clientX;
      startLayout = { ...layout };
      handle.setPointerCapture(e.pointerId);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    });
  });

  window.addEventListener('resize', applyLayout);
}

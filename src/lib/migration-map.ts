// @ts-nocheck
export interface MigrationStop {
  name: string;
  rail: string;
  sub: string;
  lat: number;
  lng: number;
  zoom: number;
  text: string;
}

const TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const TILE_BASE =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile';

const warmedTiles = new Set<string>();

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function idle(ms = 100) {
  return new Promise<void>((resolve) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => resolve(), { timeout: ms });
    } else {
      window.setTimeout(resolve, ms);
    }
  });
}

export function initMigrationMap(stops: MigrationStop[]) {
  const mapEl = document.getElementById('migration-leaflet');
  const mapSection = document.getElementById('migration-section');
  if (!mapEl || !mapSection || !stops.length) return;

  const nameEl = document.getElementById('migration-city-name');
  const subEl = document.getElementById('migration-city-sub');
  const textEl = document.getElementById('migration-city-text');
  const hint = document.getElementById('scroll-hint');
  const railBtns = document.querySelectorAll<HTMLButtonElement>('.migration-rail-btn');

  const legs = Math.max(1, stops.length - 1);

  let current = -1;
  let scrollLock = false;
  let sectionVisible = false;
  let map: import('leaflet').Map | null = null;
  let LRef: typeof import('leaflet') | null = null;
  let logoMarker: import('leaflet').Marker | null = null;
  let logoAnim = 0;
  let started = false;
  let scrollRaf = 0;

  async function ensureMap() {
    if (map && LRef) return map;
    const L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');
    LRef = L;

    map = L.map(mapEl!, {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      attributionControl: true,
      keyboard: false,
      zoomAnimation: true,
      zoomAnimationThreshold: 2,
    });

    L.tileLayer(TILE_URL, {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 16,
      detectRetina: false,
      keepBuffer: 1,
    }).addTo(map);

    requestAnimationFrame(() => map?.invalidateSize());
    return map;
  }

  let logoIcon: import('leaflet').DivIcon | null = null;

  function makeLogoIcon() {
    if (logoIcon) return logoIcon;
    logoIcon = LRef!.divIcon({
      className: 'migration-logo-marker',
      html: '<img src="/logo.png" alt="" width="40" height="40" draggable="false" />',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
    return logoIcon;
  }

  function preloadStop(s: MigrationStop) {
    const z = s.zoom;
    const n = 1 << z;
    const x = Math.floor(((s.lng + 180) / 360) * n);
    const lr = (s.lat * Math.PI) / 180;
    const y = Math.floor(
      ((1 - Math.log(Math.tan(lr) + 1 / Math.cos(lr)) / Math.PI) / 2) * n,
    );
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${z}/${y + dy}/${x + dx}`;
        if (warmedTiles.has(key)) continue;
        warmedTiles.add(key);
        new Image().src = `${TILE_BASE}/${z}/${y + dy}/${x + dx}`;
      }
    }
  }

  async function warmAllStops() {
    for (const stop of stops) {
      preloadStop(stop);
      await idle();
    }
  }

  function flyDuration(fromIndex: number, toIndex: number) {
    if (fromIndex < 0) return 0;
    const hops = Math.abs(toIndex - fromIndex);
    return clamp(1.1 + hops * 0.45, 1.1, 2.4);
  }

  function moveLogo(to: MigrationStop, durMs: number) {
    if (!LRef || !map) return;
    if (!logoMarker) {
      logoMarker = LRef.marker([to.lat, to.lng], {
        icon: makeLogoIcon(),
        zIndexOffset: 200,
      }).addTo(map);
      return;
    }

    const from = logoMarker.getLatLng();
    if (logoAnim) cancelAnimationFrame(logoAnim);

    if (durMs <= 0) {
      logoMarker.setLatLng([to.lat, to.lng]);
      return;
    }

    const fromLat = from.lat;
    const fromLng = from.lng;
    const t0 = performance.now();
    function tick(now: number) {
      const t = Math.min(1, (now - t0) / durMs);
      const e = easeInOut(t);
      logoMarker!.setLatLng([
        fromLat + (to.lat - fromLat) * e,
        fromLng + (to.lng - fromLng) * e,
      ]);
      logoAnim = t < 1 ? requestAnimationFrame(tick) : 0;
    }
    logoAnim = requestAnimationFrame(tick);
  }

  function setRailActive(index: number) {
    railBtns.forEach((btn, i) => {
      const active = i === index;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function scrollProgress() {
    const rect = mapSection!.getBoundingClientRect();
    const span = mapSection!.offsetHeight - window.innerHeight;
    if (span <= 0) return 0;
    return clamp(-rect.top / span, 0, 1);
  }

  function scrollIndex(raw: number) {
    return clamp(Math.round(raw * legs), 0, stops.length - 1);
  }

  function scrollToStop(index: number) {
    const maxScroll = mapSection!.offsetHeight - window.innerHeight;
    const raw = index / legs;
    scrollLock = true;
    window.scrollTo({ top: mapSection!.offsetTop + raw * maxScroll, behavior: 'smooth' });
    window.setTimeout(() => {
      scrollLock = false;
    }, 1200);
  }

  async function goTo(index: number, fromScroll = false) {
    if (index === current) return;
    const prev = current;
    const s = stops[index];
    const m = await ensureMap();
    const duration = flyDuration(prev, index);
    const durMs = duration * 1000;

    if (prev === -1) {
      m.setView([s.lat, s.lng], s.zoom);
    } else {
      m.flyTo([s.lat, s.lng], s.zoom, { duration, easeLinearity: 0.22 });
    }

    if (nameEl) nameEl.textContent = s.name;
    if (subEl) subEl.textContent = s.sub;
    if (textEl) textEl.textContent = s.text;
    setRailActive(index);
    moveLogo(s, durMs);
    if (index + 1 < stops.length) preloadStop(stops[index + 1]);
    current = index;
    window.dispatchEvent(new CustomEvent('migration-city-change'));

    if (!fromScroll) scrollToStop(index);
  }

  function updateMap() {
    if (scrollLock || !sectionVisible) return;
    const raw = scrollProgress();
    if (hint && raw > 0.04) hint.style.opacity = '0';

    const index = scrollIndex(raw);
    if (index !== current) goTo(index, true);
  }

  function scheduleScrollUpdate() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      updateMap();
    });
  }

  async function start() {
    if (started) return;
    started = true;
    await goTo(0, true);
    void warmAllStops();
  }

  railBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = Number(btn.dataset.index);
      if (!Number.isNaN(index)) goTo(index);
    });
  });

  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });

  const sectionObserver = new IntersectionObserver(
    ([e]) => {
      sectionVisible = e.isIntersecting;
      if (sectionVisible) updateMap();
    },
    { threshold: 0.01 },
  );
  sectionObserver.observe(mapSection);

  const boot = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      boot.disconnect();
      start();
    },
    { rootMargin: '300px 0px' },
  );
  boot.observe(mapSection);
}

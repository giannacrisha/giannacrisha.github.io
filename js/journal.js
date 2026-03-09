/**
 * JOURNAL PORTFOLIO — Three.js Engine
 * Gianna Crisha · giannacrisha.github.io
 *
 * Scene: 3D journal on a table
 * Features: camera animation, journal open, page flip,
 *           floating particles, 3D gold pen, doodle canvas
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';

// ──────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────
const S = {
  loaded:      false,
  journalOpen: false,
};

// ──────────────────────────────────────────────
// THREE.JS CORE
// ──────────────────────────────────────────────
let renderer, scene, camera, clock;
const raycaster = new THREE.Raycaster();
const mouseNDC  = new THREE.Vector2();

// 3-D objects
let journalGroup;
let coverPivot;          // group that rotates to open cover
let tableGroup;
let penGroup;
let particlePoints;

// Pen spring state
const penTarget  = new THREE.Vector3(0, 0.8, 0);
const penCurrent = new THREE.Vector3(0, 0.8, 0);

// Doodle canvas (2D)
let doodleCanvas, doodleCtx;

// ──────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────
function init() {
  clock = new THREE.Clock();

  setupRenderer();
  setupScene();
  setupCamera();
  setupLighting();
  setupEnvironment();

  createTable();
  createJournal();
  createPen();
  createParticles();
  createGlow();

  setupDoodle();
  bindEvents();
  startLoading();

  animate();
}

// ──────────────────────────────────────────────
// RENDERER
// ──────────────────────────────────────────────
function setupRenderer() {
  const canvas = document.getElementById('canvas');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled  = true;
  renderer.shadowMap.type     = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace   = THREE.SRGBColorSpace;
  renderer.toneMapping        = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
}

// ──────────────────────────────────────────────
// SCENE
// ──────────────────────────────────────────────
function setupScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xE8D5B4);
  scene.fog = new THREE.FogExp2(0xDDC9A8, 0.055);
}

// ──────────────────────────────────────────────
// CAMERA
// ──────────────────────────────────────────────
function setupCamera() {
  camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 80);
  // Angled view — the "table looking at a journal" shot
  camera.position.set(0, 5.5, 8);
  camera.lookAt(0, 0, 0);
}

// ──────────────────────────────────────────────
// LIGHTING
// ──────────────────────────────────────────────
function setupLighting() {
  // Bright warm ambient — daylit room feel
  const ambient = new THREE.AmbientLight(0xFFF5E8, 1.1);
  scene.add(ambient);

  // Overhead soft key light — like a window above
  const lamp = new THREE.PointLight(0xFFEDD0, 2.2, 28, 2);
  lamp.position.set(2, 9, 2);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(2048, 2048);
  lamp.shadow.radius = 16;
  lamp.shadow.camera.near = 0.5;
  lamp.shadow.camera.far  = 30;
  scene.add(lamp);

  // Warm secondary fill from the left
  const fill = new THREE.PointLight(0xFFE0B0, 1.0, 30, 2);
  fill.position.set(-6, 6, 2);
  scene.add(fill);

  // Very soft cool top fill (sky)
  const rim = new THREE.DirectionalLight(0xE8F0FF, 0.5);
  rim.position.set(0, 10, -5);
  scene.add(rim);

  // Very soft bounce light from table surface
  const bounce = new THREE.PointLight(0xC09060, 0.4, 10, 2);
  bounce.position.set(0, -1, 2);
  scene.add(bounce);
}

// ──────────────────────────────────────────────
// ENVIRONMENT MAP (for metallic pen)
// ──────────────────────────────────────────────
function setupEnvironment() {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  pmrem.dispose();
}

// ──────────────────────────────────────────────
// TABLE
// ──────────────────────────────────────────────
function createTable() {
  tableGroup = new THREE.Group();

  // Procedural wood texture
  const wc  = document.createElement('canvas');
  wc.width  = 1024;
  wc.height = 1024;
  const wx  = wc.getContext('2d');

  wx.fillStyle = '#2E1306';
  wx.fillRect(0, 0, 1024, 1024);

  // Grain lines
  for (let i = 0; i < 80; i++) {
    const x0 = (i / 80) * 1024 + (Math.random() - 0.5) * 15;
    wx.beginPath();
    wx.moveTo(x0, 0);
    // Bezier grain
    wx.bezierCurveTo(
      x0 + (Math.random() - 0.5) * 30, 300,
      x0 + (Math.random() - 0.5) * 30, 700,
      x0 + (Math.random() - 0.5) * 15, 1024
    );
    const alpha = 0.08 + Math.random() * 0.18;
    wx.strokeStyle = `rgba(100, 50, 10, ${alpha})`;
    wx.lineWidth   = 1 + Math.random() * 2;
    wx.stroke();
  }
  // Subtle grain highlight
  for (let i = 0; i < 30; i++) {
    const x0 = Math.random() * 1024;
    wx.beginPath();
    wx.moveTo(x0, 0);
    wx.lineTo(x0 + (Math.random() - 0.5) * 40, 1024);
    wx.strokeStyle = `rgba(200, 140, 60, ${0.03 + Math.random() * 0.04})`;
    wx.lineWidth = 0.5;
    wx.stroke();
  }

  const woodTex = new THREE.CanvasTexture(wc);
  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
  woodTex.repeat.set(2, 2);

  const woodMat = new THREE.MeshStandardMaterial({
    color:     0x3D1A08,
    roughness: 0.82,
    metalness: 0.05,
    map:       woodTex,
  });

  // Table top
  const top = new THREE.Mesh(new THREE.BoxGeometry(24, 0.28, 18), woodMat);
  top.position.y = -0.14;
  top.receiveShadow = true;
  tableGroup.add(top);

  // Legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0x2A0F04, roughness: 0.9 });
  const legGeo  = new THREE.BoxGeometry(0.3, 4, 0.3);
  [[-10, -2.28, -8], [10, -2.28, -8], [-10, -2.28, 8], [10, -2.28, 8]].forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, y, z);
    leg.castShadow = true;
    tableGroup.add(leg);
  });

  scene.add(tableGroup);
}

// ──────────────────────────────────────────────
// JOURNAL
// ──────────────────────────────────────────────
function createJournal() {
  journalGroup = new THREE.Group();
  journalGroup.position.set(0, 0.14, 0);

  // Dimensions
  const W = 3.2;   // width (X)
  const D = 4.6;   // depth (Z)
  const T = 0.42;  // total thickness (Y)
  const CT = 0.055; // cover thickness

  // ── Leather cover texture ──────────────────
  const lc  = document.createElement('canvas');
  lc.width  = 512;
  lc.height = 512;
  const lx  = lc.getContext('2d');

  lx.fillStyle = '#182B14';
  lx.fillRect(0, 0, 512, 512);

  // Subtle pebble grain
  for (let i = 0; i < 4000; i++) {
    const px = Math.random() * 512;
    const py = Math.random() * 512;
    const pr = Math.random() * 2.5;
    lx.beginPath();
    lx.arc(px, py, pr, 0, Math.PI * 2);
    lx.fillStyle = `rgba(0,0,0,${0.04 + Math.random() * 0.08})`;
    lx.fill();
  }
  // Subtle highlight speckles
  for (let i = 0; i < 800; i++) {
    const px = Math.random() * 512;
    const py = Math.random() * 512;
    lx.beginPath();
    lx.arc(px, py, Math.random() * 1, 0, Math.PI * 2);
    lx.fillStyle = `rgba(80,120,60,${0.06 + Math.random() * 0.08})`;
    lx.fill();
  }
  const leatherTex = new THREE.CanvasTexture(lc);

  // ── Front cover embossing ──────────────────
  const ec = document.createElement('canvas');
  ec.width  = 512;
  ec.height = 640;
  const ex  = ec.getContext('2d');

  ex.fillStyle = '#182B14';
  ex.fillRect(0, 0, 512, 640);

  // Gold outer border
  ex.strokeStyle = '#C9A84C';
  ex.lineWidth = 8;
  ex.strokeRect(28, 28, 456, 584);
  ex.lineWidth = 2;
  ex.strokeRect(40, 40, 432, 560);

  // Corner flourishes
  const corners = [[44, 44], [468, 44], [44, 596], [468, 596]];
  corners.forEach(([cx, cy]) => {
    ex.beginPath();
    ex.arc(cx, cy, 8, 0, Math.PI * 2);
    ex.fillStyle = '#C9A84C';
    ex.fill();
  });

  // Monogram "G"
  ex.font = 'italic 130px "Playfair Display", Georgia, serif';
  ex.fillStyle = '#C9A84C';
  ex.textAlign = 'center';
  ex.textBaseline = 'middle';
  ex.fillText('G', 256, 240);

  // Thin rule under monogram
  ex.strokeStyle = 'rgba(201,168,76,0.5)';
  ex.lineWidth = 1;
  ex.beginPath();
  ex.moveTo(130, 315); ex.lineTo(382, 315);
  ex.stroke();

  // "PORTFOLIO" label
  ex.font = '500 22px "Cormorant SC", Georgia, serif';
  ex.fillStyle = 'rgba(201,168,76,0.85)';
  ex.letterSpacing = '8px';
  ex.fillText('PORTFOLIO', 256, 360);

  // Year
  ex.font = '300 18px "Cormorant SC", Georgia, serif';
  ex.fillStyle = 'rgba(201,168,76,0.55)';
  ex.letterSpacing = '4px';
  ex.fillText('MMXXIV', 256, 420);

  const embossTex = new THREE.CanvasTexture(ec);

  // ── Materials ──────────────────────────────
  const coverMat  = new THREE.MeshStandardMaterial({ color: 0x1A2E16, roughness: 0.88, metalness: 0.02, map: leatherTex });
  const frontMat  = new THREE.MeshStandardMaterial({ color: 0x1A2E16, roughness: 0.88, metalness: 0.02, map: embossTex  });
  const goldTrim  = new THREE.MeshStandardMaterial({ color: 0xC9A84C, roughness: 0.15, metalness: 1.0,  envMapIntensity: 2.5 });
  const pageMat   = new THREE.MeshStandardMaterial({ color: 0xFFF2E0, roughness: 0.92, metalness: 0.0  });
  const pageEdge  = new THREE.MeshStandardMaterial({ color: 0xF8E8CC, roughness: 0.95, metalness: 0.0  });

  // ── Back cover ─────────────────────────────
  const backCover = new THREE.Mesh(new THREE.BoxGeometry(W, CT, D), coverMat);
  backCover.position.set(0, 0, 0);
  backCover.receiveShadow = true;
  backCover.castShadow    = true;
  journalGroup.add(backCover);

  // ── Pages block ────────────────────────────
  const pagesGeo = new THREE.BoxGeometry(W - 0.08, T, D - 0.06);
  // Use different materials per face: 0=right, 1=left, 2=top, 3=bottom, 4=front, 5=back
  const pagesMesh = new THREE.Mesh(pagesGeo, [
    pageEdge, pageEdge, pageMat, pageMat, pageEdge, pageEdge
  ]);
  pagesMesh.position.set(0, T / 2, 0);
  pagesMesh.castShadow    = true;
  pagesMesh.receiveShadow = true;
  journalGroup.add(pagesMesh);

  // Page line details on top (visible from above when open)
  const lineCanvas  = document.createElement('canvas');
  lineCanvas.width  = 512;
  lineCanvas.height = 512;
  const lnx = lineCanvas.getContext('2d');
  lnx.fillStyle = '#FFF2E0';
  lnx.fillRect(0, 0, 512, 512);
  lnx.strokeStyle = 'rgba(160,130,90,0.25)';
  lnx.lineWidth   = 0.8;
  for (let y = 20; y < 512; y += 16) {
    lnx.beginPath(); lnx.moveTo(0, y); lnx.lineTo(512, y); lnx.stroke();
  }
  // Spine line
  lnx.strokeStyle = 'rgba(160,130,90,0.4)';
  lnx.lineWidth = 1.5;
  lnx.beginPath(); lnx.moveTo(256, 0); lnx.lineTo(256, 512); lnx.stroke();
  pageMat.map = new THREE.CanvasTexture(lineCanvas);
  pageMat.needsUpdate = true;

  // ── Spine ──────────────────────────────────
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.11, T + CT * 2, D), coverMat);
  spine.position.set(-W / 2 - 0.04, T / 2, 0);
  spine.castShadow = true;
  journalGroup.add(spine);

  // Gold spine bands
  const bandGeo = new THREE.BoxGeometry(0.13, 0.025, D);
  [0.05, T + CT - 0.05].forEach(yPos => {
    const band = new THREE.Mesh(bandGeo, goldTrim);
    band.position.set(-W / 2 - 0.04, yPos, 0);
    journalGroup.add(band);
  });

  // ── Front cover (opens via coverPivot) ─────
  // Pivot is at the spine edge (x = -W/2)
  coverPivot = new THREE.Group();
  coverPivot.position.set(-W / 2, T + CT * 1.5, 0);
  journalGroup.add(coverPivot);

  const frontMesh = new THREE.Mesh(new THREE.BoxGeometry(W, CT, D), frontMat);
  // Shift right by W/2 so left edge of cover is at pivot
  frontMesh.position.set(W / 2, 0, 0);
  frontMesh.castShadow    = true;
  frontMesh.receiveShadow = true;
  coverPivot.add(frontMesh);

  // Gold border strip on front cover edge (right side)
  const edgeStrip = new THREE.Mesh(new THREE.BoxGeometry(0.03, CT + 0.01, D), goldTrim);
  edgeStrip.position.set(W, 0, 0);
  coverPivot.add(edgeStrip);

  // Store cover measurements for raycasting interaction target
  journalGroup.userData = { W, D, T, CT };

  scene.add(journalGroup);
}

// ──────────────────────────────────────────────
// GOLD PEN
// ──────────────────────────────────────────────
function createPen() {
  penGroup = new THREE.Group();
  penGroup.visible = false;

  const gold = new THREE.MeshStandardMaterial({
    color:           0xC9A84C,
    roughness:       0.05,
    metalness:       1.0,
    envMapIntensity: 3.0,
  });
  const darkGold = new THREE.MeshStandardMaterial({
    color:           0x8B6A20,
    roughness:       0.1,
    metalness:       1.0,
    envMapIntensity: 2.5,
  });
  const ebony = new THREE.MeshStandardMaterial({
    color:     0x0F0B09,
    roughness: 0.3,
    metalness: 0.4,
  });
  const nib = new THREE.MeshStandardMaterial({
    color:           0xD4AA50,
    roughness:       0.02,
    metalness:       1.0,
    envMapIntensity: 4.0,
  });

  // Cap (rounded top)
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    darkGold
  );
  cap.position.y = 1.06;
  cap.rotation.x = Math.PI;
  penGroup.add(cap);

  // Body — main long cylinder
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.058, 2.1, 24), gold);
  penGroup.add(body);

  // Decorative band near cap
  const band1 = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.012, 10, 32), darkGold);
  band1.position.y = 0.75;
  band1.rotation.x = Math.PI / 2;
  penGroup.add(band1);

  // Clip (flat strip on side)
  const clip = new THREE.Mesh(new THREE.BoxGeometry(0.018, 1.4, 0.04), darkGold);
  clip.position.set(0.072, 0.32, 0);
  penGroup.add(clip);
  const clipTip = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 5), darkGold);
  clipTip.position.set(0.072, -0.38, 0);
  penGroup.add(clipTip);

  // Grip section (slightly textured / darker)
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.054, 0.5, 24), ebony);
  grip.position.y = -0.8;
  penGroup.add(grip);

  // Grip band
  const band2 = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.01, 8, 32), darkGold);
  band2.position.y = -0.55;
  band2.rotation.x = Math.PI / 2;
  penGroup.add(band2);

  // Nib taper
  const nibCone = new THREE.Mesh(new THREE.ConeGeometry(0.054, 0.45, 24), gold);
  nibCone.position.y = -1.28;
  penGroup.add(nibCone);

  // Nib tip (split look)
  const nibTip = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.2, 6), nib);
  nibTip.position.y = -1.6;
  penGroup.add(nibTip);

  // Ink point
  const inkDot = new THREE.Mesh(new THREE.SphereGeometry(0.007, 6, 6), ebony);
  inkDot.position.y = -1.71;
  penGroup.add(inkDot);

  // Tilt pen at writing angle
  penGroup.rotation.z  =  Math.PI / 5;   // lean left
  penGroup.rotation.x  = -Math.PI / 12;  // slight forward tilt
  penGroup.scale.setScalar(0.8);

  scene.add(penGroup);
}

// ──────────────────────────────────────────────
// PARTICLES (ambient dust)
// ──────────────────────────────────────────────
function createParticles() {
  const count = 280;
  const positions = new Float32Array(count * 3);
  const speeds    = new Float32Array(count);
  const phases    = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 22;
    positions[i * 3 + 1] = Math.random() * 9;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    speeds[i]  = 0.015 + Math.random() * 0.02;
    phases[i]  = Math.random() * Math.PI * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.userData.speeds = speeds;
  geo.userData.phases = phases;

  const mat = new THREE.PointsMaterial({
    color:       0xB08050,
    size:        0.035,
    transparent: true,
    opacity:     0.35,
    blending:    THREE.NormalBlending,
    depthWrite:  false,
    sizeAttenuation: true,
  });

  particlePoints = new THREE.Points(geo, mat);
  scene.add(particlePoints);
}

// ──────────────────────────────────────────────
// GLOW PLANE (soft halo under lamp)
// ──────────────────────────────────────────────
function createGlow() {
  const gc = document.createElement('canvas');
  gc.width = gc.height = 256;
  const gx = gc.getContext('2d');
  const gr = gx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0,   'rgba(255, 210, 120, 0.25)');
  gr.addColorStop(0.5, 'rgba(255, 200, 100, 0.08)');
  gr.addColorStop(1,   'rgba(255, 200, 100, 0)');
  gx.fillStyle = gr;
  gx.fillRect(0, 0, 256, 256);

  const glowTex = new THREE.CanvasTexture(gc);
  const glowMat = new THREE.MeshBasicMaterial({
    map:         glowTex,
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), glowMat);
  glow.rotation.x = -Math.PI / 2;
  glow.position.set(1, 0.01, 1);
  scene.add(glow);
}

// ──────────────────────────────────────────────
// DOODLE CANVAS
// ──────────────────────────────────────────────
function setupDoodle() {
  doodleCanvas = document.getElementById('doodle-canvas');
  doodleCtx    = doodleCanvas.getContext('2d');

  // Native resolution
  doodleCanvas.width  = 1200;
  doodleCanvas.height = 900;

  clearDoodle();

  // Draw events
  doodleCanvas.addEventListener('pointerdown',  onDoodleStart);
  doodleCanvas.addEventListener('pointermove',  onDoodleDraw);
  doodleCanvas.addEventListener('pointerup',    onDoodleEnd);
  doodleCanvas.addEventListener('pointerleave', onDoodleEnd);
  doodleCanvas.addEventListener('contextmenu', e => e.preventDefault());
}

function clearDoodle() {
  const w = doodleCanvas.width;
  const h = doodleCanvas.height;
  doodleCtx.fillStyle = '#FFF8EE';
  doodleCtx.fillRect(0, 0, w, h);

  // Ruled lines
  doodleCtx.strokeStyle = 'rgba(160, 130, 90, 0.22)';
  doodleCtx.lineWidth   = 0.8;
  for (let y = 48; y < h; y += 36) {
    doodleCtx.beginPath();
    doodleCtx.moveTo(0, y);
    doodleCtx.lineTo(w, y);
    doodleCtx.stroke();
  }
  // Left margin
  doodleCtx.strokeStyle = 'rgba(180, 80, 80, 0.3)';
  doodleCtx.lineWidth   = 1.2;
  doodleCtx.beginPath();
  doodleCtx.moveTo(80, 0);
  doodleCtx.lineTo(80, h);
  doodleCtx.stroke();
}

function getDoodleXY(e) {
  const r  = doodleCanvas.getBoundingClientRect();
  const sx = doodleCanvas.width  / r.width;
  const sy = doodleCanvas.height / r.height;
  return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
}

function onDoodleStart(e) {
  S.penDown    = true;
  S.lastDoodle = getDoodleXY(e);
  doodleCtx.beginPath();
  doodleCtx.moveTo(S.lastDoodle.x, S.lastDoodle.y);
}

function onDoodleDraw(e) {
  if (!S.penDown) return;
  const pos = getDoodleXY(e);
  doodleCtx.lineCap     = 'round';
  doodleCtx.lineJoin    = 'round';
  doodleCtx.lineWidth   = S.doodleSize;
  doodleCtx.strokeStyle = S.doodleColor;
  doodleCtx.globalAlpha = 0.92;
  doodleCtx.beginPath();
  doodleCtx.moveTo(S.lastDoodle.x, S.lastDoodle.y);
  doodleCtx.lineTo(pos.x, pos.y);
  doodleCtx.stroke();
  doodleCtx.globalAlpha = 1;
  S.lastDoodle = pos;
}

function onDoodleEnd() {
  S.penDown    = false;
  S.lastDoodle = null;
}

// ──────────────────────────────────────────────
// EVENTS
// ──────────────────────────────────────────────
function bindEvents() {
  window.addEventListener('resize', onResize);
  window.addEventListener('click', onClick);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('wheel', onWheel, { passive: false });

  // Close journal
  document.getElementById('bm-close')?.addEventListener('click', closeJournal);

  // Doodle toolbar — colors
  document.querySelectorAll('.swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      S.doodleColor = btn.dataset.color;
      document.querySelectorAll('.swatch').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Doodle toolbar — sizes
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      S.doodleSize = parseFloat(btn.dataset.size);
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Clear doodle
  document.getElementById('clear-btn')?.addEventListener('click', clearDoodle);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick(e) {
  if (!S.loaded || S.journalOpen) return;

  mouseNDC.set(
    (e.clientX / window.innerWidth)  *  2 - 1,
   -(e.clientY / window.innerHeight) *  2 + 1
  );
  raycaster.setFromCamera(mouseNDC, camera);

  const hits = raycaster.intersectObjects(journalGroup.children, true);
  if (hits.length > 0) {
    openJournal();
  }
}

function onMouseMove(e) {}

function onWheel(e) {
  if (S.journalOpen) e.preventDefault();
}

// ──────────────────────────────────────────────
// JOURNAL OPEN / CLOSE
// ──────────────────────────────────────────────
function openJournal() {
  S.journalOpen = true;

  gsap.to('#hint', { opacity: 0, duration: 0.4 });

  // Cover opens
  gsap.to(coverPivot.rotation, {
    z: Math.PI * 0.97,
    duration: 1.6, delay: 0.2,
    ease: 'power2.inOut',
  });

  // Phase 1 — camera sweeps overhead
  gsap.to(camera.position, {
    x: 0, y: 9, z: 0.5,
    duration: 1.5,
    ease: 'power2.inOut',
    onUpdate: () => camera.lookAt(0, 0, 0),
  });

  // Phase 2 — camera dives down into the journal (portal zoom)
  gsap.to(camera.position, {
    x: 0, y: 1.5, z: 0,
    duration: 1.0,
    delay: 1.5,
    ease: 'power4.in',
    onUpdate: () => camera.lookAt(0, 0, 0),
  });

  gsap.to(scene.fog, { density: 0.09, duration: 2.0 });

  // White flash fades in as camera hits the journal surface
  gsap.to('#portal-flash', {
    opacity: 1,
    duration: 0.55,
    delay: 1.85,
    ease: 'power3.in',
    onComplete: () => {
      // While screen is white, swap in the HTML UI
      const ui   = document.getElementById('journal-ui');
      const book = document.getElementById('journal-book');
      ui.classList.add('visible');
      gsap.set(book, { opacity: 1, scale: 1 });

      // Fade the white flash out to reveal the paper page
      gsap.to('#portal-flash', { opacity: 0, duration: 0.55, ease: 'power2.out' });
    },
  });
}

function closeJournal() {
  S.journalOpen = false;

  // Flash to white to mask the scene swap
  gsap.to('#portal-flash', {
    opacity: 1,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: () => {
      const book = document.getElementById('journal-book');
      const ui   = document.getElementById('journal-ui');
      gsap.set(book, { opacity: 0 });
      ui.classList.remove('visible');

      // Kill any lingering open-animation camera tweens, then snap to overhead
      gsap.killTweensOf(camera.position);
      camera.position.set(0, 9, 0.5);
      camera.lookAt(0, 0, 0);

      // Everything starts from here, while screen is still white
      gsap.to('#portal-flash', { opacity: 0, duration: 1.0, ease: 'power2.out' });

      gsap.to(coverPivot.rotation, { z: 0, duration: 1.5, ease: 'power2.inOut' });

      gsap.to(camera.position, {
        x: 0, y: 5.5, z: 8,
        duration: 2.0,
        ease: 'power3.inOut',
        onUpdate: () => camera.lookAt(0, 0, 0),
      });

      gsap.to(scene.fog, { density: 0.055, duration: 2.0 });
      setTimeout(() => gsap.to('#hint', { opacity: 0.8, duration: 0.8 }), 2400);
    },
  });
}


// ──────────────────────────────────────────────
// HEART LOADER  (gold anatomical 3-D heart)
// ──────────────────────────────────────────────

// Parametric 3-D heart surface
//   x = sin³(u)·cos(v)
//   y = [13cos(u) – 5cos(2u) – 2cos(3u) – cos(4u)] / 16
//   z = sin³(u)·sin(v)·0.72          (slight z-flatten)
function buildHeartGeometry(uSeg, vSeg) {
  const pos = [], uv = [], idx = [];

  for (let i = 0; i <= uSeg; i++) {
    for (let j = 0; j <= vSeg; j++) {
      const u  = (i / uSeg) * Math.PI;
      const v  = (j / vSeg) * Math.PI * 2;
      const su = Math.sin(u), cu = Math.cos(u);
      pos.push(
        su * su * su * Math.cos(v),
        (13*cu - 5*Math.cos(2*u) - 2*Math.cos(3*u) - Math.cos(4*u)) / 16,
        su * su * su * Math.sin(v) * 0.72
      );
      uv.push(j / vSeg, i / uSeg);
    }
  }

  for (let i = 0; i < uSeg; i++) {
    for (let j = 0; j < vSeg; j++) {
      const a = i * (vSeg + 1) + j;
      const b = a + 1, c = a + vSeg + 1, d = c + 1;
      idx.push(a, c, b,  b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uv,  2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

function _makeVessel(mat, pts, r) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 18, r, 8, false), mat);
}

let _heartRaf = null;

function startHeartLoader() {
  const canvas = document.getElementById('heart-canvas');
  if (!canvas) return;

  // Renderer — updateStyle:false so CSS controls display size
  const rdr = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  rdr.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  rdr.setSize(280, 280, false);
  rdr.outputColorSpace    = THREE.SRGBColorSpace;
  rdr.toneMapping         = THREE.ACESFilmicToneMapping;
  rdr.toneMappingExposure = 1.4;

  const sc  = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(40, 1.0, 0.1, 50);
  cam.position.set(0, 0.2, 7.0);
  cam.lookAt(0, -0.4, 0);

  // IBL for metal reflections
  const pmrem  = new THREE.PMREMGenerator(rdr);
  sc.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  // Gold metallic material
  const goldMat = new THREE.MeshStandardMaterial({
    color:           new THREE.Color(0xC8A040),
    metalness:       1.0,
    roughness:       0.14,
    envMapIntensity: 2.8,
  });

  // Heart body
  const heartGeo  = buildHeartGeometry(110, 110);
  const heartMesh = new THREE.Mesh(heartGeo, goldMat);
  heartMesh.scale.setScalar(1.8);
  heartMesh.rotation.set(0.0, -0.2, 0.15);  // cardiac axis tilt
  heartMesh.position.y = -0.15;

  // Vessels as children of heartMesh — coords in heart model space (pre-scale)
  // Aortic arch
  heartMesh.add(_makeVessel(goldMat, [[-0.04,0.37,0.04],[-0.14,0.49,0.02],[-0.26,0.60,-0.01],[-0.38,0.55,-0.03]], 0.065));
  // Brachiocephalic
  heartMesh.add(_makeVessel(goldMat, [[-0.20,0.54,0.00],[-0.10,0.65,0.03],[-0.02,0.73,0.05]], 0.034));
  // Left carotid
  heartMesh.add(_makeVessel(goldMat, [[-0.30,0.58,-0.02],[-0.26,0.68,-0.04],[-0.21,0.76,-0.05]], 0.026));
  // Left subclavian
  heartMesh.add(_makeVessel(goldMat, [[-0.36,0.56,-0.03],[-0.34,0.64,-0.07],[-0.40,0.70,-0.11]], 0.024));
  // Pulmonary trunk
  heartMesh.add(_makeVessel(goldMat, [[0.06,0.35,0.07],[0.14,0.51,0.09],[0.18,0.64,0.07]], 0.055));
  // Pulmonary branch L
  heartMesh.add(_makeVessel(goldMat, [[0.18,0.64,0.07],[0.09,0.72,0.12],[0.02,0.77,0.14]], 0.030));
  // Pulmonary branch R
  heartMesh.add(_makeVessel(goldMat, [[0.18,0.64,0.07],[0.27,0.69,0.04],[0.35,0.66,0.00]], 0.028));
  // Superior vena cava
  heartMesh.add(_makeVessel(goldMat, [[-0.03,0.30,-0.06],[-0.08,0.43,-0.10],[-0.12,0.56,-0.13]], 0.034));

  // Assembly group — beat scale animation applied here
  const assembly = new THREE.Group();
  assembly.add(heartMesh);
  sc.add(assembly);

  // Warm gold lighting rig
  sc.add(new THREE.AmbientLight(0xFFF5E0, 0.45));
  const kl = new THREE.PointLight(0xFFE8B0, 5.5, 28);
  kl.position.set(3, 5, 5);  sc.add(kl);
  const fl = new THREE.PointLight(0xFFCC60, 2.2, 22);
  fl.position.set(-4, 2, 4); sc.add(fl);
  const bl = new THREE.PointLight(0xFFF4D0, 1.0, 18);
  bl.position.set(0, -5, -4); sc.add(bl);

  // Heartbeat scale curve — ba-dum pattern, 1.1 s cycle
  function beatScale(t) {
    const m = t % 1.1;
    if (m < 0.10) return 1.000 + (m / 0.10) * 0.068;            // beat 1 ↑
    if (m < 0.20) return 1.068 - ((m - 0.10) / 0.10) * 0.085;  // beat 1 ↓
    if (m < 0.28) return 0.983 + ((m - 0.20) / 0.08) * 0.042;  // beat 2 ↑
    if (m < 0.42) return 1.025 - ((m - 0.28) / 0.14) * 0.025;  // beat 2 ↓
    return 1.000;                                                 // diastole
  }

  let elapsed = 0, prev = performance.now();

  function tick() {
    _heartRaf = requestAnimationFrame(tick);
    const now = performance.now();
    elapsed  += Math.min((now - prev) / 1000, 0.05);
    prev = now;

    const s = beatScale(elapsed);
    assembly.scale.setScalar(s);
    assembly.rotation.y = elapsed * 0.20;  // slow gentle rotation

    rdr.render(sc, cam);
  }
  tick();

  // Cleanup called when loader is dismissed
  window._heartCleanup = () => {
    cancelAnimationFrame(_heartRaf);
    goldMat.dispose();
    heartGeo.dispose();
    rdr.dispose();
  };
}

// ──────────────────────────────────────────────
// LOADING SEQUENCE
// ──────────────────────────────────────────────
function startLoading() {
  startHeartLoader();

  let pct = 0;
  const tick = setInterval(() => {
    pct += Math.random() * 18;
    if (pct < 100) return;
    clearInterval(tick);

    setTimeout(() => {
      const loading = document.getElementById('loading');
      gsap.to(loading, {
        opacity: 0, duration: 1.2, delay: 0.3,
        onComplete: () => {
          loading.style.display = 'none';
          if (window._heartCleanup) window._heartCleanup();
          S.loaded = true;
          gsap.to('#hint', { opacity: 1, duration: 1.2, delay: 0.5 });
        },
      });
    }, 600);
  }, 120);
}

// ──────────────────────────────────────────────
// ANIMATION LOOP
// ──────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);

  const delta   = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  // ── Particles drift upward
  if (particlePoints) {
    const pos    = particlePoints.geometry.attributes.position;
    const speeds = particlePoints.geometry.userData.speeds;
    const phases = particlePoints.geometry.userData.phases;

    for (let i = 0; i < pos.count; i++) {
      const y  = pos.getY(i);
      const sp = speeds[i];
      const ph = phases[i];

      pos.setY(i, y + sp * delta * 40);
      // Slight horizontal drift
      pos.setX(i, pos.getX(i) + Math.sin(elapsed * 0.4 + ph) * 0.003);

      if (pos.getY(i) > 9) pos.setY(i, 0);
    }
    pos.needsUpdate = true;
  }

  // ── Subtle journal idle animation (closed)
  if (!S.journalOpen && journalGroup) {
    journalGroup.position.y = 0.14 + Math.sin(elapsed * 0.6) * 0.008;
    journalGroup.rotation.y = Math.sin(elapsed * 0.22) * 0.012;
  }

  // ── Pen spring smoothing
  if (penGroup.visible) {
    penCurrent.lerp(penTarget, 0.12);
    penGroup.position.copy(penCurrent);

    // Slight wobble / breathing
    penGroup.rotation.z = Math.PI / 5 + Math.sin(elapsed * 1.2) * 0.025;
    penGroup.rotation.x = -Math.PI / 12 + Math.sin(elapsed * 0.7) * 0.01;
  }

  renderer.render(scene, camera);
}

// ──────────────────────────────────────────────
// GO!
// ──────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', init);

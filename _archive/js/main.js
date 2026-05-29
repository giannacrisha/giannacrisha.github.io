import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js';
import ScrollTrigger from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js';
import Lenis from 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.29/dist/lenis.min.js';

gsap.registerPlugin(ScrollTrigger);

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (header && navToggle && navLinks) {
  const closeNav = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    header.classList.remove('nav-open');
  };

  navToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    header.classList.toggle('nav-open', !expanded);
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeNav();
    }
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) {
      closeNav();
    }
  });
}

const hasWebGLSupport = () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return Boolean(window.WebGLRenderingContext && context);
};

if (!hasWebGLSupport()) {
  document.documentElement.classList.add('no-webgl');
  document.body.classList.add('no-webgl');
  console.warn('WebGL unsupported: showing static fallback.');
} else {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.getElementById('hero-canvas');
  const underwaterCanvas = document.getElementById('underwater-canvas');

  if (!(canvas instanceof HTMLCanvasElement) || !(underwaterCanvas instanceof HTMLCanvasElement)) {
    throw new Error('Portfolio canvases unavailable.');
  }

  underwaterCanvas.hidden = false;
  underwaterCanvas.style.opacity = '0';

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x362111, 0.036);

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 160);
  camera.position.set(0, 1.8, 6.2);
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight(0xede0d8, 0.6);
  const keyLight = new THREE.DirectionalLight(0xd6bdb0, 1.1);
  keyLight.position.set(-5, 6, 3);
  const rimLight = new THREE.DirectionalLight(0x362111, 0.55);
  rimLight.position.set(4, -2, -6);
  scene.add(ambientLight, keyLight, rimLight);

  const skyUniforms = {
    uTopColor: { value: new THREE.Color('#ede0d8') },
    uBottomColor: { value: new THREE.Color('#d6bdb0') }
  };

  const skyMaterial = new THREE.ShaderMaterial({
    uniforms: skyUniforms,
    side: THREE.BackSide,
    depthWrite: false,
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vWorldPosition;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      void main() {
        vec3 dir = normalize(vWorldPosition);
        float mixAmount = smoothstep(-0.15, 0.65, dir.y);
        vec3 color = mix(uBottomColor, uTopColor, mixAmount);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });

  const sky = new THREE.Mesh(new THREE.SphereGeometry(60, 48, 48), skyMaterial);
  scene.add(sky);

  const sunUniforms = {
    uCoreColor: { value: new THREE.Color('#ede0d8') },
    uEdgeColor: { value: new THREE.Color('#d6bdb0') },
    uIntensity: { value: 1.0 }
  };

  const sunMaterial = new THREE.ShaderMaterial({
    uniforms: sunUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      uniform vec3 uCoreColor;
      uniform vec3 uEdgeColor;
      uniform float uIntensity;
      void main() {
        float glow = pow(1.0 - vNormal.z, 2.5);
        vec3 color = mix(uEdgeColor, uCoreColor, glow) * uIntensity;
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });

  const sun = new THREE.Mesh(new THREE.SphereGeometry(1.4, 64, 64), sunMaterial);
  sun.position.set(0, 4.1, -11.2);
  scene.add(sun);

  const cloudGeometry = new THREE.PlaneGeometry(4, 2.4, 1, 1);
  const cloudMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new THREE.Color('#ede0d8') },
      uOpacity: { value: 0.55 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform vec3 uColor;
      uniform float uOpacity;
      void main() {
        vec2 centered = (vUv - 0.5) * vec2(1.3, 1.0);
        float alpha = smoothstep(0.65, 0.15, length(centered));
        gl_FragColor = vec4(uColor, alpha * uOpacity);
      }
    `
  });

  const clouds = new THREE.Group();
  for (let i = 0; i < 7; i += 1) {
    const mesh = new THREE.Mesh(cloudGeometry, cloudMaterial.clone());
    mesh.position.set((Math.random() - 0.5) * 18, 2 + Math.random() * 1.2, -6 - Math.random() * 6);
    mesh.scale.set(1.4 + Math.random() * 1.6, 0.8 + Math.random() * 0.5, 1);
    clouds.add(mesh);
  }
  scene.add(clouds);

  const waterUniforms = {
    uTime: { value: 0 },
    uAmplitude: { value: 0.16 },
    uRippleStrength: { value: 0.0 },
    uColorShallow: { value: new THREE.Color('#d6bdb0') },
    uColorDeep: { value: new THREE.Color('#362111') },
    uOpacity: { value: 0.92 }
  };

  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: waterUniforms,
    transparent: true,
    side: THREE.DoubleSide,
    vertexShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uAmplitude;
      uniform float uRippleStrength;

      float wave(vec2 uv, float shift) {
        return sin((uv.x + shift) * 6.0) * 0.6 + cos((uv.y - shift) * 4.0) * 0.4;
      }

      void main() {
        vUv = uv;
        vec3 transformed = position;
        float baseWave = wave(uv, uTime * 0.35);
        float detailWave = sin((uv.x + uTime * 0.8) * 12.0) * 0.15;
        transformed.z += (baseWave + detailWave) * uAmplitude;
        transformed.y += (baseWave * 0.6 + detailWave * 0.4) * uAmplitude;
        transformed.y += uRippleStrength * 0.2 * sin(uv.x * 32.0 + uTime * 3.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform vec3 uColorShallow;
      uniform vec3 uColorDeep;
      uniform float uOpacity;
      void main() {
        float mixAmount = smoothstep(0.1, 0.9, vUv.y);
        vec3 color = mix(uColorShallow, uColorDeep, mixAmount);
        gl_FragColor = vec4(color, uOpacity);
      }
    `
  });

  const water = new THREE.Mesh(new THREE.PlaneGeometry(50, 50, 220, 220), waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -0.42, -2.5);
  scene.add(water);

  const chipGeometry = new THREE.BoxGeometry(0.8, 0.1, 1.4);
  const chipMaterial = new THREE.MeshStandardMaterial({
    color: 0xd6bdb0,
    metalness: 0.1,
    roughness: 0.45,
    emissive: 0x362111,
    emissiveIntensity: 0.18
  });

  const floatingChips = new THREE.Group();
  const chipOffsets = [
    { position: new THREE.Vector3(-1.8, -0.2, 1.5), phase: 0.0 },
    { position: new THREE.Vector3(0.4, -0.15, 0.9), phase: 1.6 },
    { position: new THREE.Vector3(2.2, -0.18, 1.8), phase: 3.1 }
  ];
  chipOffsets.forEach(({ position, phase }) => {
    const mesh = new THREE.Mesh(chipGeometry, chipMaterial.clone());
    mesh.position.copy(position);
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.userData.phase = phase;
    floatingChips.add(mesh);
  });
  scene.add(floatingChips);

  const bubbleCount = 450;
  const bubbleGeometry = new THREE.BufferGeometry();
  const bubblePositions = new Float32Array(bubbleCount * 3);
  const bubbleSpeeds = new Float32Array(bubbleCount);
  for (let i = 0; i < bubbleCount; i += 1) {
    const idx = i * 3;
    bubblePositions[idx] = (Math.random() - 0.5) * 14;
    bubblePositions[idx + 1] = -4 - Math.random() * 6;
    bubblePositions[idx + 2] = -1 - Math.random() * 6;
    bubbleSpeeds[i] = 0.4 + Math.random() * 0.6;
  }
  bubbleGeometry.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));
  bubbleGeometry.setAttribute('speed', new THREE.BufferAttribute(bubbleSpeeds, 1));

  const bubbleMaterial = new THREE.PointsMaterial({
    color: 0xd6bdb0,
    size: 0.08,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const bubbles = new THREE.Points(bubbleGeometry, bubbleMaterial);
  bubbles.visible = false;
  scene.add(bubbles);

  const fishSchool = new THREE.Group();
  fishSchool.visible = false;
  scene.add(fishSchool);

  const fishPalette = [
    0xede0d8,
    0xd6bdb0,
    0x362111
  ];

  const createFish = (hexColor) => {
    const group = new THREE.Group();
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: hexColor,
      metalness: 0.14,
      roughness: 0.32,
      emissive: hexColor,
      emissiveIntensity: 0.16
    });

    const bodyGeometry = new THREE.CapsuleGeometry(0.26, 0.5, 10, 18);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    const tailMaterial = bodyMaterial.clone();
    tailMaterial.color = bodyMaterial.color.clone();
    tailMaterial.color.offsetHSL(0, 0.1, 0.12);
    const tailGeometry = new THREE.ConeGeometry(0.18, 0.48, 10, 1);
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.name = 'tail';
    tail.position.x = -0.62;
    tail.rotation.z = Math.PI / 2;
    tail.rotation.y = Math.PI;
    group.add(tail);

    const dorsalMaterial = bodyMaterial.clone();
    dorsalMaterial.color = bodyMaterial.color.clone();
    dorsalMaterial.color.offsetHSL(0.02, 0.18, 0.18);
    const dorsalGeometry = new THREE.ConeGeometry(0.12, 0.28, 8, 1);
    const dorsal = new THREE.Mesh(dorsalGeometry, dorsalMaterial);
    dorsal.position.set(0.08, 0.18, 0);
    dorsal.rotation.x = Math.PI;
    group.add(dorsal);

    const finMaterial = bodyMaterial.clone();
    finMaterial.color = bodyMaterial.color.clone();
    finMaterial.color.offsetHSL(-0.04, 0.12, 0.08);
    const pectoralGeometry = new THREE.ConeGeometry(0.1, 0.22, 8, 1);
    const leftFin = new THREE.Mesh(pectoralGeometry, finMaterial);
    leftFin.position.set(-0.02, -0.02, 0.16);
    leftFin.rotation.set(Math.PI * 0.5, 0, 0);
    group.add(leftFin);

    const rightFin = leftFin.clone();
    rightFin.position.z = -leftFin.position.z;
    rightFin.rotation.y = Math.PI;
    group.add(rightFin);

    return group;
  };

  const fishStartX = -13;
  const fishEndX = 13;
  const fishSpan = fishEndX - fishStartX;
  const fishCount = reduceMotion ? 6 : 15;

  for (let i = 0; i < fishCount; i += 1) {
    const color = fishPalette[i % fishPalette.length];
    const fish = createFish(color);
    const scale = 0.3 + Math.random() * 0.26;
    fish.scale.setScalar(scale);
    const baseY = -0.8 - Math.random() * 1.5;
    const depth = -1.6 - Math.random() * 3.6;
    fish.position.set(fishStartX, baseY, depth);
    fish.userData = {
      baseY,
      depth,
      sway: 0.18 + Math.random() * 0.28,
      phase: Math.random() * Math.PI * 2,
      offset: Math.random()
    };
    fishSchool.add(fish);
  }

  const underwaterCtx = underwaterCanvas.getContext('2d');
  const underwaterParticles = [];
  const underwaterParticleCount = 90;
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;

  const resizeRenderer = () => {
    const pixelRatio = Math.min(window.devicePixelRatio, 1.75);
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(viewportWidth, viewportHeight);
    camera.aspect = viewportWidth / viewportHeight;
    camera.updateProjectionMatrix();

    underwaterCanvas.width = viewportWidth * pixelRatio;
    underwaterCanvas.height = viewportHeight * pixelRatio;
    underwaterCanvas.style.width = `${viewportWidth}px`;
    underwaterCanvas.style.height = `${viewportHeight}px`;
    underwaterCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const initUnderwaterParticles = () => {
    underwaterParticles.length = 0;
    for (let i = 0; i < underwaterParticleCount; i += 1) {
      underwaterParticles.push({
        x: Math.random() * viewportWidth,
        y: Math.random() * viewportHeight,
        radius: 1 + Math.random() * 2,
        speed: 12 + Math.random() * 20,
        hue: 30 + Math.random() * 10,
        alpha: 0.0
      });
    }
  };

  const drawUnderwaterParticles = (delta) => {
    underwaterCtx.save();
    underwaterCtx.clearRect(0, 0, viewportWidth, viewportHeight);
    underwaterParticles.forEach((particle) => {
      particle.y -= particle.speed * delta;
      if (particle.y + particle.radius < 0) {
        particle.y = viewportHeight + particle.radius;
        particle.x = Math.random() * viewportWidth;
        particle.radius = 1 + Math.random() * 2;
      }
      particle.alpha = Math.min(0.2 + particle.radius * 0.04, 0.45);
      underwaterCtx.beginPath();
      underwaterCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      underwaterCtx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${particle.alpha})`;
      underwaterCtx.fill();
    });
    underwaterCtx.restore();
  };

  resizeRenderer();
  initUnderwaterParticles();
  window.addEventListener('resize', () => {
    resizeRenderer();
    initUnderwaterParticles();
  });

  const state = {
    buoyStrength: 0.12,
    underwaterActive: false,
    waterRise: -0.42,
    fishActive: false,
    fishProgress: 0,
    fishLoopCount: 3
  };

  const setFishActive = (active) => {
    state.fishActive = active;
    fishSchool.visible = active;
  };

  let lenis;
  if (!reduceMotion) {
    lenis = new Lenis({ smoothWheel: true, smoothTouch: false, lerp: 0.12, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    window.addEventListener('scroll', () => ScrollTrigger.update());
  }

  ScrollTrigger.defaults({ scrub: !reduceMotion, ease: 'none' });

  if (!reduceMotion) {
    const heroTL = gsap.timeline({
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top' }
    });
    heroTL.to(sun.position, { y: 1.2, z: -10.4, duration: 1 }, 0);
    heroTL.to(sunUniforms.uCoreColor.value, { r: 0.839, g: 0.741, b: 0.69, duration: 1 }, 0);
    heroTL.to(sunUniforms.uEdgeColor.value, { r: 0.212, g: 0.129, b: 0.067, duration: 1 }, 0);
    heroTL.to(skyUniforms.uTopColor.value, { r: 0.929, g: 0.878, b: 0.847, duration: 1 }, 0.4);
    heroTL.to(skyUniforms.uBottomColor.value, { r: 0.839, g: 0.741, b: 0.69, duration: 1 }, 0.4);
    heroTL.to(clouds.position, { y: -0.45, duration: 1 }, 0);

    const projectsTL = gsap.timeline({
      scrollTrigger: { trigger: '#projects', start: 'top 80%', end: 'bottom center' }
    });
    projectsTL.to(waterUniforms.uAmplitude, { value: 0.25, duration: 1.2 }, 0);
    projectsTL.to(state, { buoyStrength: 0.32, duration: 1.2 }, 0);

    const processTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#process',
        start: 'top 80%',
        end: 'bottom center',
        onEnter: () => { state.underwaterActive = true; bubbles.visible = true; },
        onLeaveBack: () => {
          state.underwaterActive = false;
          bubbles.visible = false;
          bubbleMaterial.opacity = 0.0;
        }
      }
    });
    processTL.to(camera.position, { y: 1.0, z: 4.4, duration: 1.2, ease: 'power1.inOut' }, 0);
    processTL.to(state, { waterRise: -1.1, duration: 1.2, ease: 'sine.inOut' }, 0);
    processTL.to(scene.fog, { density: 0.07, duration: 1.2 }, 0);
    processTL.to(sun.position, { y: -0.2, z: -9.6, duration: 1.2, ease: 'sine.inOut' }, 0);
    processTL.to(sunUniforms.uIntensity, { value: 0.85, duration: 1.2 }, 0);
    processTL.to(waterUniforms.uColorShallow.value, { r: 0.839, g: 0.741, b: 0.69, duration: 1.2 }, 0);
    processTL.to(waterUniforms.uColorDeep.value, { r: 0.212, g: 0.129, b: 0.067, duration: 1.2 }, 0);
    processTL.to(bubbleMaterial, { opacity: 0.45, duration: 1 }, 0.2);
    processTL.to(underwaterCanvas, { opacity: 0.65, duration: 1.4, ease: 'sine.inOut' }, 0.1);

    const aboutTL = gsap.timeline({
      scrollTrigger: { trigger: '#about', start: 'top 80%', end: 'bottom center' }
    });
    aboutTL.to(camera.position, { y: 0.86, z: 3.4, duration: 1 }, 0);
    aboutTL.to(scene.fog, { density: 0.09, duration: 1 }, 0);
    aboutTL.to(state, { buoyStrength: 0.18, duration: 1 }, 0);
    aboutTL.to(sun.position, { y: -0.52, z: -9.0, duration: 1 }, 0);
    aboutTL.to(sunUniforms.uIntensity, { value: 0.72, duration: 1 }, 0);

    const writingTL = gsap.timeline({
      scrollTrigger: { trigger: '#writing', start: 'top 80%', end: 'bottom center' }
    });
    writingTL.to(camera.position, { y: 0.72, z: 2.8, duration: 1 }, 0);
    writingTL.to(scene.fog, { density: 0.095, duration: 1 }, 0);
    writingTL.to(sun.position, { y: -0.95, z: -8.7, duration: 1 }, 0);
    writingTL.to(sunUniforms.uCoreColor.value, { r: 0.929, g: 0.878, b: 0.847, duration: 1 }, 0);
    writingTL.to(sunUniforms.uEdgeColor.value, { r: 0.212, g: 0.129, b: 0.067, duration: 1 }, 0);
    writingTL.to(sunUniforms.uIntensity, { value: 0.6, duration: 1 }, 0);
    writingTL.to(underwaterCanvas, { opacity: 0.75, duration: 1 }, 0);
    writingTL.to(bubbleMaterial, { opacity: 0.55, duration: 1 }, 0);

    const contactTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%',
        end: 'bottom bottom',
        onLeave: () => { state.underwaterActive = false; setFishActive(false); },
        onLeaveBack: () => { state.underwaterActive = true; setFishActive(true); }
      }
    });
    contactTL.to(camera.position, { y: 0.85, z: 3.1, duration: 1 }, 0);
    contactTL.to(scene.fog, { density: 0.06, duration: 1 }, 0);
    contactTL.to(sun.position, { y: -1.35, z: -8.3, duration: 1 }, 0);
    contactTL.to(sunUniforms.uIntensity, { value: 0.48, duration: 1 }, 0);
    contactTL.to(underwaterCanvas, { opacity: 0.35, duration: 1 }, 0.2);
    contactTL.to(bubbleMaterial, { opacity: 0.3, duration: 1 }, 0.2);

    ScrollTrigger.create({
      trigger: '#process',
      start: 'top bottom',
      endTrigger: '#contact',
      end: 'bottom top',
      scrub: false,
      onEnter: () => setFishActive(true),
      onEnterBack: () => setFishActive(true),
      onLeave: () => setFishActive(false),
      onLeaveBack: () => setFishActive(false),
      onUpdate: (self) => {
        state.fishProgress = self.progress;
      }
    });
  } else {
    waterUniforms.uAmplitude.value = 0.08;
    state.buoyStrength = 0.05;
    state.waterRise = -0.6;
    scene.fog.density = 0.055;
    bubbles.visible = false;
    underwaterCanvas.style.opacity = '0';
    state.fishLoopCount = 1;
    state.fishProgress = 0;
    setFishActive(false);
  }

  const portrait = document.querySelector('.about-portrait');
  if (portrait) {
    const triggerRipple = () => {
      if (reduceMotion) return;
      gsap.fromTo(waterUniforms.uRippleStrength, { value: 0.35 }, { value: 0.0, duration: 1.2, ease: 'sine.out' });
    };
    portrait.addEventListener('mouseenter', triggerRipple);
    portrait.addEventListener('focus', triggerRipple);
  }

  document.querySelectorAll('.project-card').forEach((card, index) => {
    const glowBoost = 0.3 + index * 0.07;
    card.addEventListener('mouseenter', () => {
      if (reduceMotion) return;
      gsap.to(sunUniforms.uIntensity, { value: 1.25 + glowBoost * 0.2, duration: 0.6 });
    });
    card.addEventListener('mouseleave', () => {
      if (reduceMotion) return;
      gsap.to(sunUniforms.uIntensity, { value: 1.0, duration: 0.8 });
    });
  });

  const clock = new THREE.Clock();
  let previousElapsed = 0;

  const animate = () => {
    const elapsed = clock.getElapsedTime();
    const delta = elapsed - previousElapsed;
    previousElapsed = elapsed;

    waterUniforms.uTime.value = elapsed;
    water.position.y = THREE.MathUtils.damp(water.position.y, state.waterRise, 3.2, delta);

    floatingChips.children.forEach((chip, idx) => {
      const phase = chip.userData.phase || 0;
      const bob = Math.sin(elapsed * 1.2 + phase) * state.buoyStrength * 0.6;
      chip.position.y = -0.25 + bob;
      chip.rotation.x = Math.sin(elapsed * 0.8 + idx) * 0.08;
      chip.rotation.z = Math.cos(elapsed * 0.6 + idx * 0.2) * 0.05;
    });

    clouds.children.forEach((cloud, idx) => {
      cloud.position.x += Math.sin(elapsed * 0.05 + idx) * 0.0008;
      cloud.position.y += Math.cos(elapsed * 0.08 + idx) * 0.0006;
    });

    if (fishSchool.children.length > 0) {
      const loops = Math.max(state.fishLoopCount, 1);
      const loopedProgress = state.fishProgress * loops;
      fishSchool.children.forEach((fish, idx) => {
        const data = fish.userData;
        const normalized = ((loopedProgress + data.offset) % 1 + 1) % 1;
        fish.position.x = fishStartX + normalized * fishSpan;
        fish.position.y = data.baseY + Math.sin(elapsed * 2.2 + data.phase + idx * 0.15) * data.sway;
        fish.rotation.y = 0;
        fish.rotation.x = Math.sin(elapsed * 0.7 + data.phase) * 0.06;
        fish.rotation.z = Math.sin(elapsed * 0.8 + data.phase) * 0.03;
        const tail = fish.getObjectByName('tail');
        if (tail) {
          tail.rotation.y = Math.sin(elapsed * 6.4 + data.phase) * 0.55;
        }
      });
    }

    if (state.underwaterActive || bubbleMaterial.opacity > 0.01) {
      const positionsAttr = bubbleGeometry.getAttribute('position');
      const speedsAttr = bubbleGeometry.getAttribute('speed');
      for (let i = 0; i < bubbleCount; i += 1) {
        const yIndex = i * 3 + 1;
        positionsAttr.array[yIndex] += speedsAttr.array[i] * delta * 0.35;
        if (positionsAttr.array[yIndex] > 2.5) {
          positionsAttr.array[yIndex] = -6 - Math.random() * 4;
        }
      }
      positionsAttr.needsUpdate = true;
      drawUnderwaterParticles(Math.min(delta, 0.033));
      bubbles.visible = true;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);

  ScrollTrigger.refresh();
}

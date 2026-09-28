// Scène WebGL principale : un nuage de particules qui se métamorphose
// au fil des « salles » du musée (carte → basilique → cacao → masque → océan).
import * as THREE from 'three';
import gsap from 'gsap';
import { mapShape, basilicaShape, cocoaShape, maskShape, oceanShape, dustShape, CITIES, lonLatToLocal } from './shapes.js';

const vertexShader = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 aColFrom;
  attribute vec3 aColTo;
  attribute float aRand;
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uWaveFrom;
  uniform float uWaveTo;
  varying vec3 vColor;
  varying float vTwinkle;

  float easeInOut(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    float p = clamp(uProgress * 1.4 - aRand * 0.4, 0.0, 1.0);
    p = easeInOut(p);
    vec3 pos = mix(aFrom, aTo, p);

    // Tourbillon pendant la transition
    float bulge = sin(p * 3.14159);
    vec3 swirl = vec3(
      sin(uTime * 0.9 + aRand * 25.0),
      cos(uTime * 0.7 + aRand * 17.0),
      sin(uTime * 0.8 + aRand * 11.0)
    );
    pos += swirl * bulge * (0.6 + aRand * 1.4);

    // Respiration permanente
    pos += vec3(
      sin(uTime * 0.6 + aRand * 40.0),
      cos(uTime * 0.5 + aRand * 30.0),
      sin(uTime * 0.7 + aRand * 50.0)
    ) * 0.018;

    // Houle (forme océan)
    float w = mix(uWaveFrom, uWaveTo, p);
    pos.y += w * (sin(pos.x * 0.9 + uTime * 1.1) * 0.28 + sin(pos.z * 1.3 + uTime * 0.8) * 0.2 + sin((pos.x + pos.z) * 2.2 + uTime * 1.7) * 0.06);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aRand * 0.8) * uPixelRatio * (1.0 / -mv.z);

    vColor = mix(aColFrom, aColTo, p);
    vTwinkle = 0.7 + 0.3 * sin(uTime * 2.0 + aRand * 80.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor * vTwinkle, a * uOpacity);
  }
`;

const SHAPES = {
  map: { fn: mapShape, x: 1.3, y: 0, rotX: -0.35, spin: 0, wave: 0, scale: 1 },
  mapSide: { fn: 'map', x: 2.5, y: 0, rotX: -0.3, spin: 0, wave: 0, scale: 0.9 },
  dust: { fn: dustShape, x: 0, y: 0, rotX: 0, spin: 0.02, wave: 0, scale: 1 },
  basilica: { fn: basilicaShape, x: 2.3, y: 0.35, rotX: 0.22, spin: 0.12, wave: 0, scale: 0.78 },
  cocoa: { fn: cocoaShape, x: 2.2, y: 0, rotX: 0.3, spin: 0.25, wave: 0, scale: 1, rotZ: -0.5 },
  mask: { fn: maskShape, x: 2.2, y: 0.1, rotX: 0, spin: 0, wave: 0, scale: 1.05, sway: true },
  ocean: { fn: oceanShape, x: 0, y: 0, rotX: 0, spin: 0, wave: 1, scale: 1 },
};

export class ParticleWorld {
  constructor(canvas, { count = 16000 } = {}) {
    this.canvas = canvas;
    this.count = count;
    this.current = 'dust';
    this.pointer = { x: 0, y: 0 };
    this.isMobile = window.matchMedia('(max-width: 820px)').matches;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    this.camera.position.set(0, 0, 9.5);

    this.root = new THREE.Group(); // position / inclinaison
    this.spinner = new THREE.Group(); // rotation continue
    this.root.add(this.spinner);
    this.scene.add(this.root);

    this.buffers = {};
    for (const [name, def] of Object.entries(SHAPES)) {
      if (typeof def.fn === 'string') continue;
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      def.fn(pos, col, count);
      this.buffers[name] = { pos, col };
    }

    // les alias (fn: 'map') réutilisent le nuage d'une autre forme
    for (const [name, def] of Object.entries(SHAPES)) if (typeof def.fn === 'string') this.buffers[name] = this.buffers[def.fn];

    const g = new THREE.BufferGeometry();
    const from = this.buffers.dust.pos.slice();
    const colFrom = this.buffers.dust.col.slice();
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) rnd[i] = Math.random();
    g.setAttribute('position', new THREE.BufferAttribute(from.slice(), 3));
    g.setAttribute('aFrom', new THREE.BufferAttribute(from, 3));
    g.setAttribute('aTo', new THREE.BufferAttribute(from.slice(), 3));
    g.setAttribute('aColFrom', new THREE.BufferAttribute(colFrom, 3));
    g.setAttribute('aColTo', new THREE.BufferAttribute(colFrom.slice(), 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    this.rand = rnd;

    this.uniforms = {
      uProgress: { value: 1 },
      uTime: { value: 0 },
      uSize: { value: this.isMobile ? 38 : 46 },
      uPixelRatio: { value: this.renderer.getPixelRatio() },
      uOpacity: { value: 1 },
      uWaveFrom: { value: 0 },
      uWaveTo: { value: 0 },
    };
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.points = new THREE.Points(g, this.material);
    this.spinner.add(this.points);

    this.timer = new THREE.Timer();
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    window.addEventListener('pointermove', (e) => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    });
    this.resize();
    this.running = true;
    this.tick = this.tick.bind(this);
    requestAnimationFrame(this.tick);
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // portrait (mobile ou tablette) : la forme passe au-dessus du texte
    this.isMobile = w < 820 || w / h < 0.85;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Recule la caméra sur les écrans étroits pour garder la forme entière
    this.camera.position.z = w / h < 0.8 ? 14 : 9.5;
    this.camera.updateProjectionMatrix();
    this.applyLayout(0);
  }

  // Calcule la position courante (mélange) pour pouvoir interrompre une morph
  snapshot() {
    const g = this.points.geometry;
    const from = g.attributes.aFrom.array;
    const to = g.attributes.aTo.array;
    const cf = g.attributes.aColFrom.array;
    const ct = g.attributes.aColTo.array;
    const P = this.uniforms.uProgress.value;
    for (let i = 0; i < this.count; i++) {
      let p = Math.min(1, Math.max(0, P * 1.4 - this.rand[i] * 0.4));
      p = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      for (let k = 0; k < 3; k++) {
        const j = i * 3 + k;
        from[j] = from[j] + (to[j] - from[j]) * p;
        cf[j] = cf[j] + (ct[j] - cf[j]) * p;
      }
    }
    const wf = this.uniforms.uWaveFrom.value;
    this.uniforms.uWaveFrom.value = wf + (this.uniforms.uWaveTo.value - wf) * P;
  }

  morphTo(name, { duration = 2.2 } = {}) {
    if (!SHAPES[name] || name === this.current) return;
    const g = this.points.geometry;
    this.snapshot();
    g.attributes.aTo.array.set(this.buffers[name].pos);
    g.attributes.aColTo.array.set(this.buffers[name].col);
    for (const a of ['aFrom', 'aTo', 'aColFrom', 'aColTo']) g.attributes[a].needsUpdate = true;
    this.uniforms.uWaveTo.value = SHAPES[name].wave;
    this.current = name;
    gsap.killTweensOf(this.uniforms.uProgress);
    this.uniforms.uProgress.value = 0;
    gsap.to(this.uniforms.uProgress, { value: 1, duration, ease: 'none' });
    this.applyLayout(duration * 0.8);
  }

  applyLayout(duration) {
    const def = SHAPES[this.current];
    const x = this.isMobile ? 0 : def.x;
    const isMap = def.fn === mapShape || def.fn === 'map';
    // Sur mobile, la forme se place au-dessus du texte
    const y = this.isMobile && def.x ? def.y + (isMap ? 2.9 : 1.2) : def.y;
    const s = (this.isMobile && def.x ? (isMap ? 0.72 : 0.8) : 1) * def.scale;
    gsap.to(this.root.position, { x, y, duration, ease: 'power3.inOut' });
    gsap.to(this.root.scale, { x: s, y: s, z: s, duration, ease: 'power3.inOut' });
    gsap.to(this.root.rotation, { x: def.rotX, z: def.rotZ || 0, duration, ease: 'power3.inOut' });
    if (!def.spin) {
      // revient à l'orientation d'origine la plus proche
      const target = Math.round(this.spinner.rotation.y / (Math.PI * 2)) * Math.PI * 2;
      gsap.to(this.spinner.rotation, { y: target, duration: duration || 0.01, ease: 'power3.inOut' });
    }
  }

  setOpacity(v, duration = 1) {
    gsap.to(this.uniforms.uOpacity, { value: v, duration, ease: 'power2.out' });
  }

  // Position écran (px) des villes quand la carte est affichée
  cityScreenPositions() {
    const v = new THREE.Vector3();
    this.points.updateWorldMatrix(true, false);
    return CITIES.map((c) => {
      const [x, y] = lonLatToLocal(c.lon, c.lat);
      v.set(x, y, 0.15).applyMatrix4(this.points.matrixWorld).project(this.camera);
      return { ...c, x: (v.x * 0.5 + 0.5) * window.innerWidth, y: (-v.y * 0.5 + 0.5) * window.innerHeight };
    });
  }

  tick() {
    if (!this.running) return;
    this.timer.update();
    const dt = Math.min(this.timer.getDelta(), 0.05);
    const t = this.timer.getElapsed();
    this.uniforms.uTime.value = t;
    const def = SHAPES[this.current];
    if (def.spin && gsap.getTweensOf(this.spinner.rotation).length === 0) this.spinner.rotation.y += def.spin * dt * 2;
    if (def.sway) this.spinner.rotation.y = Math.sin(t * 0.5) * 0.45;
    // Parallaxe douce au pointeur
    this.scene.rotation.y += (this.pointer.x * 0.18 - this.scene.rotation.y) * 0.04;
    this.scene.rotation.x += (this.pointer.y * 0.1 - this.scene.rotation.x) * 0.04;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.tick);
  }

  pause() {
    this.running = false;
  }

  resume() {
    if (this.running) return;
    this.running = true;
    this.timer.update();
    requestAnimationFrame(this.tick);
  }
}

// Salle II — une galerie de musée en 3D que l'on traverse au scroll.
import * as THREE from 'three';

const SPACING = 7;
const WALL_X = 3.2;
const EYE = 1.6;

const beamMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
  uniforms: { uColor: { value: new THREE.Color('#ffcf8a') } },
  vertexShader: /* glsl */ `
    varying float vY;
    varying vec3 vN;
    varying vec3 vView;
    void main() {
      vY = uv.y;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vN = normalize(normalMatrix * normal);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    varying float vY;
    varying vec3 vN;
    varying vec3 vView;
    void main() {
      float rim = pow(abs(dot(vN, vView)), 1.6);
      float a = vY * vY * 0.2 * rim;
      gl_FragColor = vec4(uColor, a);
    }
  `,
});

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, 'rgba(255,214,150,0.55)');
  grd.addColorStop(0.5, 'rgba(255,170,90,0.14)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function endWallTexture() {
  const c = document.createElement('canvas');
  c.width = 2048;
  c.height = 1024;
  const g = c.getContext('2d');
  g.fillStyle = '#1b110a';
  g.fillRect(0, 0, c.width, c.height);
  // motif adinkra/kita stylisé en bandes
  const colors = ['#F77F00', '#FFF6E8', '#00A65A', '#E8B04B'];
  for (let i = 0; i < 64; i++) {
    g.fillStyle = colors[i % 4];
    g.globalAlpha = 0.08;
    g.fillRect(i * 32, 0, 16, c.height);
  }
  g.globalAlpha = 1;
  g.fillStyle = '#E8B04B';
  g.textAlign = 'center';
  g.font = 'italic 300 200px Fraunces, Georgia, serif';
  g.fillText('Akwaba', 1024, 540);
  g.font = '500 46px Manrope, sans-serif';
  g.fillStyle = '#FFF6E8';
  g.fillText('LA VISITE CONTINUE  →', 1024, 680);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class MuseumGallery {
  constructor(canvas, artworks, { onActive } = {}) {
    this.canvas = canvas;
    this.artworks = artworks;
    this.onActive = onActive;
    this.progress = 0;
    this.smooth = 0;
    this.active = -1;
    this.visible = false;
    this.pointer = { x: 0, y: 0 };

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0c0705');
    this.scene.fog = new THREE.Fog('#0c0705', 7, 30);
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 80);
    this.camera.position.set(0, EYE, 5);

    this.length = artworks.length * SPACING + 6;
    this.build();

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    canvas.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      this.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      this.pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    });
    this.resize();
    this.timer = new THREE.Timer();
    this.tick = this.tick.bind(this);
  }

  build() {
    const s = this.scene;
    s.add(new THREE.HemisphereLight('#ffe2b8', '#1a0e06', 0.55));
    this.camLight = new THREE.PointLight('#ffb870', 18, 14, 1.6);
    s.add(this.camLight);

    const L = this.length;
    const wallMat = new THREE.MeshStandardMaterial({ color: '#3a2415', roughness: 0.92 });
    const floorMat = new THREE.MeshStandardMaterial({ color: '#1a0f09', roughness: 0.35, metalness: 0.2 });
    const ceilMat = new THREE.MeshStandardMaterial({ color: '#120a06', roughness: 1 });

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(WALL_X * 2, L + 20), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -L / 2 + 5;
    s.add(floor);
    const ceil = floor.clone();
    ceil.material = ceilMat;
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = 4.6;
    s.add(ceil);
    for (const side of [-1, 1]) {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(L + 20, 4.6), wallMat);
      w.rotation.y = -side * Math.PI / 2;
      w.position.set(side * WALL_X, 2.3, -L / 2 + 5);
      s.add(w);
      // plinthe dorée
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, L + 20), new THREE.MeshStandardMaterial({ color: '#c9a45c', metalness: 0.9, roughness: 0.3 }));
      rail.position.set(side * (WALL_X - 0.02), 0.12, -L / 2 + 5);
      s.add(rail);
    }
    // bandes lumineuses au sol (chemin de visite)
    const stripMat = new THREE.MeshBasicMaterial({ color: '#E8B04B', transparent: true, opacity: 0.35 });
    for (let z = 4; z > -L; z -= 2.2) {
      const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 1), stripMat);
      strip.rotation.x = -Math.PI / 2;
      strip.position.set(0, 0.002, z);
      s.add(strip);
    }

    // mur du fond
    const end = new THREE.Mesh(new THREE.PlaneGeometry(WALL_X * 2, 4.6), new THREE.MeshBasicMaterial({ map: endWallTexture() }));
    end.position.set(0, 2.3, -L + 1);
    s.add(end);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const glow = glowTexture();
    const frameMat = new THREE.MeshStandardMaterial({ color: '#c9a45c', metalness: 0.85, roughness: 0.28 });
    const matMat = new THREE.MeshStandardMaterial({ color: '#efe4d0', roughness: 0.9 });

    this.anchors = [];
    this.artworks.forEach((art, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const z = -i * SPACING - 2;
      const group = new THREE.Group();
      group.position.set(side * (WALL_X - 0.06), 2.05, z);
      group.rotation.y = side * -Math.PI / 2;
      s.add(group);

      const pic = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: '#2a1a10' }));
      pic.position.z = 0.03;
      const mat = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), matMat);
      mat.position.z = 0.02;
      const frame = new THREE.Group();
      group.add(mat, pic, frame);

      const fit = (aspect) => {
        const maxW = 3.1;
        const maxH = 2.2;
        let w = maxW;
        let h = w / aspect;
        if (h > maxH) {
          h = maxH;
          w = h * aspect;
        }
        pic.scale.set(w, h, 1);
        mat.scale.set(w + 0.4, h + 0.4, 1);
        frame.clear();
        const t = 0.09;
        const W = w + 0.4 + t;
        const H = h + 0.4 + t;
        const bars = [
          [W, t, 0, H / 2], [W, t, 0, -H / 2], [t, H, W / 2, 0], [t, H, -W / 2, 0],
        ];
        for (const [bw, bh, x, y] of bars) {
          const b = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.1), frameMat);
          b.position.set(x, y, 0.04);
          frame.add(b);
        }
      };
      fit(4 / 3);
      loader.load(
        art.img,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 4;
          pic.material.map = tex;
          pic.material.color.set('#ffffff');
          pic.material.needsUpdate = true;
          fit(tex.image.width / tex.image.height);
        },
        undefined,
        () => {}
      );

      // halo de projecteur sur le mur
      const halo = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 4.6), new THREE.MeshBasicMaterial({ map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      halo.position.set(0, 0.2, 0.005);
      group.add(halo);

      // faisceau lumineux
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 1.6, 2.6, 32, 1, true), beamMaterial);
      beam.position.set(side * (WALL_X - 1.1), 3.3, z);
      beam.rotation.z = side * 0.5;
      s.add(beam);
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 0.25, 16), frameMat);
      lamp.position.set(side * (WALL_X - 0.6), 4.45, z);
      s.add(lamp);

      this.anchors.push({ z, side });
    });

    // poussière dorée en suspension
    const n = 900;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      p[i * 3] = (Math.random() - 0.5) * WALL_X * 2;
      p[i * 3 + 1] = Math.random() * 4.5;
      p[i * 3 + 2] = 5 - Math.random() * (L + 5);
    }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.BufferAttribute(p, 3));
    this.dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: '#ffd9a0', size: 0.025, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.add(this.dust);
  }

  resize() {
    const r = this.canvas.parentElement.getBoundingClientRect();
    const w = r.width || window.innerWidth;
    const h = r.height || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.fov = w / h < 0.8 ? 72 : 55;
    this.camera.updateProjectionMatrix();
  }

  setProgress(p) {
    this.progress = p;
  }

  start() {
    if (this.visible) return;
    this.visible = true;
    this.timer.update();
    requestAnimationFrame(this.tick);
  }

  stop() {
    this.visible = false;
  }

  tick() {
    if (!this.visible) return;
    this.timer.update();
    const t = this.timer.getElapsed();
    this.smooth += (this.progress - this.smooth) * 0.08;
    const zStart = 5;
    const zEnd = -this.length + 5.5;
    const z = zStart + (zEnd - zStart) * this.smooth;

    // tableau le plus proche : la caméra tourne la tête vers lui
    let best = -1;
    let bestD = Infinity;
    this.anchors.forEach((a, i) => {
      const d = Math.abs(z - 3.2 - a.z);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    const focus = bestD < SPACING * 0.5 ? 1 - bestD / (SPACING * 0.5) : 0;
    const a = this.anchors[best];
    const look = Math.pow(focus, 0.7) * (a ? a.side : 0);

    this.camera.position.set(Math.sin(t * 0.4) * 0.05 - look * 0.6, EYE + Math.sin(t * 0.9) * 0.02, z);
    const yaw = -look * 0.95 - this.pointer.x * 0.12;
    const target = new THREE.Vector3(
      this.camera.position.x + Math.sin(yaw) * -1,
      EYE - this.pointer.y * 0.12,
      z - Math.cos(yaw)
    );
    this.camera.lookAt(target);
    this.camLight.position.set(this.camera.position.x, 3.4, z - 1.5);

    const active = focus > 0.35 ? best : -1;
    if (active !== this.active) {
      this.active = active;
      this.onActive?.(active);
    }

    this.dust.rotation.y = Math.sin(t * 0.05) * 0.02;
    this.dust.position.y = Math.sin(t * 0.3) * 0.08;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.tick);
  }
}

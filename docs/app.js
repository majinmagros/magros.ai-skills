import * as THREE from 'three';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js';

const state = {
  data: null,
  filter: 'all',
  module: '',
  sort: 'name',
  query: '',
  clima: 'subtle',
};

const els = {
  grid: document.getElementById('grid'),
  search: document.getElementById('search'),
  status: document.getElementById('statusLine'),
  counters: {
    total: document.getElementById('cTotal'),
    autorais: document.getElementById('cAutorais'),
    modules: document.getElementById('cModules'),
  },
  chips: [...document.querySelectorAll('.chip')],
  moduleFilter: document.getElementById('moduleFilter'),
  sort: document.getElementById('sort'),
  detail: document.getElementById('detail'),
  detailContent: document.getElementById('detailContent'),
  detailClose: document.getElementById('detailClose'),
  backdrop: document.getElementById('modalBackdrop'),
  modeToggle: document.getElementById('modeToggle'),
  themeBtn: document.getElementById('themeBtn'),
  sectionNav: [...document.querySelectorAll('.sec-btn')],
  musicSection: document.getElementById('musicSection'),
  musicList: document.getElementById('musicList'),
  musicStatus: document.getElementById('musicStatus'),
};

let musicState = { tracks: [], current: null, audio: null };

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

async function load() {
  const res = await fetch('data/skills.json');
  state.data = await res.json();
  const s = state.data;
  els.counters.total.textContent = s.counts.total;
  els.counters.autorais.textContent = s.counts.autorais;
  els.counters.modules.textContent = s.counts.modules;
  populateModules();
  els.status.textContent = `${s.counts.total} skills · ${s.counts.autorais} autorais · ${s.counts.ecc} ECC · ${s.counts.modules} módulos`;
  render();
}

function populateModules() {
  const modules = [...new Set(state.data.skills.map(x => x.module).filter(Boolean))].sort();
  els.moduleFilter.innerHTML = '<option value="">MÓDULO: TODOS</option>' +
    modules.map(m => `<option value="${esc(m)}">${esc(m)}</option>`).join('');
}

function matches(skill) {
  if (state.filter === 'autoral' && skill.origin !== 'autoral') return false;
  if (state.filter === 'ecc' && skill.origin !== 'ecc') return false;
  if (state.module && skill.module !== state.module) return false;
  if (state.query) {
    const q = state.query.toLowerCase();
    const hay = `${skill.name} ${skill.description} ${skill.module} ${skill.origin}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function sortKey(skill) {
  switch (state.sort) {
    case 'cost': return { light: 0, medium: 1, heavy: 2 }[skill.cost] ?? 3;
    case 'module': return skill.module ?? 'zz';
    default: return skill.id;
  }
}

function render() {
  const list = state.data.skills.filter(matches);
  list.sort((a, b) => {
    const ka = sortKey(a), kb = sortKey(b);
    if (ka < kb) return -1;
    if (ka > kb) return 1;
    return a.id.localeCompare(b.id);
  });
  els.status.textContent = `${list.length} / ${state.data.skills.length} skills`;
  els.grid.innerHTML = list.map(cardHtml).join('') ||
    '<p class="status-line">nenhuma skill encontrada para o filtro.</p>';
}

function cardHtml(s) {
  const originTag = s.origin === 'autoral'
    ? '<span class="origin-tag">AUTORAL</span>'
    : '<span class="origin-tag ecc">ECC</span>';
  const cost = s.cost ? `<span class="badge-cost ${esc(s.cost)}">${esc(s.cost).toUpperCase()}</span>` : '';
  return `
  <article class="card origin-${esc(s.origin)}" data-id="${esc(s.id)}" tabindex="0">
    <div class="card-top">
      <span class="card-name">${esc(s.id)}</span>
      ${originTag}
    </div>
    <p class="card-desc">${esc((s.description || '').slice(0, 180))}</p>
    <div class="card-meta">
      ${cost}
      ${s.module ? `<span>${esc(s.module)}</span>` : ''}
      ${s.stability ? `<span>${esc(s.stability)}</span>` : ''}
    </div>
  </article>`;
}

function openDetail(id) {
  const s = state.data.skills.find(x => x.id === id);
  if (!s) return;
  const installCmd = `install.sh --skills ${s.id}`;
  const meta = [
    `ORIGEM: ${s.origin.toUpperCase()}`,
    s.module ? `MÓDULO: ${s.module}` : '',
    s.cost ? `CUSTO: ${s.cost}` : '',
    s.stability ? `ESTABILIDADE: ${s.stability}` : '',
    s.defaultInstall != null ? `INSTALAÇÃO PADRÃO: ${s.defaultInstall ? 'SIM' : 'NÃO'}` : '',
  ].filter(Boolean).join(' · ');
  els.detailContent.innerHTML = `
    <h1>${esc(s.id)}</h1>
    <p class="detail-meta">${esc(meta)}</p>
    <div class="install-cmd">
      <code>${esc(installCmd)}</code>
      <button class="copy-btn" data-copy="${esc(installCmd)}">COPIAR</button>
    </div>
    <a class="github-link" href="${esc(s.github)}" target="_blank" rel="noopener">ver no GitHub →</a>
    <div class="body">${marked.parse(s.body || '')}</div>
  `;
  els.detail.classList.add('open');
  els.detail.setAttribute('aria-hidden', 'false');
  els.backdrop.hidden = false;
  els.detail.scrollTop = 0;
}

function closeDetail() {
  els.detail.classList.remove('open');
  els.detail.setAttribute('aria-hidden', 'true');
  els.backdrop.hidden = true;
}

/* ---- three.js clima de fundo ---- */
let scene, camera, renderer, composer, particles, skillSprites = [];
let clock = new THREE.Clock();
const COLORS = { subtle: 0x00ff66, aggressive: 0xff2244 };

function initThree() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg3d'), alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  makeWave();
  makeSkillSprites();
  animate();
}

function makeWave() {
  const count = 700;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (i / count - 0.5) * 70;
    pos[i * 3 + 1] = 0;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: COLORS.subtle,
    size: 0.12,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  particles = new THREE.Points(geo, mat);
  particles.userData.base = pos;
  scene.add(particles);
}

const TECHNO_WORDS = [
  'buy it', 'use it', 'break it', 'fix it', 'trash it', 'change it', 'mail it',
  'upgrade it', 'charge it', 'point it', 'zoom it', 'press it', 'snap it', 'work it',
  'quick', 'erase it', 'write it', 'cut it', 'paste it', 'save it', 'load it', 'check it',
  'rewrite it', 'plug it', 'play it', 'burn it', 'rip it', 'drag it', 'drop it', 'lock it',
  'fill it', 'call it', 'find it', 'view it', 'code it', 'jam it', 'unlock it', 'surf it',
  'scroll it', 'pause it', 'click it', 'cross it', 'crack it', 'switch it', 'update it',
];

function makeSkillSprites() {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 48;
  const ctx = canvas.getContext('2d');
  TECHNO_WORDS.forEach((word, i) => {
    ctx.clearRect(0, 0, 256, 48);
    ctx.font = '24px JetBrains Mono, monospace';
    ctx.fillStyle = '#00ff66';
    ctx.fillText(word, 8, 32);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.5 });
    const sprite = new THREE.Sprite(mat);
    const n = TECHNO_WORDS.length;
    const a = (i / n) * Math.PI * 2;
    const r = 22;
    sprite.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 8, Math.sin(a) * r);
    sprite.scale.set(7, 1.3, 1);
    sprite.userData = { angle: a, radius: r, speed: 0.06 + Math.random() * 0.08 };
    scene.add(sprite);
    skillSprites.push(sprite);
  });
}

function setClima(mode) {
  state.clima = mode;
  document.body.setAttribute('data-clima', mode);
  const color = COLORS[mode];
  if (particles) particles.material.color.setHex(color);
  skillSprites.forEach(sp => { sp.material.opacity = mode === 'aggressive' ? 0.9 : 0.5; });
  const mt = mode === 'aggressive'
    ? { color: 0xff2244, intensity: 2.2 }
    : { color: 0x00ff66, intensity: 1.0 };
  document.body.style.setProperty('--glow-color', `#${mt.color.toString(16).padStart(6, '0')}`);
}

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const speed = state.clima === 'aggressive' ? 2.4 : 1;

  // osciloscópio: partículas em onda
  if (particles) {
    const pos = particles.geometry.attributes.position.array;
    const base = particles.userData.base;
    for (let i = 0; i < pos.length; i += 3) {
      const x = base[i];
      const y = Math.sin(x * 0.35 + t * (1.6 * speed)) * 1.6
        + Math.sin(x * 0.9 - t * 2.2 * speed) * 0.7
        + Math.sin(x * 0.15 + t * 0.8 * speed) * 2.4;
      pos[i + 1] = y;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y = Math.sin(t * 0.05 * speed) * 0.4;
    if (state.clima === 'aggressive') {
      particles.rotation.z = Math.sin(t * 1.4) * 0.1;
    }
  }

  skillSprites.forEach(sp => {
    sp.userData.angle += sp.userData.speed * 0.004 * speed;
    sp.position.x = Math.cos(sp.userData.angle) * sp.userData.radius;
    sp.position.z = Math.sin(sp.userData.angle) * sp.userData.radius;
    if (state.clima === 'aggressive') {
      sp.position.y += Math.sin(t * 3 + sp.userData.angle) * 0.01;
    }
  });

  // parallax do mouse
  const px = (mouseX / window.innerWidth - 0.5) * (state.clima === 'aggressive' ? 4 : 2);
  const py = (mouseY / window.innerHeight - 0.5) * (state.clima === 'aggressive' ? 3 : 1.5);
  camera.position.x += (px - camera.position.x) * 0.04;
  camera.position.y += (-py - camera.position.y) * 0.04;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
document.addEventListener('visibilitychange', () => {
  // three.js segue animando; pausa só o que for pesado: reduz em background
});

/* ---- música (DnB) ---- */
function showSection(name) {
  els.sectionNav.forEach(b => b.classList.toggle('active', b.dataset.sec === name));
  const isMusic = name === 'music';
  els.grid.hidden = isMusic;
  els.musicSection.hidden = !isMusic;
  document.querySelector('.controls').classList.toggle('hide', isMusic);
  return name;
}

async function loadMusic() {
  const res = await fetch('data/music.json');
  const tracks = await res.json();
  musicState.tracks = tracks;
  els.musicStatus.textContent = `${tracks.length} faixas · ${Math.round(tracks.reduce((a, t) => a + t.seconds, 0) / 60)} min`;
  renderMusic();
}

function fmtSec(s) {
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}

function renderMusic() {
  els.musicList.innerHTML = musicState.tracks.map(t => `
    <article class="track" data-file="${esc(t.file)}">
      <button class="track-play" data-play="${esc(t.file)}" title="Tocar"><span class="play-arrow"></span></button>
      <div class="track-info">
        <span class="track-title">${esc(t.title)}</span>
        <span class="track-dur">${esc(t.duration)}</span>
      </div>
      <audio data-src="assets/music/${esc(t.file)}" preload="none"></audio>
    </article>
  `).join('');
}

// delegado
els.musicList.addEventListener('click', e => {
  const btn = e.target.closest('.track-play');
  if (!btn) return;
  const row = btn.closest('.track');
  // toggle: se esta tocando (ou carregando), para
  if (row.classList.contains('playing') || row.classList.contains('loading')) {
    stopPlayback();
    return;
  }
  playFrom(row);
});

function stopPlayback() {
  const a = musicState.audio;
  if (a) { a.pause(); a.currentTime = 0; musicState.audio = null; }
  document.querySelectorAll('.track').forEach(r => r.classList.remove('playing', 'loading'));
  musicState.current = null;
}

function playFrom(row) {
  stopPlayback();
  row.classList.add('playing');
  const audio = row.querySelector('audio');
  if (!audio.src) audio.src = audio.dataset.src;
  row.classList.add('loading');
  audio.addEventListener('error', () => row.classList.remove('loading', 'playing'), { once: true });
  audio.play().then(() => row.classList.remove('loading')).catch(() => row.classList.remove('loading', 'playing'));
  audio.addEventListener('ended', () => { playNext(row); }, { once: true });
  audio.addEventListener('pause', () => { if (musicState.audio === audio && audio.ended !== true) row.classList.remove('playing'); });
  musicState.audio = audio;
  musicState.current = row;
}

function playNext(fromRow) {
  const rows = [...document.querySelectorAll('.track')];
  const idx = rows.indexOf(fromRow);
  const next = rows[idx + 1];
  if (next) {
    playFrom(next);
    next.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    document.querySelectorAll('.track').forEach(r => r.classList.remove('playing', 'loading'));
    musicState.audio = null;
    musicState.current = null;
  }
}

/* ---- eventos ---- */
els.search.addEventListener('input', () => {
  state.query = els.search.value;
  render();
});
els.chips.forEach(chip => chip.addEventListener('click', () => {
  els.chips.forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  state.filter = chip.dataset.filter;
  render();
}));
els.moduleFilter.addEventListener('change', () => { state.module = els.moduleFilter.value; render(); });
els.sort.addEventListener('change', () => { state.sort = els.sort.value; render(); });

els.grid.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (card) openDetail(card.dataset.id);
});
els.grid.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.classList.contains('card')) openDetail(e.target.dataset.id);
});
els.detailClose.addEventListener('click', closeDetail);
els.backdrop.addEventListener('click', closeDetail);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDetail();
  if (e.key === '/' && document.activeElement !== els.search) {
    e.preventDefault();
    els.search.focus();
  }
});
els.detailContent.addEventListener('click', e => {
  const btn = e.target.closest('.copy-btn');
  if (btn) {
    navigator.clipboard.writeText(btn.dataset.copy);
    btn.textContent = 'COPIADO ✓';
    setTimeout(() => { btn.textContent = 'COPIAR'; }, 1500);
  }
});

els.modeToggle.addEventListener('click', e => {
  const btn = e.target.closest('.mt-btn');
  if (!btn) return;
  els.modeToggle.querySelectorAll('.mt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  setClima(btn.dataset.mode);
});

els.sectionNav.forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.sec)));

els.themeBtn.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
});

/* ---- i18n: PT-BR base + tradução automática global ---- */
(function detectLocale() {
  const lang = (navigator.language || 'pt-BR').toLowerCase();
  if (lang.startsWith('pt')) return; // já em português
  const supported = { en: 'en', es: 'es', fr: 'fr', de: 'de', it: 'it', ja: 'ja' };
  const code = supported[lang.split('-')[0]];
  if (!code) return;
  const banner = document.createElement('div');
  banner.className = 'lang-banner';
  banner.innerHTML = `Este site está em PT-BR. <a href="#" id="gtr">Traduzir para ${code.toUpperCase()}</a> automáticamente.`;
  document.body.appendChild(banner);
  document.getElementById('gtr').addEventListener('click', e => {
    e.preventDefault();
    const url = `https://translate.google.com/translate?hl=${code}&sl=pt&tl=${code}&u=${encodeURIComponent(location.href)}`;
    window.open(url, '_blank');
  });
})();

/* ---- boot ---- */
Promise.all([load(), loadMusic()]).then(() => {
  initThree();
  setClima('subtle');
}).catch(err => {
  els.status.textContent = 'erro ao carregar catálogo: ' + err.message;
});

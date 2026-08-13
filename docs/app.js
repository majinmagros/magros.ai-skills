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
  animToggle: document.getElementById('animToggle'),
  themeBtn: document.getElementById('themeBtn'),
  sectionNav: [...document.querySelectorAll('.sec-btn')],
  nowPlaying: document.getElementById('nowPlaying'),
  npTitle: document.getElementById('npTitle'),
  npTitleDup: document.getElementById('npTitleDup'),
  npTime: document.getElementById('npTime'),
  guideBtn: document.getElementById('guideBtn'),
  guideIniBtn: document.getElementById('guideIniBtn'),
  guideOverlay: document.getElementById('guideOverlay'),
  guideBody: document.getElementById('guideBody'),
  guideClose: document.getElementById('guideClose'),
};

let musicState = { tracks: [], currentIndex: -1, audio: null, ytPlayer: null, ytReady: false };
let shuffledTracks = [];
let ytPlaylist = [];
let ytShuffledTracks = [];

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

async function openGuide(file = 'data/guia-9router.md') {
  els.guideOverlay.hidden = false;
  els.guideBody.innerHTML = 'carregando guia...';
  try {
    const res = await fetch(file);
    const md = await res.text();
    els.guideBody.innerHTML = marked.parse(md);
    document.body.style.overflow = 'hidden';
  } catch (err) {
    els.guideBody.innerHTML = 'erro ao carregar o guia: ' + esc(err.message);
  }
}

function closeGuide() {
  els.guideOverlay.hidden = true;
  document.body.style.overflow = '';
}

/* ---- three.js clima de fundo ---- */
let scene, camera, renderer, composer, particles, lyricSprites = [];
let clock = new THREE.Clock();
const COLORS = { subtle: 0x00ff66, aggressive: 0x00ff66 };
let animMode = 'A'; // A: frase central | B: anel de linhas | C: letreiro na onda
let wordRotationTimer = 0;
const WORD_ROTATION_INTERVAL = 6000;

function initThree() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg3d'), alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  makeWave();
  buildLyricAnim();
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

const TECHNO_LYRICS = [
  'Buy it, use it, break it, fix it',
  'Trash it, change it, mail, upgrade it',
  'Charge it, point it, zoom it, press it',
  'Snap it, work it, quick, erase it',
  'Write it, cut it, paste it, save it',
  'Load it, check it, quick, rewrite it',
  'Plug it, play it, burn it, rip it',
  'Drag and drop it, zip, unzip it',
  'Lock it, fill it, call it, find it',
  'View it, code it, jam, unlock it',
  'Surf it, scroll it, pause it, click it',
  'Cross it, crack it, switch, update it',
  'Name it, read it, tune it, print it',
  'Scan it, send it, fax, rename it',
  'Touch it, bring it, pay it, watch it',
  'Turn it, leave it, start, format it',
];

const TECHNO_PHRASES = [
  'Buy it', 'use it', 'break it', 'fix it',
  'Trash it', 'change it', 'mail', 'upgrade it',
  'Charge it', 'point it', 'zoom it', 'press it',
  'Snap it', 'work it', 'quick', 'erase it',
  'Write it', 'cut it', 'paste it', 'save it',
  'Load it', 'check it', 'rewrite it',
  'Plug it', 'play it', 'burn it', 'rip it',
  'Drag and drop it', 'zip', 'unzip it',
  'Lock it', 'fill it', 'call it', 'find it',
  'View it', 'code it', 'jam', 'unlock it',
  'Surf it', 'scroll it', 'pause it', 'click it',
  'Cross it', 'crack it', 'switch', 'update it',
  'Name it', 'read it', 'tune it', 'print it',
  'Scan it', 'send it', 'fax', 'rename it',
  'Touch it', 'bring it', 'pay it', 'watch it',
  'Turn it', 'leave it', 'start', 'format it',
];

function makeLyricTexture(line, w, h, fontSize) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.font = `${fontSize}px JetBrains Mono, monospace`;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.fillText(line, 16, h / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function disposeLyrics() {
  lyricSprites.forEach(sp => {
    scene.remove(sp);
    if (sp.material.map) sp.material.map.dispose();
    sp.material.dispose();
  });
  lyricSprites = [];
}

function buildLyricAnim() {
  disposeLyrics();
  if (animMode === 'A') buildLyricCentral();
  else if (animMode === 'B') buildLyricRing();
  else buildLyricTicker();
}

/* Modo A — frase central: 1 sprite grande, troca a linha a cada 4s */
function buildLyricCentral() {
  const mat = new THREE.SpriteMaterial({
    map: makeLyricTexture(TECHNO_LYRICS[0], 1400, 70, 42),
    transparent: true, opacity: 0.8,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.position.set(0, 0, 0);
  sprite.scale.set(34, 1.9, 1);
  sprite.userData = { lineIdx: 0 };
  scene.add(sprite);
  lyricSprites.push(sprite);
}

/* Modo B — anel de sprites, cada um com UMA frase do Technologic, alternando */
function buildLyricRing() {
  const n = 16;
  const step = Math.floor(TECHNO_PHRASES.length / n);
  for (let i = 0; i < n; i++) {
    const phraseIdx = (i * step) % TECHNO_PHRASES.length;
    const mat = new THREE.SpriteMaterial({
      map: makeLyricTexture(TECHNO_PHRASES[phraseIdx], 700, 56, 30),
      transparent: true, opacity: 0.6,
    });
    const sprite = new THREE.Sprite(mat);
    const a = (i / n) * Math.PI * 2;
    sprite.position.set(Math.cos(a) * 26, (Math.random() - 0.5) * 10, Math.sin(a) * 26);
    sprite.scale.set(14, 1.4, 1);
    sprite.userData = { lineIdx: phraseIdx, angle: a, radius: 26, speed: 0.05 + Math.random() * 0.05 };
    scene.add(sprite);
    lyricSprites.push(sprite);
  }
}

/* Modo C — letreiro: linhas passando ao longo do osciloscópio */
function buildLyricTicker() {
  const n = TECHNO_LYRICS.length;
  for (let i = 0; i < n; i++) {
    const mat = new THREE.SpriteMaterial({
      map: makeLyricTexture(TECHNO_LYRICS[i], 900, 48, 26),
      transparent: true, opacity: 0.35,
    });
    const sprite = new THREE.Sprite(mat);
    const x = (i / n - 0.5) * 40;
    sprite.position.set(x, 0, 1);
    sprite.scale.set(14, 1.2, 1);
    sprite.userData = { lineIdx: i, baseX: x, phase: i / n };
    scene.add(sprite);
    lyricSprites.push(sprite);
  }
}

function setClima(mode) {
  state.clima = mode;
  document.body.setAttribute('data-clima', mode);
  const color = COLORS[mode];
  if (particles) particles.material.color.setHex(color);
  lyricSprites.forEach(sp => { sp.material.color.setHex(color); });
  const mt = mode === 'aggressive'
    ? { color: 0x00ff66, intensity: 2.2 }
    : { color: 0x00ff66, intensity: 1.0 };
  document.body.style.setProperty('--glow-color', `#${mt.color.toString(16).padStart(6, '0')}`);
}

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const tMs = t * 1000;
  const speed = state.clima === 'aggressive' ? 4 : 1;

  // rotaciona frases do Technologic (A e B trocam texto; C desloca na onda)
  if (tMs - wordRotationTimer >= WORD_ROTATION_INTERVAL) {
    wordRotationTimer = tMs;
    if (animMode === 'A' || animMode === 'B') {
      lyricSprites.forEach(sprite => {
        const list = animMode === 'A' ? TECHNO_LYRICS : TECHNO_PHRASES;
        const w = animMode === 'A' ? 1400 : 700;
        const fs = animMode === 'A' ? 42 : 30;
        const next = (sprite.userData.lineIdx + 1) % list.length;
        sprite.userData.lineIdx = next;
        const oldMap = sprite.material.map;
        sprite.material.map = makeLyricTexture(list[next], w, 70, fs);
        sprite.material.needsUpdate = true;
        if (oldMap) oldMap.dispose();
      });
    }
  }

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

  lyricSprites.forEach(sp => {
    const u = sp.userData;
    if (animMode === 'A') {
      // central: pulso leve
      const pulse = 1 + Math.sin(t * 1.5) * 0.04;
      sp.scale.set(34 * pulse, 1.9 * pulse, 1);
      sp.material.opacity = 0.6 + Math.sin(t * 1.5) * 0.2;
    } else if (animMode === 'B') {
      // anel: orbita
      u.angle += u.speed * 0.004 * speed;
      sp.position.x = Math.cos(u.angle) * u.radius;
      sp.position.z = Math.sin(u.angle) * u.radius;
      if (state.clima === 'aggressive') {
        sp.position.y += Math.sin(t * 3 + u.angle) * 0.01;
      }
    } else {
      // letreiro: linhas deslizam da direita p/ esquerda sobre a onda
      const wrap = 55;
      const off = (u.phase + t * 0.02 * speed) % 1;
      const x = (off - 0.5) * wrap;
      sp.position.x = x;
      sp.position.y = Math.sin(x * 0.35 + t * 1.6) * 1.6
        + Math.sin(x * 0.9 - t * 2.2) * 0.7;
      // fade nas bordas (esquerda some, direita entra)
      const fadeIn = Math.min(1, (x + wrap / 2) / 8);
      const fadeOut = Math.min(1, (wrap / 2 - x) / 8);
      sp.material.opacity = 0.25 + Math.min(fadeIn, fadeOut) * 0.6;
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
  return name;
}

async function loadMusic() {
  const res = await fetch('data/music.json');
  musicState.tracks = await res.json();
  shuffledTracks = [...musicState.tracks];
  for (let i = shuffledTracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledTracks[i], shuffledTracks[j]] = [shuffledTracks[j], shuffledTracks[i]];
  }
  
  // Carregar playlist do YouTube
  try {
    const ytRes = await fetch('assets/playlist.json');
    const ytData = await ytRes.json();
    ytPlaylist = ytData.tracks || [];
    ytShuffledTracks = [...ytPlaylist];
    for (let i = ytShuffledTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ytShuffledTracks[i], ytShuffledTracks[j]] = [ytShuffledTracks[j], ytShuffledTracks[i]];
    }
  } catch (e) {
    console.warn('Não foi possível carregar playlist do YouTube:', e);
  }
}

function fmtSec(s) {
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}

// YouTube IFrame API ready callback
window.onYouTubeIframeAPIReady = function() {
  musicState.ytReady = true;
  console.log('YouTube IFrame API pronto');
};

function updateNowPlaying() {
  const np = els.nowPlaying;
  const audio = musicState.audio;
  const ytPlayer = musicState.ytPlayer;
  const track = shuffledTracks[musicState.currentIndex];
  const ytTrack = ytShuffledTracks[musicState.currentIndex];
  
  if (!np) return;
  
  // Se estiver tocando YouTube
  if (ytPlayer && ytTrack) {
    const playerState = ytPlayer.getPlayerState();
    if (playerState === -1 || playerState === 0 || playerState === 2 || playerState === 5) {
      // Não tocando (unstarted, ended, paused, cued)
      np.hidden = true;
      document.getElementById('musicBtn').classList.remove('global-playing');
      return;
    }
    np.hidden = false;
    els.npTitle.textContent = ytTrack.title;
    if (els.npTitleDup) els.npTitleDup.textContent = ytTrack.title;
    const currentTime = ytPlayer.getCurrentTime() || 0;
    els.npTime.textContent = `${fmtSec(currentTime)} / ${ytTrack.duration}`;
    document.getElementById('musicBtn').classList.add('global-playing');
    return;
  }
  
  // Se estiver tocando áudio local
  if (!audio || !track || audio.paused) {
    np.hidden = true;
    document.getElementById('musicBtn').classList.remove('global-playing');
    return;
  }
  np.hidden = false;
  els.npTitle.textContent = track.title;
  if (els.npTitleDup) els.npTitleDup.textContent = track.title;
  els.npTime.textContent = `${fmtSec(audio.currentTime || 0)} / ${track.duration}`;
  document.getElementById('musicBtn').classList.add('global-playing');
}

function stopPlayback() {
  // Parar YouTube
  if (musicState.ytPlayer) {
    try {
      musicState.ytPlayer.stopVideo();
      musicState.ytPlayer.destroy();
    } catch (e) {}
    musicState.ytPlayer = null;
  }
  
  // Parar áudio local
  const a = musicState.audio;
  if (a) { a.pause(); a.currentTime = 0; musicState.audio = null; }
  
  musicState.currentIndex = -1;
  updateNowPlaying();
}

function playIndex(i) {
  // Verificar se é YouTube ou local
  const ytTrack = ytShuffledTracks[i];
  const localTrack = shuffledTracks[i];
  
  // Se tem YouTube e a API está pronta, usar YouTube
  if (ytTrack && musicState.ytReady) {
    stopPlayback();
    musicState.currentIndex = i;
    
    // Criar player do YouTube
    musicState.ytPlayer = new YT.Player('yt-player-container', {
      height: '0',
      width: '0',
      videoId: ytTrack.id,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0
      },
      events: {
        onReady: function(event) {
          event.target.playVideo();
          updateNowPlaying();
        },
        onStateChange: function(event) {
          if (event.data === YT.PlayerState.ENDED) {
            playNext();
          } else if (event.data === YT.PlayerState.PAUSED) {
            updateNowPlaying();
          }
          updateNowPlaying();
        },
        onError: function() {
          console.error('Erro ao tocar vídeo do YouTube:', ytTrack.id);
          musicState.ytPlayer = null;
          musicState.currentIndex = -1;
          updateNowPlaying();
        }
      }
    });
    return;
  }
  
  // Fallback para áudio local
  const track = localTrack;
  if (!track) return;
  stopPlayback();
  musicState.currentIndex = i;
  const audio = new Audio(track.url || `assets/music/${track.file}`);
  musicState.audio = audio;
  audio.addEventListener('timeupdate', () => updateNowPlaying());
  audio.addEventListener('ended', () => playNext());
  audio.addEventListener('pause', () => { if (musicState.audio === audio && !audio.ended) updateNowPlaying(); });
  audio.play().catch(() => { musicState.audio = null; musicState.currentIndex = -1; updateNowPlaying(); });
}

function playNext() {
  const next = musicState.currentIndex + 1;
  const maxLen = Math.max(shuffledTracks.length, ytShuffledTracks.length);
  if (next < maxLen) {
    playIndex(next);
  } else {
    stopPlayback();
  }
}

function skipNext() {
  if (musicState.currentIndex >= 0) {
    playNext();
  } else if (shuffledTracks.length || ytShuffledTracks.length) {
    playIndex(0);
  }
}

function skipPrev() {
  if (musicState.currentIndex > 0) {
    playIndex(musicState.currentIndex - 1);
  } else if (shuffledTracks.length || ytShuffledTracks.length) {
    playIndex(0);
  }
}

// botão MÚSICA = play/pause global (1º clique inicia playlist; demais alternam pause/resume)
function toggleGlobalPlayback() {
  // Verificar YouTube primeiro
  if (musicState.ytPlayer) {
    const playerState = musicState.ytPlayer.getPlayerState();
    if (playerState === 1) {
      // Tocando - pausar
      musicState.ytPlayer.pauseVideo();
      updateNowPlaying();
      return;
    } else if (playerState === 2) {
      // Pausado - retomar
      musicState.ytPlayer.playVideo();
      updateNowPlaying();
      return;
    }
  }
  
  // Verificar áudio local
  const audio = musicState.audio;
  if (audio && !audio.paused) {
    audio.pause();
    updateNowPlaying();
    return;
  }
  if (audio && audio.paused && audio.currentTime > 0 && !audio.ended) {
    audio.play().then(updateNowPlaying);
    return;
  }
  
  // nada tocando: inicia em faixa aleatória (preferir YouTube se disponível)
  const maxLen = Math.max(shuffledTracks.length, ytShuffledTracks.length);
  if (!maxLen) return;
  playIndex(Math.floor(Math.random() * maxLen));
}

/* ---- eventos ---- */
document.getElementById('prevBtn').addEventListener('click', skipPrev);
document.getElementById('nextBtn').addEventListener('click', skipNext);

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
els.guideBtn.addEventListener('click', () => openGuide());
els.guideIniBtn.addEventListener('click', () => openGuide('data/guia-instalacao-iniciantes.md'));
els.guideClose.addEventListener('click', closeGuide);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!els.guideOverlay.hidden) { closeGuide(); return; }
    closeDetail();
  }
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

els.animToggle.addEventListener('click', e => {
  const btn = e.target.closest('.mt-btn');
  if (!btn) return;
  els.animToggle.querySelectorAll('.mt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  animMode = btn.dataset.anim;
  try { localStorage.setItem('animMode', animMode); } catch (_) {}
  buildLyricAnim();
  const color = COLORS[state.clima];
  lyricSprites.forEach(sp => sp.material.color.setHex(color));
});

els.sectionNav.forEach(btn => btn.addEventListener('click', () => {
  if (btn.dataset.sec === 'music') {
    toggleGlobalPlayback();
  } else {
    showSection(btn.dataset.sec);
  }
}));

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
function syncAnimModeUI() {
  const btn = els.animToggle.querySelector(`[data-anim="${animMode}"]`);
  if (btn) {
    els.animToggle.querySelectorAll('.mt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

(function initAnimMode() {
  const qs = new URLSearchParams(location.search).get('mode');
  if (qs && ['A', 'B', 'C'].includes(qs)) {
    animMode = qs;
  } else {
    try {
      const saved = localStorage.getItem('animMode');
      if (saved && ['A', 'B', 'C'].includes(saved)) animMode = saved;
    } catch (_) {}
  }
})();

Promise.all([load(), loadMusic()]).then(() => {
  syncAnimModeUI();
  initThree();
  setClima('subtle');
  
  // Atualizar nowPlaying periodicamente quando YouTube está tocando
  setInterval(() => {
    if (musicState.ytPlayer && musicState.ytPlayer.getPlayerState() === 1) {
      updateNowPlaying();
    }
  }, 1000);
}).catch(err => {
  els.status.textContent = 'erro ao carregar catálogo: ' + err.message;
});

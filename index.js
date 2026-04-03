document.addEventListener('DOMContentLoaded', () => {
  // Basic rendering
  document.getElementById('logo-text').innerHTML = CONFIG.name.replace('DEV', '<span>DEV</span>');
  document.getElementById('hero-title').innerHTML = `<span class="br">= </span>${CONFIG.name}<span class="br"> =</span>`;
  document.getElementById('hero-sub').textContent = CONFIG.subtitle;
  document.getElementById('about-body').textContent = CONFIG.subtitle;
  document.getElementById('footer-copy').textContent = `© ${new Date().getFullYear()} ${CONFIG.name} — Not affiliated with Mojang Studios.`;
  if (CONFIG.github) document.getElementById('footer-gh').href = CONFIG.github;

  // Stats
  const sr = document.getElementById('stats-row');
  CONFIG.stats.forEach(s => sr.insertAdjacentHTML('beforeend', `<div class="stat-item"><span class="stat-num">${s.num}</span><span class="stat-label">${s.label}</span></div>`));

  // Skills
  CONFIG.skills.forEach(sk => document.getElementById('skills-wrap').insertAdjacentHTML('beforeend', `<span class="skill-chip">${sk}</span>`));

  // Services
  CONFIG.services.forEach(s => document.getElementById('services-grid').insertAdjacentHTML('beforeend', `<div class="service-block"><span class="service-icon">${s.icon}</span><div class="service-name">${s.name}</div><p class="service-desc">${s.desc}</p></div>`));

  // Contact
  const cl = document.getElementById('contact-links');
  if (CONFIG.email) cl.insertAdjacentHTML('beforeend', `<a href="mailto:${CONFIG.email}" class="btn btn-green">✉ Email Me</a>`);
  if (CONFIG.github) cl.insertAdjacentHTML('beforeend', `<a href="${CONFIG.github}" target="_blank" class="btn btn-stone">⌨ GitHub</a>`);
  document.getElementById('discord-tag').textContent = CONFIG.discord;

  // Projects
  renderCards(CONFIG.projects, 'projects');

  // Selling
  renderCards(CONFIG.currentlySelling, 'selling');

  // Wire nav toggle
  document.getElementById('nav-toggle').addEventListener('click', () => document.getElementById('nav').classList.toggle('open'));

  // Init modals
  initProjectModal();
  initSellingModal();
  initHeroCanvas();

  // Reveal hidden elements (they start with class 'reveal')
  setTimeout(() => revealAll(), 80);
});

function revealAll() {
  const rev = Array.from(document.querySelectorAll('.reveal'));
  rev.forEach((el, i) => setTimeout(() => el.classList.add('in'), i * 40));
}

function renderCards(items, type) {
  const container = type === 'projects' ? document.getElementById('cards-grid') : document.getElementById('selling-grid');
  if (!items || !container) return;

  items.forEach((p, i) => {
    const tags = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    const links = (p.links || []).map(l => `<a class="card-btn" href="${l.url}" target="_blank" onclick="event.stopPropagation()">${l.label}</a>`).join('');
    const imgCount = (p.gallery || p.images || []).length;
    const hintText = imgCount > 0 ? `${imgCount} IMAGE${imgCount !== 1 ? 'S' : ''}` : (type === 'projects' ? 'CLICK TO VIEW' : 'NO IMAGES');

    const el = document.createElement('div');
    el.className = 'card reveal';
    el.style.transitionDelay = `${i * .06}s`;
    el.innerHTML = `
      <div class="card-accent" style="background:${p.color || '#666'}"></div>
      <div class="card-inner">
        <div class="card-icon-row">
          <span class="card-emoji">${p.icon || '📦'}</span>
          ${p.status ? `<span class="status-pill ${p.status === 'wip'? 'pill-wip': p.status === 'active'? 'pill-active':'pill-archived'}">${p.status}</span>` : ''}
        </div>
        <div class="card-title">${p.title}</div>
        <p class="card-desc">${type === 'selling' ? (p.price ? `<strong>${p.price}</strong> — ` : '') + (p.short || '') : (p.desc || '')}</p>
        <div class="card-tags">${tags}</div>
        ${links ? `<div class="card-links">${links}</div>` : ''}
        <div class="card-gallery-hint"><div class="gallery-hint-dot"></div>${hintText}</div>
      </div>`;

    el.addEventListener('click', () => {
      if (type === 'projects') openGallery(i);
      else openSelling(i);
    });

    container.appendChild(el);
  });
}

/* --------------------- Projects modal --------------------- */
function initProjectModal() {
  const modal = document.getElementById('gallery-modal');
  const mainImg = document.getElementById('gm-main-img');
  const placeholder = document.getElementById('gm-placeholder');
  const captionEl = document.getElementById('gm-caption');
  const captionBar = document.getElementById('gm-caption-bar');
  const counterEl = document.getElementById('gm-counter');
  const thumbsEl = document.getElementById('gm-thumbs');
  const prevBtn = document.getElementById('gm-prev');
  const nextBtn = document.getElementById('gm-next');

  let currentProject = null, currentIndex = 0;

  window.openGallery = function (projectIdx) {
    currentProject = CONFIG.projects[projectIdx];
    currentIndex = 0;
    document.getElementById('gm-project-name').textContent = currentProject.title;
    document.getElementById('gm-accent-dot').style.background = currentProject.color || '#666';
    document.getElementById('gm-info-desc').textContent = currentProject.desc || '';

    const linksEl = document.getElementById('gm-info-links'); linksEl.innerHTML = '';
    (currentProject.links || []).forEach(l => {
      const a = document.createElement('a'); a.href = l.url; a.target = '_blank'; a.className = 'card-btn'; a.textContent = l.label; linksEl.appendChild(a);
    });
    document.getElementById('gm-tags').innerHTML = (currentProject.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    document.getElementById('gm-ph-icon').textContent = currentProject.icon || '📷';

    const gallery = currentProject.gallery || [];
    if (gallery.length > 0) {
      placeholder.style.display = 'none'; mainImg.style.display = 'block'; captionBar.style.display = 'flex'; prevBtn.style.display = 'flex'; nextBtn.style.display = 'flex'; thumbsEl.style.display = 'flex';
      buildThumbs(gallery, thumbsEl, mainImg, counterEl);
      showImage(0);
    } else {
      placeholder.style.display = 'flex'; mainImg.style.display = 'none'; captionBar.style.display = 'none'; thumbsEl.style.display = 'none'; prevBtn.style.display = 'none'; nextBtn.style.display = 'none';
    }

    modal.classList.add('open'); document.body.style.overflow = 'hidden';

    function buildThumbs(gallery, thumbsElLocal) {
      thumbsElLocal.innerHTML = '';
      gallery.forEach((img, i) => {
        const d = document.createElement('div'); d.className = 'gm-thumb' + (i === 0 ? ' active' : ''); d.dataset.idx = i;
        d.innerHTML = `<img src="${img.url}" alt="${img.caption || ''}" loading="lazy">`;
        d.addEventListener('click', () => showImage(i)); thumbsElLocal.appendChild(d);
      });
    }

    function showImage(idx) {
      const gallery = currentProject.gallery || [];
      if (!gallery.length) return;
      idx = Math.max(0, Math.min(idx, gallery.length - 1)); currentIndex = idx;
      mainImg.classList.add('switching'); setTimeout(() => { mainImg.src = gallery[idx].url; mainImg.alt = gallery[idx].caption || ''; mainImg.classList.remove('switching'); }, 180);
      captionEl.textContent = gallery[idx].caption || '';
      counterEl.textContent = `${idx + 1} / ${gallery.length}`;
      document.querySelectorAll('.gm-thumb').forEach(t => t.classList.toggle('active', parseInt(t.dataset.idx) === idx));
      prevBtn.disabled = idx === 0; nextBtn.disabled = idx === gallery.length - 1;
      const active = thumbsEl.querySelector('.gm-thumb.active'); if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    }

    prevBtn.onclick = () => showImage(currentIndex - 1);
    nextBtn.onclick = () => showImage(currentIndex + 1);

    document.getElementById('gm-close').onclick = closeGallery;
    document.getElementById('gm-backdrop').onclick = closeGallery;

    document.addEventListener('keydown', projectKeydown);

    function projectKeydown(e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    }

    function closeGallery() {
      modal.classList.remove('open'); document.body.style.overflow = ''; document.removeEventListener('keydown', projectKeydown);
    }
  };
}

/* --------------------- Selling modal (markdown) --------------------- */
function initSellingModal() {
  const modal = document.getElementById('selling-modal');
  const mainImg = document.getElementById('sm-main-img');
  const placeholder = document.getElementById('sm-placeholder');
  const captionEl = document.getElementById('sm-caption');
  const captionBar = document.getElementById('sm-caption-bar');
  const counterEl = document.getElementById('sm-counter');
  const thumbsEl = document.getElementById('sm-thumbs');
  const prevBtn = document.getElementById('sm-prev');
  const nextBtn = document.getElementById('sm-next');
  const descEl = document.getElementById('sm-desc');
  const linksEl = document.getElementById('sm-links');
  let currentItem = null, currentIndex = 0, expanded = false;

  window.openSelling = function (idx) {
    currentItem = CONFIG.currentlySelling[idx];
    currentIndex = 0; expanded = false;
    document.getElementById('sm-title').textContent = currentItem.title;
    document.getElementById('sm-accent-dot').style.background = currentItem.color || '#666';

    linksEl.innerHTML = '';
    (currentItem.links || []).forEach(l => { const a = document.createElement('a'); a.href = l.url; a.target = '_blank'; a.className = 'card-btn'; a.textContent = l.label; linksEl.appendChild(a); });

    document.getElementById('sm-ph-icon').textContent = currentItem.icon || '📦';

    const gallery = currentItem.images || [];
    if (gallery.length > 0) {
      placeholder.style.display = 'none'; mainImg.style.display = 'block'; captionBar.style.display = 'flex'; prevBtn.style.display = 'flex'; nextBtn.style.display = 'flex'; thumbsEl.style.display = 'flex';
      buildThumbs(gallery, thumbsEl);
      showImage(0);
    } else {
      placeholder.style.display = 'flex'; mainImg.style.display = 'none'; captionBar.style.display = 'none'; thumbsEl.style.display = 'none'; prevBtn.style.display = 'none'; nextBtn.style.display = 'none';
    }

    // Render markdown (truncated)
    renderMarkdownTruncated(currentItem.md || '');

    modal.classList.add('open'); document.body.style.overflow = 'hidden';

    prevBtn.onclick = () => showImage(currentIndex - 1);
    nextBtn.onclick = () => showImage(currentIndex + 1);
    document.getElementById('sm-close').onclick = closeSelling;
    document.getElementById('sm-backdrop').onclick = closeSelling;
    document.addEventListener('keydown', sellingKeydown);

    function buildThumbs(gallery, thumbsElLocal) {
      thumbsElLocal.innerHTML = '';
      gallery.forEach((img, i) => {
        const d = document.createElement('div'); d.className = 'gm-thumb' + (i === 0 ? ' active' : ''); d.dataset.idx = i;
        d.innerHTML = `<img src="${img.url}" alt="${img.caption || ''}" loading="lazy">`;
        d.addEventListener('click', () => showImage(i)); thumbsElLocal.appendChild(d);
      });
    }

    function showImage(idx) {
      const gallery = currentItem.images || [];
      if (!gallery.length) return;
      idx = Math.max(0, Math.min(idx, gallery.length - 1)); currentIndex = idx;
      mainImg.classList.add('switching'); setTimeout(() => { mainImg.src = gallery[idx].url; mainImg.alt = gallery[idx].caption || ''; mainImg.classList.remove('switching'); }, 180);
      captionEl.textContent = gallery[idx].caption || '';
      counterEl.textContent = `${idx + 1} / ${gallery.length}`;
      document.querySelectorAll('#sm-thumbs .gm-thumb').forEach(t => t.classList.toggle('active', parseInt(t.dataset.idx) === idx));
      prevBtn.disabled = idx === 0; nextBtn.disabled = idx === gallery.length - 1;
      const active = thumbsEl.querySelector('.gm-thumb.active'); if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    }

    function sellingKeydown(e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeSelling();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    }

    function closeSelling() { modal.classList.remove('open'); document.body.style.overflow = ''; document.removeEventListener('keydown', sellingKeydown); }

    // clicking desc toggles full md
    descEl.onclick = () => {
      expanded = !expanded; renderMarkdownTruncated(currentItem.md || '', expanded);
    };

    function renderMarkdownTruncated(md, forceFull = false) {
      if (!forceFull && md.length > 200) {
        const raw = md.slice(0, 200).replace(/\s+$/, '') + '...';
        descEl.innerHTML = marked.parse(raw);
        const more = document.createElement('div'); more.style.marginTop = '10px'; more.innerHTML = '<a class="card-btn" style="font-size:10px;padding:6px 10px;">Read more</a>';
        more.querySelector('a').addEventListener('click', (e) => { e.stopPropagation(); expanded = true; renderMarkdownTruncated(md, true); });
        descEl.appendChild(more);
      } else {
        descEl.innerHTML = marked.parse(md || '*No description provided.*');
      }
    }
  };
}

/* --------------------- Tiny hero canvas (keeps original behavior) --------------------- */
function initHeroCanvas() {
  try {
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, raf, t = 0;
    function mlb32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let x = Math.imul(a ^ a >>> 15, 1 | a); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296 } }
    const rng = mlb32(42), COLS = 30, hs = [];
    let h = .45;
    for (let i = 0; i < COLS; i++) { h += (rng() - .5) * .11; h = Math.max(.28, Math.min(.62, h)); hs.push(h) }
    const trng = mlb32(77), trees = new Set();
    for (let i = 1; i < COLS - 1; i++) if (trng() > .72) trees.add(i);
    const crng = mlb32(13), clouds = [];
    for (let i = 0; i < 6; i++) clouds.push({ x: crng() * 1.3 - .15, y: crng() * .22 + .04, w: crng() * .14 + .07, spd: crng() * .000035 + .000018 });
    const c = (r, g, b) => `rgb(${r},${g},${b})`;
    const SKY0 = [18,26,55], SKY1 = [70,148,210];
    const GR = [77,155,58], GRD = [47,95,35];
    const DT = [130,92,62], STO = [95,95,105];
    const WD = [105,78,46], LA = [48,108,33], LB = [34,85,22];
    const CLO = [215,215,225];

    function draw() {
      t++; W = canvas.width; H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const grd = ctx.createLinearGradient(0, 0, 0, H * .8);
      grd.addColorStop(0, c(...SKY0)); grd.addColorStop(1, c(...SKY1));
      ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
      const sr2 = mlb32(5);
      for (let i = 0; i < 50; i++) {
        const sx = sr2() * W, sy = sr2() * H * .32;
        ctx.globalAlpha = (Math.sin(t * .025 + i) * .5 + .5) * .55;
        ctx.fillStyle = '#fff'; ctx.fillRect(sx | 0, sy | 0, 2, 2);
      }
      ctx.globalAlpha = 1;
      clouds.forEach(cl => {
        cl.x = (cl.x + cl.spd) % 1.35;
        const cx = cl.x * W, cy = cl.y * H, cw = cl.w * W, ch = Math.max(14, W * .016);
        ctx.fillStyle = c(...CLO);
        ctx.fillRect((cx - ch * .5) | 0, cy | 0, (cw + ch) | 0, ch | 0);
        ctx.fillRect(cx | 0, (cy - ch) | 0, cw | 0, ch | 0);
        ctx.fillRect((cx + ch) | 0, (cy - ch * .55) | 0, (cw * .45) | 0, (ch * .8) | 0);
      });
      const BLK = Math.max(14, (W / COLS) | 0);
      for (let col = 0; col < COLS; col++) {
        const x = col * BLK, top = (hs[col] * H) | 0;
        ctx.fillStyle = c(...(col % 2 ? GR : GRD)); ctx.fillRect(x, top, BLK, BLK);
        for (let r = 1; r <= 4; r++) { ctx.fillStyle = c(...(r % 2 ? DT : [DT[0]-10,DT[1]-7,DT[2]-4])); ctx.fillRect(x, top + r * BLK, BLK, BLK) }
        for (let r = 5; r <= 14; r++) { ctx.fillStyle = c(...(r % 2 ? STO : [STO[0]-14,STO[1]-14,STO[2]-12])); ctx.fillRect(x, top + r * BLK, BLK, BLK) }
        ctx.fillStyle = '#0d0d0f'; ctx.fillRect(x, top + 15 * BLK, BLK, H);
        if (trees.has(col)) {
          const tw = BLK * .8, tx = x + BLK * .1, ty = top - BLK * 5;
          ctx.fillStyle = c(...WD); ctx.fillRect((tx + tw * .3) | 0, (top - BLK * 3.8) | 0, (tw * .4) | 0, (BLK * 3.8) | 0);
          ctx.fillStyle = c(...LA); ctx.fillRect(tx | 0, (ty + BLK) | 0, tw | 0, BLK * 4 | 0);
          ctx.fillStyle = c(...LB); ctx.fillRect((tx + tw * .12) | 0, ty | 0, (tw * .76) | 0, BLK * 2.2 | 0);
          ctx.fillRect((tx + tw * .04) | 0, (ty + BLK) | 0, (tw * .92) | 0, BLK * 3 | 0);
        }
      }
      raf = requestAnimationFrame(draw);
    }

    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); draw(); window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); draw() });
  } catch (e) { /* ignore */ }
}

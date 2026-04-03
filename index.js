document.addEventListener("DOMContentLoaded", () => {
  // Basic rendering
  document.getElementById("logo-text").innerHTML = CONFIG.name.replace(
    "DEV",
    "<span>DEV</span>",
  );
  document.getElementById("hero-title").innerHTML =
    `<span class="br">= </span>${CONFIG.name}<span class="br"> =</span>`;
  document.getElementById("hero-sub").textContent = CONFIG.subtitle;
  document.getElementById("about-body").textContent = CONFIG.subtitle;
  document.getElementById("footer-copy").textContent =
    `© ${new Date().getFullYear()} ${CONFIG.name} — Not affiliated with Mojang Studios.`;
  if (CONFIG.github) document.getElementById("footer-gh").href = CONFIG.github;

  // Stats
  const sr = document.getElementById("stats-row");
  CONFIG.stats.forEach((s) =>
    sr.insertAdjacentHTML(
      "beforeend",
      `<div class="stat-item"><span class="stat-num">${s.num}</span><span class="stat-label">${s.label}</span></div>`,
    ),
  );

  // Skills
  CONFIG.skills.forEach((sk) =>
    document
      .getElementById("skills-wrap")
      .insertAdjacentHTML("beforeend", `<span class="skill-chip">${sk}</span>`),
  );

  // Services
  CONFIG.services.forEach((s) =>
    document
      .getElementById("services-grid")
      .insertAdjacentHTML(
        "beforeend",
        `<div class="service-block"><span class="service-icon">${s.icon}</span><div class="service-name">${s.name}</div><p class="service-desc">${s.desc}</p></div>`,
      ),
  );

  // Contact
  const cl = document.getElementById("contact-links");
  if (CONFIG.email)
    cl.insertAdjacentHTML(
      "beforeend",
      `<a href="mailto:${CONFIG.email}" class="btn btn-green">✉ Email Me</a>`,
    );
  if (CONFIG.github)
    cl.insertAdjacentHTML(
      "beforeend",
      `<a href="${CONFIG.github}" target="_blank" class="btn btn-stone">⌨ GitHub</a>`,
    );
  document.getElementById("discord-tag").textContent = CONFIG.discord;

  // Projects
  renderCards(CONFIG.projects, "projects");

  // Selling
  renderCards(CONFIG.currentlySelling, "selling");

  // Wire nav toggle
  document
    .getElementById("nav-toggle")
    .addEventListener("click", () =>
      document.getElementById("nav").classList.toggle("open"),
    );

  // Init modals
  initProjectModal();
  initSellingModal();
  initHeroCanvas();

  // Reveal hidden elements (they start with class 'reveal')
  setTimeout(() => revealAll(), 80);
});

function revealAll() {
  const rev = Array.from(document.querySelectorAll(".reveal"));
  rev.forEach((el, i) => setTimeout(() => el.classList.add("in"), i * 40));
}

function normalizeIndent(md) {
  if (!md) return md;
  const lines = md.split("\n");
  // remove leading/trailing blank lines
  while (lines.length && lines[0].trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
  // find minimum indentation among non-empty lines that start with whitespace
  const indents = [];
  lines.forEach((l) => {
    const m = l.match(/^\s+/);
    if (m && l.trim() !== "") indents.push(m[0].length);
  });
  if (indents.length === 0) return lines.join("\n");
  const minIndent = Math.min(...indents);
  // remove up to `minIndent` leading whitespace characters (spaces or tabs) from each line
  const rg = new RegExp("^\\s{0," + minIndent + "}");
  const out = lines.map((l) => l.replace(rg, "")).join("\n");
  return out;
}

// Load markdown content which may be an inline string or a path to a .md file (relative or remote)
async function fetchMarkdown(mdField) {
  if (!mdField) return { text: "", tried: [] };
  if (typeof mdField !== "string") return { text: String(mdField), tried: [] };
  const trimmed = mdField.trim();
  const looksLikePath =
    /^\.\.?\/?[\w\-./]+\.md$/i.test(trimmed) ||
    /^https?:\/\/.+\.md$/i.test(trimmed);
  if (!looksLikePath || trimmed.includes("\n"))
    return { text: mdField, tried: [] };
  const tried = [];
  const origin =
    typeof window !== "undefined" && window.location && window.location.origin
      ? window.location.origin.replace(/\/$/, "")
      : "";
  const candidates = [];
  // prefer origin-based absolute path first when available
  if (origin) candidates.push(origin + "/" + trimmed.replace(/^\/+/, ""));
  candidates.push(trimmed);
  if (!trimmed.startsWith("./") && !trimmed.startsWith("/")) {
    candidates.push("./" + trimmed);
    candidates.push("/" + trimmed);
    if (origin) candidates.push(origin + "/" + trimmed);
  } else if (trimmed.startsWith("/")) {
    if (origin) candidates.push(origin + trimmed);
  }

  for (const c of candidates) {
    try {
      tried.push(c);
      console.debug("fetchMarkdown trying", c);
      const res = await fetch(c, { cache: "no-store" });
      if (res && res.ok) {
        const txt = await res.text();
        return { text: txt, tried };
      } else {
        console.debug("fetchMarkdown non-ok", c, res && res.status);
      }
    } catch (inner) {
      console.debug(
        "fetchMarkdown candidate failed",
        c,
        inner && inner.message,
      );
    }
  }
  console.warn("fetchMarkdown: all attempts failed for", trimmed, tried);
  return { text: "", tried };
}

function resolveImagePath(u) {
  if (!u) return "";
  if (/^(https?:|data:|\/\/)/i.test(u)) return u;
  return u;
}

function renderCards(items, type) {
  const container =
    type === "projects"
      ? document.getElementById("cards-grid")
      : document.getElementById("selling-grid");
  if (!items || !container) return;

  items.forEach((p, i) => {
    const tags = (p.tags || [])
      .map((t) => `<span class="tag">${t}</span>`)
      .join("");
    const links = (p.links || [])
      .map(
        (l) =>
          `<a class="card-btn" href="${l.url}" target="_blank" onclick="event.stopPropagation()">${l.label}</a>`,
      )
      .join("");
    const imgCount = (p.gallery || p.images || []).length;
    const hintText =
      imgCount > 0
        ? `${imgCount} IMAGE${imgCount !== 1 ? "S" : ""}`
        : type === "projects"
          ? "CLICK TO VIEW"
          : "NO IMAGES";

    const coverSrc =
      type === "selling"
        ? resolveImagePath(
            p.cover || (p.images && p.images[0] && p.images[0].url) || "",
          )
        : "";
    const coverHtml = coverSrc
      ? `<div class="card-cover" style="background-image:url('${coverSrc}');background-size:cover;background-position:center;height:110px;border-radius:6px;margin-bottom:8px"></div>`
      : "";

    const el = document.createElement("div");
    el.className = "card reveal";
    el.style.transitionDelay = `${i * 0.06}s`;
    el.innerHTML = `
      <div class="card-accent" style="background:${p.color || "#666"}"></div>
      <div class="card-inner">
        ${coverHtml}
        <div class="card-icon-row">
          <span class="card-emoji">${p.icon || "📦"}</span>
          ${p.status ? `<span class="status-pill ${p.status === "wip" ? "pill-wip" : p.status === "active" ? "pill-active" : "pill-archived"}">${p.status}</span>` : ""}
        </div>
        <div class="card-title">${p.title}</div>
        <p class="card-desc">${type === "selling" ? (p.price ? `<strong>${p.price}</strong> — ` : "") + (p.short || "") : p.desc || ""}</p>
        <div class="card-tags">${tags}</div>
        ${links ? `<div class="card-links">${links}</div>` : ""}
        <div class="card-gallery-hint"><div class="gallery-hint-dot"></div>${hintText}</div>
      </div>`;

    el.addEventListener("click", () => {
      if (type === "projects") openGallery(i);
      else openSelling(i);
    });

    container.appendChild(el);
  });
}

/* --------------------- Projects modal --------------------- */
function initProjectModal() {
  const modal = document.getElementById("gallery-modal");
  const mainImg = document.getElementById("gm-main-img");
  // fallback to local placeholder if image fails to load
  mainImg.addEventListener("error", () => {
    mainImg.src = "images/placeholder.svg";
  });
  const placeholder = document.getElementById("gm-placeholder");
  const captionEl = document.getElementById("gm-caption");
  const captionBar = document.getElementById("gm-caption-bar");
  const counterEl = document.getElementById("gm-counter");
  const thumbsEl = document.getElementById("gm-thumbs");
  const prevBtn = document.getElementById("gm-prev");
  const nextBtn = document.getElementById("gm-next");

  let currentProject = null,
    currentIndex = 0;

  window.openGallery = function (projectIdx) {
    currentProject = CONFIG.projects[projectIdx];
    currentIndex = 0;
    document.getElementById("gm-project-name").textContent =
      currentProject.title;
    document.getElementById("gm-accent-dot").style.background =
      currentProject.color || "#666";
    document.getElementById("gm-info-desc").textContent =
      currentProject.desc || "";

    const linksEl = document.getElementById("gm-info-links");
    linksEl.innerHTML = "";
    (currentProject.links || []).forEach((l) => {
      const a = document.createElement("a");
      a.href = l.url;
      a.target = "_blank";
      a.className = "card-btn";
      a.textContent = l.label;
      linksEl.appendChild(a);
    });
    document.getElementById("gm-tags").innerHTML = (currentProject.tags || [])
      .map((t) => `<span class="tag">${t}</span>`)
      .join("");
    document.getElementById("gm-ph-icon").textContent =
      currentProject.icon || "📷";

    const gallery = currentProject.gallery || [];
    if (gallery.length > 0) {
      placeholder.style.display = "none";
      mainImg.style.display = "block";
      captionBar.style.display = "flex";
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";
      thumbsEl.style.display = "flex";
      buildThumbs(gallery, thumbsEl, mainImg, counterEl);
      showImage(0);
    } else {
      placeholder.style.display = "flex";
      mainImg.style.display = "none";
      captionBar.style.display = "none";
      thumbsEl.style.display = "none";
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    function resolveImagePath(u) {
      if (!u) return "";
      // treat as absolute if it contains a scheme (http:, data:, //)
      if (/^(https?:|data:|\/\/)/i.test(u)) return u;
      // relative paths (images/foo.png or ./images/foo.png) work as-is
      return u;
    }

    function buildThumbs(gallery, thumbsElLocal) {
      thumbsElLocal.innerHTML = "";
      gallery.forEach((img, i) => {
        const d = document.createElement("div");
        d.className = "gm-thumb" + (i === 0 ? " active" : "");
        d.dataset.idx = i;
        const src = resolveImagePath(img.url);
        d.innerHTML = `<img src="${src}" alt="${img.caption || ""}" loading="lazy">`;
        const imageEl = d.querySelector("img");
        imageEl.addEventListener("error", () => {
          d.innerHTML = '<div class="gm-thumb-placeholder">📷</div>';
        });
        d.addEventListener("click", () => showImage(i));
        thumbsElLocal.appendChild(d);
      });
    }

    function showImage(idx) {
      const gallery = currentProject.gallery || [];
      if (!gallery.length) return;
      idx = Math.max(0, Math.min(idx, gallery.length - 1));
      currentIndex = idx;
      mainImg.classList.add("switching");
      setTimeout(() => {
        mainImg.src = resolveImagePath(gallery[idx].url);
        mainImg.alt = gallery[idx].caption || "";
        mainImg.classList.remove("switching");
      }, 180);
      captionEl.textContent = gallery[idx].caption || "";
      counterEl.textContent = `${idx + 1} / ${gallery.length}`;
      document
        .querySelectorAll(".gm-thumb")
        .forEach((t) =>
          t.classList.toggle("active", parseInt(t.dataset.idx) === idx),
        );
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === gallery.length - 1;
      const active = thumbsEl.querySelector(".gm-thumb.active");
      if (active)
        active.scrollIntoView({
          behavior: "smooth",
          inline: "nearest",
          block: "nearest",
        });
    }

    prevBtn.onclick = () => showImage(currentIndex - 1);
    nextBtn.onclick = () => showImage(currentIndex + 1);

    document.getElementById("gm-close").onclick = closeGallery;
    document.getElementById("gm-backdrop").onclick = closeGallery;

    document.addEventListener("keydown", projectKeydown);

    function projectKeydown(e) {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
    }

    function closeGallery() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", projectKeydown);
    }
  };
}

/* --------------------- Selling modal (markdown) --------------------- */
function initSellingModal() {
  const modal = document.getElementById("selling-modal");
  const mainImg = document.getElementById("sm-main-img");
  // fallback to local placeholder if image fails to load
  mainImg.addEventListener("error", () => {
    mainImg.src = "images/placeholder.svg";
  });
  const placeholder = document.getElementById("sm-placeholder");
  const captionEl = document.getElementById("sm-caption");
  const captionBar = document.getElementById("sm-caption-bar");
  const counterEl = document.getElementById("sm-counter");
  const thumbsEl = document.getElementById("sm-thumbs");
  const prevBtn = document.getElementById("sm-prev");
  const nextBtn = document.getElementById("sm-next");
  const descEl = document.getElementById("sm-desc");
  const linksEl = document.getElementById("sm-links");
  let currentItem = null,
    currentIndex = 0,
    expanded = false;
  // no custom scrollbar — use native modal scrollbar

  window.openSelling = function (idx) {
    currentItem = CONFIG.currentlySelling[idx];
    currentIndex = 0;
    expanded = false;
    document.getElementById("sm-title").textContent = currentItem.title;
    document.getElementById("sm-accent-dot").style.background =
      currentItem.color || "#666";

    linksEl.innerHTML = "";
    (currentItem.links || []).forEach((l) => {
      const a = document.createElement("a");
      a.href = l.url;
      a.target = "_blank";
      a.className = "card-btn";
      a.textContent = l.label;
      linksEl.appendChild(a);
    });

    document.getElementById("sm-ph-icon").textContent =
      currentItem.icon || "📦";

    const gallery = currentItem.images || [];
    if (gallery.length > 0) {
      placeholder.style.display = "none";
      mainImg.style.display = "block";
      captionBar.style.display = "flex";
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";
      thumbsEl.style.display = "flex";
      function resolveImagePath(u) {
        if (!u) return "";
        if (/^(https?:|data:|\/\/)/i.test(u)) return u;
        return u;
      }

      function buildThumbs(gallery, thumbsElLocal) {
        thumbsElLocal.innerHTML = "";
        gallery.forEach((img, i) => {
          const d = document.createElement("div");
          d.className = "gm-thumb" + (i === 0 ? " active" : "");
          d.dataset.idx = i;
          const src = resolveImagePath(img.url);
          d.innerHTML = `<img src="${src}" alt="${img.caption || ""}" loading="lazy">`;
          const imageEl = d.querySelector("img");
          imageEl.addEventListener("error", () => {
            d.innerHTML = '<div class="gm-thumb-placeholder">📷</div>';
          });
          d.addEventListener("click", () => showImage(i));
          thumbsElLocal.appendChild(d);
        });
      }

      buildThumbs(gallery, thumbsEl);
      showImage(0);
    } else {
      placeholder.style.display = "flex";
      mainImg.style.display = "none";
      captionBar.style.display = "none";
      thumbsEl.style.display = "none";
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    }

    // Render markdown (truncated). Support `md` as inline content or a path to a .md file.
    let loadedMd = "";
    const rawMdField = (currentItem.md || "").toString();
    descEl.style.cursor = "pointer";
    // If md is a path we previously attempted fetch; but user requested no fetch requirement.
    // Support both inline md and path: if the field looks like a path but was inlined, use it directly.
    (async () => {
      let mdText = "";
      try {
        const res = await fetchMarkdown(rawMdField);
        mdText = res && res.text ? res.text : "";
      } catch (e) {
        mdText = "";
      }
      // if fetchMarkdown returned empty but rawMdField is not a path (contains newlines), use the raw field
      if (!mdText && rawMdField.includes("\n")) mdText = rawMdField;
      // normalize indentation to avoid code-block rendering
      mdText = normalizeIndent(mdText || rawMdField || "");
      loadedMd = mdText || "";
      // if still empty and the field looked like a path, show helpful message
      if (!loadedMd && /\.md$/i.test(rawMdField)) {
        const esc = (s) =>
          String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        descEl.innerHTML = `<div class="gm-placeholder-sub">Description unavailable — failed to load <strong>${esc(rawMdField)}</strong>.</div>`;
      } else {
        renderMarkdownTruncated(loadedMd);
      }
    })();

    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    prevBtn.onclick = () => showImage(currentIndex - 1);
    nextBtn.onclick = () => showImage(currentIndex + 1);
    document.getElementById("sm-close").onclick = closeSelling;
    document.getElementById("sm-backdrop").onclick = closeSelling;
    document.addEventListener("keydown", sellingKeydown);

    function buildThumbs(gallery, thumbsElLocal) {
      thumbsElLocal.innerHTML = "";
      gallery.forEach((img, i) => {
        const d = document.createElement("div");
        d.className = "gm-thumb" + (i === 0 ? " active" : "");
        d.dataset.idx = i;
        d.innerHTML = `<img src="${img.url}" alt="${img.caption || ""}" loading="lazy">`;
        d.addEventListener("click", () => showImage(i));
        thumbsElLocal.appendChild(d);
      });
    }

    function showImage(idx) {
      const gallery = currentItem.images || [];
      if (!gallery.length) return;
      idx = Math.max(0, Math.min(idx, gallery.length - 1));
      currentIndex = idx;
      mainImg.classList.add("switching");
      setTimeout(() => {
        mainImg.src = resolveImagePath(gallery[idx].url);
        mainImg.alt = gallery[idx].caption || "";
        mainImg.classList.remove("switching");
      }, 180);
      captionEl.textContent = gallery[idx].caption || "";
      counterEl.textContent = `${idx + 1} / ${gallery.length}`;
      document
        .querySelectorAll("#sm-thumbs .gm-thumb")
        .forEach((t) =>
          t.classList.toggle("active", parseInt(t.dataset.idx) === idx),
        );
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === gallery.length - 1;
      const active = thumbsEl.querySelector(".gm-thumb.active");
      if (active)
        active.scrollIntoView({
          behavior: "smooth",
          inline: "nearest",
          block: "nearest",
        });
    }

    function sellingKeydown(e) {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") closeSelling();
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
    }

    function closeSelling() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", sellingKeydown);
    }

    // clicking desc toggles full md (only after content is loaded)
    descEl.onclick = (e) => {
      e.stopPropagation();
      if (!loadedMd) return;
      expanded = !expanded;
      renderMarkdownTruncated(loadedMd, expanded);
    };

    // handle wheel events so the description scrolls when possible and outer modal doesn't steal the scroll
    descEl.addEventListener(
      "wheel",
      (ev) => {
        const delta = ev.deltaY;
        const canScrollDown =
          descEl.scrollTop + descEl.clientHeight < descEl.scrollHeight - 1;
        const canScrollUp = descEl.scrollTop > 0;
        const willScrollInside =
          (delta > 0 && canScrollDown) || (delta < 0 && canScrollUp);
        if (willScrollInside) {
          // allow default so the element scrolls, but stop propagation so the page/modal doesn't also scroll
          ev.stopPropagation();
        } else {
          // prevent default to avoid outer scrolling and stop propagation
          ev.preventDefault();
          ev.stopPropagation();
        }
      },
      { passive: false },
    );

    function renderMarkdownTruncated(md, forceFull = false) {
      if (!md) {
        descEl.textContent = "No description provided.";
        return;
      }
      // When not expanded, show a plain-text truncated preview (no markdown formatting)
      if (!forceFull) {
        descEl.classList.remove("expanded");
        // cleanup any previous wrapper or custom scrollbar left over
        try {
          const oldScroll = document.querySelector(".sm-scrollbar");
          if (oldScroll) oldScroll.remove();
        } catch (e) {}
        const parent = descEl.parentElement;
        if (
          parent &&
          parent.classList &&
          parent.classList.contains("sm-desc-wrap")
        ) {
          parent.parentElement.replaceChild(descEl, parent);
        }
        // render to HTML then extract plain text to strip formatting
        const fullHtml = marked.parse(md);
        const tmp = document.createElement("div");
        tmp.innerHTML = fullHtml;
        const plain = (tmp.textContent || tmp.innerText || "").trim();
        let cut = plain.slice(0, 280);
        cut = cut.replace(/\s+\S*$/, "");
        const preview = cut + (plain.length > cut.length ? "..." : "");

        descEl.innerHTML = "";
        const textNode = document.createTextNode(preview);
        descEl.appendChild(textNode);

        if (plain.length > cut.length) {
          const more = document.createElement("div");
          more.style.marginTop = "10px";
          more.innerHTML =
            '<a class="card-btn" style="font-size:10px;padding:6px 10px;">Read more</a>';
          more.querySelector("a").addEventListener("click", (e) => {
            e.stopPropagation();
            renderMarkdownTruncated(md, true);
          });
          descEl.appendChild(more);
        }
      } else {
        // Expanded: render full markdown with formatting and allow native scrolling within the desc box
        descEl.innerHTML = marked.parse(md || "*No description provided.*");
        descEl.classList.add("expanded");
        // remove any leftover custom scrollbar element or wrapper from earlier iterations
        try {
          const oldScroll = document.querySelector(".sm-scrollbar");
          if (oldScroll) oldScroll.remove();
        } catch (e) {}
        // if a wrapper was created earlier, unwrap the desc element back into place
        const parent = descEl.parentElement;
        if (
          parent &&
          parent.classList &&
          parent.classList.contains("sm-desc-wrap")
        ) {
          parent.parentElement.replaceChild(descEl, parent);
        }
        // make sure the box can be focused and scrolled
        descEl.tabIndex = -1;
        descEl.focus({ preventScroll: true });
        descEl.scrollTop = 0;
      }
    }
  };
}

/* --------------------- Tiny hero canvas (keeps original behavior) --------------------- */
function initHeroCanvas() {
  try {
    const canvas = document.getElementById("hero-canvas");
    const ctx = canvas.getContext("2d");
    let W,
      H,
      raf,
      t = 0;
    function mlb32(a) {
      return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let x = Math.imul(a ^ (a >>> 15), 1 | a);
        x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
      };
    }
    const rng = mlb32(42),
      COLS = 30,
      hs = [];
    let h = 0.45;
    for (let i = 0; i < COLS; i++) {
      h += (rng() - 0.5) * 0.11;
      h = Math.max(0.28, Math.min(0.62, h));
      hs.push(h);
    }
    const trng = mlb32(77),
      trees = new Set();
    for (let i = 1; i < COLS - 1; i++) if (trng() > 0.72) trees.add(i);
    const crng = mlb32(13),
      clouds = [];
    for (let i = 0; i < 6; i++)
      clouds.push({
        x: crng() * 1.3 - 0.15,
        y: crng() * 0.22 + 0.04,
        w: crng() * 0.14 + 0.07,
        spd: crng() * 0.000035 + 0.000018,
      });
    const c = (r, g, b) => `rgb(${r},${g},${b})`;
    const SKY0 = [18, 26, 55],
      SKY1 = [70, 148, 210];
    const GR = [77, 155, 58],
      GRD = [47, 95, 35];
    const DT = [130, 92, 62],
      STO = [95, 95, 105];
    const WD = [105, 78, 46],
      LA = [48, 108, 33],
      LB = [34, 85, 22];
    const CLO = [215, 215, 225];

    function draw() {
      t++;
      W = canvas.width;
      H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const grd = ctx.createLinearGradient(0, 0, 0, H * 0.8);
      grd.addColorStop(0, c(...SKY0));
      grd.addColorStop(1, c(...SKY1));
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
      const sr2 = mlb32(5);
      for (let i = 0; i < 50; i++) {
        const sx = sr2() * W,
          sy = sr2() * H * 0.32;
        ctx.globalAlpha = (Math.sin(t * 0.025 + i) * 0.5 + 0.5) * 0.55;
        ctx.fillStyle = "#fff";
        ctx.fillRect(sx | 0, sy | 0, 2, 2);
      }
      ctx.globalAlpha = 1;
      clouds.forEach((cl) => {
        cl.x = (cl.x + cl.spd) % 1.35;
        const cx = cl.x * W,
          cy = cl.y * H,
          cw = cl.w * W,
          ch = Math.max(14, W * 0.016);
        ctx.fillStyle = c(...CLO);
        ctx.fillRect((cx - ch * 0.5) | 0, cy | 0, (cw + ch) | 0, ch | 0);
        ctx.fillRect(cx | 0, (cy - ch) | 0, cw | 0, ch | 0);
        ctx.fillRect(
          (cx + ch) | 0,
          (cy - ch * 0.55) | 0,
          (cw * 0.45) | 0,
          (ch * 0.8) | 0,
        );
      });
      const BLK = Math.max(14, (W / COLS) | 0);
      for (let col = 0; col < COLS; col++) {
        const x = col * BLK,
          top = (hs[col] * H) | 0;
        ctx.fillStyle = c(...(col % 2 ? GR : GRD));
        ctx.fillRect(x, top, BLK, BLK);
        for (let r = 1; r <= 4; r++) {
          ctx.fillStyle = c(
            ...(r % 2 ? DT : [DT[0] - 10, DT[1] - 7, DT[2] - 4]),
          );
          ctx.fillRect(x, top + r * BLK, BLK, BLK);
        }
        for (let r = 5; r <= 14; r++) {
          ctx.fillStyle = c(
            ...(r % 2 ? STO : [STO[0] - 14, STO[1] - 14, STO[2] - 12]),
          );
          ctx.fillRect(x, top + r * BLK, BLK, BLK);
        }
        ctx.fillStyle = "#0d0d0f";
        ctx.fillRect(x, top + 15 * BLK, BLK, H);
        if (trees.has(col)) {
          const tw = BLK * 0.8,
            tx = x + BLK * 0.1,
            ty = top - BLK * 5;
          ctx.fillStyle = c(...WD);
          ctx.fillRect(
            (tx + tw * 0.3) | 0,
            (top - BLK * 3.8) | 0,
            (tw * 0.4) | 0,
            (BLK * 3.8) | 0,
          );
          ctx.fillStyle = c(...LA);
          ctx.fillRect(tx | 0, (ty + BLK) | 0, tw | 0, (BLK * 4) | 0);
          ctx.fillStyle = c(...LB);
          ctx.fillRect(
            (tx + tw * 0.12) | 0,
            ty | 0,
            (tw * 0.76) | 0,
            (BLK * 2.2) | 0,
          );
          ctx.fillRect(
            (tx + tw * 0.04) | 0,
            (ty + BLK) | 0,
            (tw * 0.92) | 0,
            (BLK * 3) | 0,
          );
        }
      }
      raf = requestAnimationFrame(draw);
    }

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    draw();
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      resize();
      draw();
    });
  } catch (e) {
    /* ignore */
  }
}

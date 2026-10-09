import "@/lib/oreui";
import "@/styles/main.css";

import { SITE } from "@/config/site.config";
import { byId, escapeHtml, onReady, qsa } from "@/lib/dom";
import { initCopyBox, initNav } from "@/lib/nav";
import { observeReveals, revealAll } from "@/lib/reveal";
import { buttonColorAttr, hydrateIcons, oreTagHtml, setButtonColor } from "@/lib/oreui";
import { createUiSounds } from "@/lib/sound";
import { renderCards } from "./cards";
import { initGalleryModal } from "./galleryModal";
import { initProfileModal } from "./profileModal";
import { initDetailRouting } from "./routing";
import { initSellingModal } from "./sellingModal";

function renderIdentity(): void {
  const logo = byId("logo-text");
  if (logo) logo.textContent = SITE.brandText ?? SITE.name;

  const heroTitle = byId("hero-title");
  if (heroTitle) heroTitle.textContent = SITE.name;

  const heroSub = byId("hero-sub");
  if (heroSub) heroSub.textContent = SITE.subtitle;

  const footerCopy = byId("footer-copy");
  if (footerCopy) {
    footerCopy.textContent = `© ${new Date().getFullYear()} ${SITE.name} — ${SITE.FOOTER.tagLine}`;
  }

  const footerGh = byId<HTMLAnchorElement>("footer-gh");
  if (footerGh && SITE.github) footerGh.href = SITE.github;
}

function renderStatsAndSkills(): void {
  const stats = byId("stats-row");
  if (stats) {
    for (const stat of SITE.stats) {
      stats.insertAdjacentHTML(
        "beforeend",
        `<div class="stat-item"><span class="stat-num">${escapeHtml(stat.num)}</span><span class="stat-label">${escapeHtml(stat.label)}</span></div>`,
      );
    }
  }

  const skills = byId("skills-wrap");
  if (skills) {
    for (const skill of SITE.skills) {
      skills.insertAdjacentHTML("beforeend", `<span class="skill-chip">${escapeHtml(skill)}</span>`);
    }
  }
}

/** The team section only exists when the config lists members. */
function renderTeam(): void {
  const grid = byId("team-grid");
  const section = byId("team");
  const members = SITE.team.members;

  if (grid && members.length > 0) {
    const label = byId("team-label");
    const heading = byId("team-heading");
    if (label && SITE.team.label) label.textContent = SITE.team.label;
    if (heading && SITE.team.heading) heading.textContent = SITE.team.heading;

    for (const member of members) {
      grid.insertAdjacentHTML(
        "beforeend",
        `<div class="team-card reveal">
           ${oreTagHtml(member.role || "Role", "primary")}
           <h3>${escapeHtml(member.name || "Name")}</h3>
           <p class="team-note">${escapeHtml(member.text ?? "")}</p>
         </div>`,
      );
    }
    return;
  }

  section?.remove();
  byId("team-separator")?.remove();
  byId("nav-team")?.remove();
}

/**
 * Splits `status: "archived"` projects into their own section. Returns each
 * group with its indexes into `SITE.projects`, which the gallery modal and
 * routing are keyed on.
 */
function splitArchivedProjects(): { active: number[]; archived: number[] } {
  const config = SITE.archivedProjects;
  const active: number[] = [];
  const archived: number[] = [];
  SITE.projects.forEach((project, index) => {
    (config.enabled && project.status === "archived" ? archived : active).push(index);
  });

  if (archived.length > 0) {
    const label = byId("archived-label");
    const heading = byId("archived-heading");
    const note = byId("archived-note");
    const navLabel = byId("nav-archived")?.querySelector(".ore-navbar-action-label");
    if (label && config.label) label.textContent = config.label;
    if (heading && config.heading) heading.textContent = config.heading;
    if (note) note.textContent = config.note ?? "";
    if (navLabel && config.navLabel) navLabel.textContent = config.navLabel;
  } else {
    byId("archived")?.remove();
    byId("archived-separator")?.remove();
    byId("nav-archived")?.remove();
  }

  return { active, archived };
}

/** Alternates the band colour across whichever sections are left. */
function stripeSections(): void {
  qsa(".section:not(.section-dark)").forEach((section, index) => {
    section.classList.toggle("section-alt", index % 2 === 1);
  });
}

function renderServices(): void {
  const grid = byId("services-grid");
  if (!grid) return;
  for (const service of SITE.services) {
    grid.insertAdjacentHTML(
      "beforeend",
      `<div class="service-block">
         <span class="service-icon">${escapeHtml(service.icon)}</span>
         <div class="service-name">${escapeHtml(service.name)}</div>
         <p class="service-desc">${escapeHtml(service.desc)}</p>
       </div>`,
    );
  }
}

function renderContact(): void {
  const links = byId("contact-links");
  if (links) {
    if (SITE.email) {
      links.insertAdjacentHTML(
        "beforeend",
        `<a href="mailto:${escapeHtml(SITE.email)}" class="ore-button"${buttonColorAttr("primary")}>Email Me</a>`,
      );
    }
    if (SITE.github) {
      links.insertAdjacentHTML(
        "beforeend",
        `<a href="${escapeHtml(SITE.github)}" target="_blank" rel="noopener noreferrer" class="ore-button"${buttonColorAttr("secondary")}>GitHub</a>`,
      );
    }
  }

  const tag = byId("discord-tag");
  if (tag) tag.textContent = SITE.discord ?? "";
  if (SITE.discord) initCopyBox("discord-box", ".discord-copy", SITE.discord);
}

/** With the store hidden, the hero's second button becomes the configured CTA. */
function hideStoreSection(): void {
  const cta = byId<HTMLAnchorElement>("hero-store-cta");
  if (cta) {
    const config = SITE.storeHiddenCta ?? { action: "copy" as const };
    const action = config.action === "url" ? "url" : "copy";
    const label = config.label?.trim() || (action === "url" ? "Open Link" : "Copy Discord");
    const copyText = config.copyText?.trim() || SITE.discord || "";

    setButtonColor(cta, "blue");
    cta.textContent = label;

    if (action === "url") {
      cta.href = config.url?.trim() || "#contact";
      cta.target = "_blank";
      cta.rel = "noopener noreferrer";
    } else {
      cta.href = "#contact";
      cta.removeAttribute("target");
      cta.removeAttribute("rel");
      cta.addEventListener("click", async (event) => {
        event.preventDefault();
        try {
          await navigator.clipboard.writeText(copyText);
          cta.textContent = "Copied";
        } catch {
          cta.textContent = "Copy failed";
        }
        window.setTimeout(() => {
          cta.textContent = label;
        }, 1200);
      });
    }
  }

  const section = byId("selling");
  if (section) {
    const separator = section.previousElementSibling;
    if (separator?.classList.contains("creative-separator")) separator.remove();
    section.remove();
  }
  qsa<HTMLAnchorElement>('a[href="#selling"]').forEach((link) => link.remove());
}

onReady(() => {
  const sfx = createUiSounds();

  hydrateIcons();
  renderIdentity();
  renderStatsAndSkills();
  renderTeam();
  renderServices();
  renderContact();

  const gallery = initGalleryModal();
  const selling = initSellingModal();

  const projects = splitArchivedProjects();
  const openProject = (indexes: number[]) => (position: number) => {
    sfx.play();
    gallery.open(indexes[position]!);
  };
  renderCards(
    projects.active.map((index) => SITE.projects[index]!),
    "projects",
    openProject(projects.active),
  );
  renderCards(
    projects.archived.map((index) => SITE.projects[index]!),
    "projects",
    openProject(projects.archived),
    "archived-grid",
  );

  // An enabled-but-empty store would render a heading over a blank grid, so
  // treat "no items" the same as the section being switched off.
  const showStore = SITE.featureFlags.showStoreSection && SITE.currentlySelling.length > 0;
  if (showStore) {
    renderCards(SITE.currentlySelling, "selling", (index) => {
      sfx.play();
      selling.open(index);
    });
  } else {
    hideStoreSection();
  }
  stripeSections();

  initNav();
  initProfileModal();
  sfx.bind(".ore-button, .ore-icon-button, .ore-modal-header-button, .ore-tab-button, #nav-toggle, #nav a");

  initDetailRouting({
    openProject: (index, options) => gallery.open(index, options),
    openSelling: (index, options) => selling.open(index, options),
    closeAll: () => {
      gallery.close();
      selling.close();
    },
  });

  window.setTimeout(() => {
    revealAll();
    observeReveals();
  }, 80);
});

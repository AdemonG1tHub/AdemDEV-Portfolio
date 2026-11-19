import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button, Glass, SearchField, SegmentedControl, TabBar } from "glisse";
import { SITE } from "@/config/site.config";
import { projectSlugs } from "@/lib/slug";
import type { Project } from "@/types/site";
import Aurora from "./bits/Aurora";
import BlurText from "./bits/BlurText";
import CountUp from "./bits/CountUp";
import Magnet from "./bits/Magnet";
import ScrollVelocity from "./bits/ScrollVelocity";
import SpotlightCard from "./bits/SpotlightCard";
import SplitText from "./bits/SplitText";
import ProjectModal from "./ProjectModal";
import { ArrowUpRight, DiscordIcon, GithubIcon, GridIcon, HomeIcon, MailIcon, SparkIcon } from "./icons";
import { scrollToTarget, startLenis, stopLenis } from "./lenis";

gsap.registerPlugin(ScrollTrigger);

const DISCORD_INVITE = SITE.storeHiddenCta?.url ?? "https://discord.gg/CN4U5kkfTm";
const STATUS_LABEL = { active: "Active", wip: "In development", archived: "Archived" } as const;
const SECTIONS = ["home", "work", "services", "contact"] as const;

const slugs = projectSlugs(SITE.projects);
const entries = SITE.projects.map((p, i) => ({ p, slug: slugs[i]! }));

/** `#/slug` or `/new/slug` → slug */
function readSlug(): string | null {
  const h = location.hash.match(/^#\/(.+)$/);
  if (h) return decodeURIComponent(h[1]!);
  const m = location.pathname.match(/^\/new\/(.+?)\/?$/);
  return m ? decodeURIComponent(m[1]!) : null;
}

function Cover({ p }: { p: Project }) {
  return p.cover ? (
    <img src={p.cover} alt="" loading="lazy" />
  ) : (
    <div className="cover-fallback" style={{ background: p.color }}>
      {p.icon}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<string>("home");
  const [view, setView] = useState<"projects" | "archive">("projects");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(readSlug);
  const [toast, setToast] = useState("");
  const grid = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);

  const hasArchive = SITE.archivedProjects.enabled && entries.some((e) => e.p.status === "archived");
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter(({ p }) => {
      const archived = p.status === "archived" && SITE.archivedProjects.enabled;
      if ((view === "archive") !== archived) return false;
      if (!q) return true;
      return [p.title, p.desc, ...(p.tags ?? [])].some((s) => s?.toLowerCase().includes(q));
    });
  }, [view, query]);

  // Smooth scroll + section tracking.
  useEffect(() => {
    startLenis();
    const triggers = SECTIONS.map((id) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (s) => s.isActive && setTab(id),
      }),
    );
    return () => {
      triggers.forEach((t) => t.kill());
      stopLenis();
    };
  }, []);

  // Hero + section entrance.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".hero-fade", { opacity: 0, y: 24, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.9 });
      gsap.from(".topbar > *", { opacity: 0, y: -20, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.2 });
      gsap.from(".dock", { opacity: 0, y: 40, duration: 1, ease: "expo.out", delay: 0.6 });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) =>
        gsap.from(el, { opacity: 0, y: 40, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }),
      );
      gsap.to(".hero-orb", { yPercent: -30, ease: "none", scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true } });
    }, main);
    return () => ctx.revert();
  }, []);

  // Stagger cards in whenever the visible set changes.
  useLayoutEffect(() => {
    const el = grid.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(el.children);
    const tween = gsap.fromTo(
      cards,
      { opacity: 0, y: 60, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        clearProps: "transform,opacity",
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [list]);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [list]);

  // Routing for the project modal.
  useEffect(() => {
    const sync = () => setOpen(readSlug());
    addEventListener("hashchange", sync);
    addEventListener("popstate", sync);
    return () => {
      removeEventListener("hashchange", sync);
      removeEventListener("popstate", sync);
    };
  }, []);
  const openProject = (slug: string) => {
    history.pushState(null, "", `${location.pathname.replace(/^(\/new)\/.+$/, "$1")}#/${slug}`);
    setOpen(slug);
  };
  const closeProject = useCallback(() => {
    history.pushState(null, "", "/new");
    setOpen(null);
  }, []);
  const current = open ? entries.find((e) => e.slug.toLowerCase() === open.toLowerCase()) : undefined;

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };
  const copyDiscord = () => {
    navigator.clipboard?.writeText(SITE.discord ?? "").then(() => notify(`Copied ${SITE.discord}`), () => notify(SITE.discord ?? ""));
  };

  const go = (id: string) => scrollToTarget(`#${id}`);

  return (
    <>
      {/* Everything the glass can see through and bend lives in here. */}
      <div className="stage" data-glisse-backdrop>
        <div className="bg" aria-hidden>
          <Aurora />
          <div className="bg-grain" />
        </div>

        <main ref={main}>
          {/* ───────── Hero ───────── */}
          <section id="home" className="hero">
            <div className="hero-orb" aria-hidden />
            <p className="eyebrow hero-fade">
              <span className="pulse" /> Available for commissions
            </p>
            <SplitText as="h1" className="hero-title" text={SITE.name} onScroll={false} delay={0.25} stagger={0.05} />
            <p className="hero-tag hero-fade">
              Software developer, <em>primarily TypeScript.</em>
            </p>
            <BlurText className="hero-sub" text="I build bots, tools, plugins and web apps — mostly in TypeScript, Node.js and Python, with a new project every month." delay={1} />
            <div className="hero-cta hero-fade">
              <Magnet>
                <Button variant="filled" onClick={() => go("work")} style={{ height: 48, borderRadius: 24, padding: "0 26px", fontSize: 15 }}>
                  View my work
                </Button>
              </Magnet>
              <Magnet>
                <Button icon={<DiscordIcon />} onClick={() => window.open(DISCORD_INVITE, "_blank", "noopener")} style={{ height: 48, borderRadius: 24, padding: "0 24px 0 16px", fontSize: 15 }}>
                  Join Discord
                </Button>
              </Magnet>
            </div>

            <div className="stats hero-fade glass">
              {SITE.stats.map((s) => (
                <div key={s.label}>
                  <CountUp value={s.num} className="stat-num" />
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ───────── Skills marquee ───────── */}
          <section className="skills" aria-label="Skills">
            <ScrollVelocity speed={55} items={SITE.skills.map((s) => <b key={s}>{s}</b>)} />
            <ScrollVelocity speed={-45} items={[...SITE.skills].reverse().map((s) => <b key={s} className="alt">{s}</b>)} />
          </section>

          {/* ───────── Work ───────── */}
          <section id="work" className="section">
            <div className="section-head reveal">
              <p className="eyebrow">Selected work</p>
              <SplitText className="h2" text="Things I've built." />
            </div>

            <div className="toolbar reveal">
              {hasArchive ? (
                <SegmentedControl
                  aria-label="Project set"
                  value={view}
                  onValueChange={(v) => setView(v as "projects" | "archive")}
                  items={[
                    { value: "projects", label: "Projects" },
                    { value: "archive", label: SITE.archivedProjects.navLabel ?? "Archive" },
                  ]}
                />
              ) : (
                <span />
              )}
              <SearchField aria-label="Search projects" value={query} onValueChange={setQuery} />
            </div>

            {view === "archive" && SITE.archivedProjects.note && <p className="note reveal">{SITE.archivedProjects.note}</p>}

            <div className="grid" ref={grid}>
              {list.length === 0 && <p className="empty">Nothing matches “{query}”.</p>}
              {list.map(({ p, slug }) => (
                <SpotlightCard
                  key={slug}
                  className="card glass"
                  spotlight={`${p.color ?? "#7aa2ff"}55`}
                  style={{ "--c": p.color ?? "#7aa2ff" } as React.CSSProperties}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${p.title}`}
                  onClick={() => openProject(slug)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), openProject(slug))}
                >
                  <div className="card-cover">
                    <Cover p={p} />
                    <span className={`status ${p.status ?? "active"}`}>
                      <i /> {STATUS_LABEL[p.status ?? "active"]}
                    </span>
                  </div>
                  <div className="card-body">
                    <h3>
                      {p.icon && !p.icon.startsWith("/") && <span className="card-ico">{p.icon}</span>}
                      {p.title}
                    </h3>
                    <p>{p.desc}</p>
                    {p.tags && (
                      <div className="tags">
                        {p.tags.slice(0, 4).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    )}
                    <span className="card-go">
                      View project <ArrowUpRight width={16} height={16} />
                    </span>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </section>

          {/* ───────── Services ───────── */}
          <section id="services" className="section">
            <div className="section-head reveal">
              <p className="eyebrow">What I do</p>
              <SplitText className="h2" text="Built to order." />
            </div>
            <div className="services">
              {SITE.services.map((s) => (
                <SpotlightCard key={s.name} className="service glass reveal" tilt={3}>
                  <span className="service-ico">{s.icon}</span>
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                </SpotlightCard>
              ))}
            </div>
          </section>

          {/* ───────── Contact ───────── */}
          <section id="contact" className="section contact">
            <div className="contact-card glass reveal">
              <p className="eyebrow">Let's talk</p>
              <SplitText className="h2 big" text="Have an idea? Let's build it." />
              <div className="contact-actions">
                <Button variant="filled" icon={<DiscordIcon />} onClick={() => window.open(DISCORD_INVITE, "_blank", "noopener")}>
                  Join Discord
                </Button>
                {SITE.discord && (
                  <Button onClick={copyDiscord} aria-label="Copy Discord username">
                    @{SITE.discord}
                  </Button>
                )}
                {SITE.github && (
                  <Button icon={<GithubIcon />} onClick={() => window.open(SITE.github, "_blank", "noopener")}>
                    GitHub
                  </Button>
                )}
                {SITE.email && (
                  <Button icon={<MailIcon />} onClick={() => (location.href = `mailto:${SITE.email}`)}>
                    Email
                  </Button>
                )}
              </div>
            </div>
            <footer>
              <span>© {new Date().getFullYear()} {SITE.name}</span>
              <span>{SITE.FOOTER.tagLine}</span>
              <a href="/" className="old-link">View classic site</a>
            </footer>
          </section>
        </main>
      </div>

      {/* ───────── Floating chrome (real glass, over the backdrop) ───────── */}
      <header className="topbar">
        <Glass className="brand" style={{ borderRadius: 24 }} onClick={() => go("home")}>
          <img src="/A.png" alt="" width={26} height={26} />
          <span>{SITE.brandText ?? SITE.name}</span>
          <em className="preview-pill">preview</em>
        </Glass>
        <Button icon={<DiscordIcon />} aria-label="Join Discord" onClick={() => window.open(DISCORD_INVITE, "_blank", "noopener")} />
      </header>

      <nav className="dock" aria-label="Sections">
        <TabBar
          aria-label="Sections"
          value={tab}
          onValueChange={(v) => {
            setTab(v);
            go(v);
          }}
          items={[
            { value: "home", label: "Home", icon: <HomeIcon /> },
            { value: "work", label: "Work", icon: <GridIcon /> },
            { value: "services", label: "Services", icon: <SparkIcon /> },
            { value: "contact", label: "Contact", icon: <MailIcon /> },
          ]}
        />
      </nav>

      {toast && <Glass className="toast">{toast}</Glass>}
      {current && <ProjectModal key={current.slug} project={current.p} onClose={closeProject} />}
    </>
  );
}

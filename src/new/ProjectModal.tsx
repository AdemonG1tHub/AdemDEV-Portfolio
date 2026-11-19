import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { Button } from "glisse";
import type { Project } from "@/types/site";
import { fetchMarkdown, normalizeIndent, renderMarkdown } from "@/lib/markdown";
import { isVideoMedia } from "@/lib/media";
import { getLenis } from "./lenis";
import { ArrowUpRight, ChevronLeft, ChevronRight, CloseIcon, DownloadIcon } from "./icons";

interface Props {
  project: Project;
  onClose: () => void;
}

const STATUS_LABEL = { active: "Active", wip: "In development", archived: "Archived" } as const;

export default function ProjectModal({ project: p, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [html, setHtml] = useState("");
  const gallery = p.gallery ?? [];
  const isIcons = p.layout === "icons";
  const media = gallery[i];
  const accent = p.color ?? "#7aa2ff";

  const close = useCallback(() => {
    const r = root.current;
    const pn = panel.current;
    if (!r || !pn) return onClose();
    gsap.to(pn, { y: 40, scale: 0.97, opacity: 0, duration: 0.28, ease: "power2.in" });
    gsap.to(r, { opacity: 0, duration: 0.3, onComplete: onClose });
  }, [onClose]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(root.current, { opacity: 0, duration: 0.3 });
      gsap.from(panel.current, { y: 60, scale: 0.95, opacity: 0, duration: 0.7, ease: "expo.out" });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    getLenis()?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      getLenis()?.start();
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const n = gallery.length;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (!isIcons && n > 1 && e.key === "ArrowRight") setI((v) => (v + 1) % n);
      else if (!isIcons && n > 1 && e.key === "ArrowLeft") setI((v) => (v - 1 + n) % n);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [close, gallery.length, isIcons]);

  useEffect(() => {
    let live = true;
    const src = p.md ?? p.desc ?? "";
    fetchMarkdown(src).then((md) => live && setHtml(renderMarkdown(normalizeIndent(md))));
    return () => {
      live = false;
    };
  }, [p]);

  // Swipe between screenshots.
  const touchX = useRef<number | null>(null);
  const step = (d: number) => setI((v) => (v + d + gallery.length) % gallery.length);

  return (
    <div className="modal" ref={root} onPointerDown={(e) => e.target === e.currentTarget && close()} role="dialog" aria-modal="true" aria-label={p.title}>
      <div className="modal-panel glass" ref={panel} style={{ "--c": accent } as CSSProperties}>
        <div className="modal-close">
          <Button icon={<CloseIcon />} aria-label="Close" onClick={close} />
        </div>
        <div className="modal-scroll" data-lenis-prevent>
          {isIcons ? (
            <div className="icon-grid">
              {gallery.map((g) => (
                <a key={g.url} className="icon-tile" href={g.url} download>
                  <img src={g.url} alt={g.caption ?? ""} />
                  <span>{g.caption}</span>
                  <DownloadIcon width={16} height={16} />
                </a>
              ))}
            </div>
          ) : media ? (
            <div
              className="viewer"
              onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
              onTouchEnd={(e) => {
                const x0 = touchX.current;
                const x1 = e.changedTouches[0]?.clientX;
                touchX.current = null;
                if (x0 == null || x1 == null || gallery.length < 2 || Math.abs(x1 - x0) < 40) return;
                step(x1 < x0 ? 1 : -1);
              }}
            >
              {isVideoMedia(media) ? (
                <video key={media.url} src={media.url} poster={media.poster} controls autoPlay muted loop playsInline />
              ) : (
                <img key={media.url} src={media.url} alt={media.caption ?? p.title} />
              )}
              {gallery.length > 1 && (
                <>
                  <div className="viewer-nav left">
                    <Button icon={<ChevronLeft />} aria-label="Previous" onClick={() => step(-1)} />
                  </div>
                  <div className="viewer-nav right">
                    <Button icon={<ChevronRight />} aria-label="Next" onClick={() => step(1)} />
                  </div>
                </>
              )}
              {media.caption && (
                <div className="viewer-cap glass">
                  {media.caption}
                  {gallery.length > 1 && <em>{i + 1}/{gallery.length}</em>}
                </div>
              )}
            </div>
          ) : p.cover ? (
            <div className="viewer">
              <img src={p.cover} alt={p.title} />
            </div>
          ) : null}

          {!isIcons && gallery.length > 1 && (
            <div className="thumbs" data-lenis-prevent>
              {gallery.map((g, k) => (
                <button key={g.url} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={g.caption ?? `Image ${k + 1}`}>
                  {isVideoMedia(g) ? <span>▶</span> : <img src={g.url} alt="" loading="lazy" />}
                </button>
              ))}
            </div>
          )}

          <div className="modal-body">
            <div className="modal-head">
              <h3>{p.title}</h3>
              <span className={`status ${p.status ?? "active"}`}>
                <i /> {STATUS_LABEL[p.status ?? "active"]}
              </span>
            </div>
            {p.tags && (
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            )}
            <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
            {p.links && p.links.length > 0 && (
              <div className="modal-links">
                {p.links.map((l, k) => (
                  <Button
                    key={l.url}
                    variant={k === 0 ? "filled" : "glass"}
                    icon={<ArrowUpRight />}
                    onClick={() => window.open(l.url, l.url.startsWith("/") ? "_self" : "_blank", "noopener")}
                  >
                    {l.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

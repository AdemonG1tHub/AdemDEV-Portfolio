/** Staggers in every `.reveal` element currently in the document. */
export function revealAll(stepMs = 40): void {
  document.querySelectorAll<HTMLElement>(".reveal").forEach((node, i) => {
    window.setTimeout(() => node.classList.add("in"), i * stepMs);
  });
}

/** Reveals elements added after first paint, as they scroll into view. */
export function observeReveals(root: ParentNode = document): void {
  const targets = Array.from(root.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
  if (targets.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((node) => node.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );

  targets.forEach((node) => observer.observe(node));
}

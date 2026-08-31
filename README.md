# AdemDEV Website

A Minecraft-themed portfolio and add-on site, built with **TypeScript + Vite**.

Three routes, one shared design system:

| Route                          | Page                                           |
| ------------------------------ | ---------------------------------------------- |
| `ademdev.xyz`                  | Portfolio — projects, store, services, contact |
| `ademdev.xyz/gilded-utilities` | Gilded Utilities add-on                        |
| `ademdev.xyz/blockbay`         | Block-Bay add-on                               |

Add-on pages all run the **same renderer** (`src/addon/`) over a per-add-on config in
`src/config/addons/`. Adding another one is a config, an `index.html` and one line in
`vite.config.ts` — no renderer changes.

Based off [BetterBedrock.com](https://betterbedrock.com).

## Highlights

- **Config-driven.** Content lives in `src/config/`, typed against `src/types/`, so a bad
  status or colour key fails the build instead of silently rendering nothing.
- **Live menu viewer.** Each add-on page recreates its in-game UI in CSS —
  ActionFormData (grid and list), ChestFormData with hover tooltips, and ModalFormData
  with working inputs. Visitors click through the real menu tree, skinned with that
  add-on's own resource-pack textures.
- **Minecraft `§` formatting.** Menu text is copy-pasted straight from the add-on source
  and renders in the same colours, via `src/lib/mcText.ts`.
- **Themes from config.** An add-on's palette is written to the `--accent-*` CSS tokens
  at load, so recolouring a page never means touching CSS.
- **Deep links.** `#/project-slug` opens a project or store modal directly.
- **No framework.** Plain DOM, ~50 kB of JS per page.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

| Script              | Does                             |
| ------------------- | -------------------------------- |
| `npm run dev`       | Dev server with HMR              |
| `npm run build`     | Typecheck, then build to `dist/` |
| `npm run preview`   | Serve the built `dist/` locally  |
| `npm run typecheck` | `tsc --noEmit` only              |

## Project structure

```text
.
├── index.html                     # Portfolio entry
├── gilded-utilities/index.html    # -> /gilded-utilities
├── blockbay/index.html            # -> /blockbay
├── public/                        # Served verbatim at the site root
│   ├── fonts/  images/  sounds/  ui/  markdown/
│   ├── gilded/icons/  gilded/ui/  # Gilded Utilities pack assets
│   ├── blockbay/ui/               # Block-Bay pack assets
│   ├── A.png
│   └── _redirects                 # Host rewrites (see Deployment)
├── src/
│   ├── config/                    # >>> EDIT CONTENT HERE <<<
│   │   ├── site.config.ts         # Portfolio content
│   │   └── addons/
│   │       ├── gilded-utilities.ts        # theme, features, download, stats
│   │       ├── gilded-utilities.menus.ts  # live menu viewer
│   │       ├── blockbay.ts
│   │       └── blockbay.menus.ts
│   ├── pages/                     # One tiny entry per add-on page
│   ├── types/                     # Config shapes, enforced at build time
│   ├── lib/                       # dom, colors, icon, media, markdown, mcText, nav
│   ├── portfolio/                 # Portfolio page modules
│   ├── addon/                     # Shared add-on page renderer
│   │   ├── page.ts                # initAddonPage(config)
│   │   ├── features.ts            # Feature grid + walkthrough panel
│   │   └── menuViewer/            # ActionForm / ChestForm / ModalForm renderers
│   └── styles/                    # tokens, layout, components, modals, mcui, addon
├── design/                        # Source art files (not deployed)
└── vite.config.ts
```

## Editing content

### Portfolio — `src/config/site.config.ts`

Hero text, stats, skills, projects, team, services, store items, profile menu.
Local paths are root-absolute (`/images/foo.png`); external links are absolute URLs.

A project or store item's `md` takes either inline markdown or a path such as
`/markdown/astral-engine.md`. When set it replaces `desc` in the modal and turns on the
Default/Minecraft font switcher.

An `icon` is either an emoji or an image — `"🪙"`, `/images/glyphs/coin.png`, or a remote
URL such as a custom Discord emoji. Values that look like a path render as an `<img>`.

### Add-on pages — `src/config/addons/<slug>.ts`

The `features` array is the page's main content. Each entry renders as a tile plus a full
walkthrough panel:

```ts
{
  id: "warps",
  name: "Warps",
  icon: "/gilded/icons/set_bounty.png",   // or an emoji
  summary: "One line for the tile.",
  overview: "A paragraph for the panel.",
  steps: [{ title: "Do this", text: "…", code: "/gilded:setup" }],
  commands: [{ command: "/gilded:menu", desc: "…", permission: "Any" }],
  requires: ["gildedutils.admin tag"],
  options: [{ name: "Warp name", desc: "…" }],
  demoMenu: "warps",   // jumps the live viewer to this menu
}
```

`theme` sets the whole page palette. `download.buttons` drives the download band — add,
remove or reorder freely. `demoButtonColor` picks the skin for the "Open this in the live
menu" button, since the button textures are fixed.

### Live menu viewer — `src/config/addons/<slug>.menus.ts`

Every screen in the preview, and which button opens which menu. Four layouts:

| `kind`        | Recreates                                                |
| ------------- | -------------------------------------------------------- |
| `action-grid` | `ActionFormData` as tiles (the main menu)                |
| `action-list` | `ActionFormData` as rows with a left icon                |
| `chest`       | `ChestFormData`, 9 slots per row, hover tooltips         |
| `modal`       | `ModalFormData` — textField / toggle / slider / dropdown |

Wire a button with `opens: "menu-id"`, or give it `note: "§aSaved."` to show chat-style
feedback instead. `back: "menu-id"` sets where the window's ✕ goes.

Labels accept Minecraft `§` colour codes; `{player}` and `{server}` are substituted from
`playerName` / `serverName`. `skin: "gilded" | "chest"` picks the window chrome, and the
optional `chest` block points at that add-on's own container textures. Set `navLabel` on
a menu whose title is a coloured wordmark so the jump chips and breadcrumb stay readable.

## Deployment

Build output is `dist/`. Set your host's publish directory to `dist` and its build command
to `npm run build`.

`public/_redirects` (Netlify / Cloudflare Pages) keeps each add-on page serving its own
document while everything else falls through to the portfolio:

```text
/gilded-utilities      /gilded-utilities/index.html  200
/gilded-utilities/*    /gilded-utilities/index.html  200
/blockbay              /blockbay/index.html          200
/blockbay/*            /blockbay/index.html          200
/*                     /index.html                   200
```

On a host without `_redirects` support the directory index still resolves
`/gilded-utilities/`, so only the extension-less URLs need the rule. Locally the
`cleanUrls()` plugin in `vite.config.ts` does the same for `npm run dev` and
`npm run preview`.

### Adding another add-on page

1. `src/config/addons/<slug>.ts` and `<slug>.menus.ts`
2. `src/pages/<slug>.ts` — three lines, calling `initAddonPage(CONFIG)`
3. `<slug>/index.html` — copy an existing one, change the meta and the script src
4. One line in `vite.config.ts` `rollupOptions.input`, and two in `public/_redirects`

## Asset notes

- Everything under `public/` is served from the site root — reference it as `/images/...`.
- Project covers look best at a wide banner ratio (about 1000 x 400).
- `public/gilded/*` and `public/blockbay/*` are copied from each add-on's resource pack;
  re-copy them if that add-on's artwork changes.

## License

MIT — see [LICENSE](LICENSE).
